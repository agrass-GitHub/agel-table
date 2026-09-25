const assert = require('node:assert/strict')
const { test, after, afterEach } = require('node:test')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const { createRequire } = require('node:module')
const { JSDOM } = require('jsdom')
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { pretendToBeVisual: true, url: 'http://localhost' })
for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle']) {
  Object.defineProperty(global, key, { configurable: true, value: dom.window[key] })
}
const frames = new Map()
let frameId = 0
// 控制动画帧，复现同一帧滚动风暴，不依赖机器计时精度。
window.requestAnimationFrame = (callback) => {
  frames.set(++frameId, callback)
  return frameId
}
window.cancelAnimationFrame = (id) => frames.delete(id)
// DOM 测试只模拟浏览器几何尺寸，Vue 和 Element UI 渲染、事件、状态均运行真实实现。
Object.defineProperties(HTMLElement.prototype, {
  clientHeight: {
    configurable: true,
    get() {
      return this.classList.contains('el-table__body-wrapper') ? this.testHeight ?? 320 : 352
    }
  },
  clientWidth: {
    configurable: true,
    get() {
      return 800
    }
  },
  offsetHeight: {
    configurable: true,
    get() {
      return this.classList.contains('el-table__header-wrapper') ? 32 : this.clientHeight
    }
  },
  offsetWidth: {
    configurable: true,
    get() {
      return 800
    }
  }
})
const Vue = require('vue')
Vue.config.productionTip = false
Vue.config.devtools = false
const errors = []
const fixtures = new Set()
Vue.config.errorHandler = (error) => errors.push(error)
Vue.use(require('element-ui'))
const root = path.resolve(__dirname, '..')
const babelRequire = createRequire(require.resolve('@vue/cli-plugin-babel/package.json'))
const babel = babelRequire('@babel/core')
const modules = new Map()
// 编译实际组件与 agel-table 源码，复用 Element UI 发布的同版本工具代码。
function loadSource(file) {
  file = fs.realpathSync(file)
  if (modules.has(file)) return modules.get(file).exports
  const module = { exports: {} }
  modules.set(file, module)
  const localRequire = createRequire(file)
  const { code } = babel.transformSync(fs.readFileSync(file, 'utf8'), {
    filename: file,
    babelrc: false,
    configFile: false,
    plugins: [babelRequire.resolve('@babel/plugin-transform-modules-commonjs')]
  })
  const execute = vm.runInThisContext(`(function(require, module, exports) { ${code}\n})`, { filename: file })
  execute(
    (name) => {
      if (name.startsWith('element-ui/src/utils/')) return localRequire(name.replace('/src/', '/lib/'))
      const resolved = localRequire.resolve(name)
      if (name.startsWith('.') || name.startsWith('agel-table') || name.startsWith('element-ui/packages/table/src/')) return loadSource(resolved)
      return localRequire(name)
    },
    module,
    module.exports
  )
  return module.exports
}
const LegacyTable = loadSource(require.resolve('agel-table-legacy')).default
const AgelTable = loadSource(path.join(root, 'src/index.js')).default
const SystemTable = AgelTable
const VirtualAgelTable = AgelTable
const { getVirtualRange } = loadSource(path.join(root, 'src/virtual-scroll.js'))
Vue.use(AgelTable, {
  table: { highlightCurrentRow: true },
  page: { enable: true, height: 35 },
  queryProps: { currentPage: 'current', pageSize: 'size', orderColumn: 'orderColumn', order: (value) => ['order', value === 'descending' ? 1 : 0] }
})
Vue.component('system-table', SystemTable)
Vue.component('legacy-table', LegacyTable)
// 生成有稳定对象引用的数据，验证选中、排序和实时编辑不会克隆业务行。
function rows(length) {
  return Array.from({ length }, (_, id) => ({ id, name: `车辆-${id}`, speed: id, enabled: id % 2 === 0 }))
}
// 刷新 Vue 队列及可控动画帧；帧数受限用于发现重排死循环。
async function settle() {
  for (let i = 0; i < 12; i++) {
    await Vue.nextTick()
    if (!frames.size) {
      await Vue.nextTick()
      if (!frames.size) break
    }
    const pending = [...frames.values()]
    frames.clear()
    pending.forEach((callback) => callback(0))
  }
  assert.equal(frames.size, 0, '动画帧应在有限次数内稳定')
  assert.deepEqual(errors.splice(0), [], 'Vue 渲染和事件不得出现异常')
}
// 按业务实际用法挂载 v-model、attach、插槽和 ref，不直接调用渲染函数。
async function mount(options = {}, extra = {}) {
  const parent = new Vue({
    data: () => ({
      table: {
        data: rows(1000),
        columns: [
          { type: 'index', width: 60, fixed: 'left' },
          { prop: 'name', label: '车牌', slotColumn: 'name' },
          { prop: 'speed', label: '速度', sortable: true, fixed: 'right' }
        ],
        virtual: { enable: true, rowHeight: 32 },
        height: 352,
        border: true,
        stripe: true,
        page: { enable: false },
        ...options
      },
      attached: extra.attach || {},
      suffix: '实时',
      visible: true
    }),
    // 字符串 scoped slot 和普通具名 slot 与页面的模板编译结果一致。
    render(h) {
      const grid = h(
        extra.legacy ? 'legacy-table' : 'system-table',
        {
          model: {
            value: this.table,
            callback: (value) => {
              this.table = value
            }
          },
          props: { attach: this.attached },
          ref: 'grid',
          class: 'business-table',
          scopedSlots: { name: ({ row }) => h('span', { class: 'custom-name' }, `${row.name}-${this.suffix}`) }
        },
        [h('span', { slot: 'empty' }, '暂无车辆')]
      )
      return extra.keepAlive ? h('keep-alive', [this.visible ? grid : null]) : grid
    }
  }).$mount()
  fixtures.add(parent)
  document.body.appendChild(parent.$el)
  await settle()
  return {
    parent,
    grid: parent.$refs.grid,
    table: parent.table,
    destroy() {
      parent.$destroy()
      parent.$el.remove()
      fixtures.delete(parent)
    }
  }
}
// 模拟实际滚动事件，保留 Element UI 的固定列/表头同步监听。
function scroll(grid, top) {
  const wrapper = grid.$refs.table.bodyWrapper
  wrapper.scrollTop = top
  wrapper.dispatchEvent(new window.Event('scroll'))
}

test('普通表格继续使用原组件，虚拟表格保留根节点、原生 ref、slots 和行对象', async () => {
  const plain = await mount({ virtual: { enable: false } })
  assert.equal(plain.grid.$options.name, 'agel-table')
  plain.destroy()
  const fixture = await mount()
  const { grid, table } = fixture
  assert.equal(grid.$options.name, VirtualAgelTable.name)
  assert.equal(grid.$el.tagName, 'DIV')
  assert.ok(grid.$el.classList.contains('agel-table'))
  assert.ok(grid.$el.classList.contains('business-table'))
  assert.equal(table.getRef(), grid.$refs.table)
  assert.equal(table.getCol('name').prop, 'name')
  assert.equal(grid._virtual.rows, table.data)
  assert.equal(grid.virtualScroll.renderData[0], table.data[0])
  assert.ok(grid.$el.querySelector('.custom-name').textContent.includes('车辆-0-实时'))
  assert.equal(grid.$el.querySelectorAll('.virtual-scroll-placeholder').length, 3)
  fixture.destroy()
})

test('真实模板编译后的 attrs 正确转发 value/attach，普通和虚拟表格都能展示异步数据', async () => {
  const compiler = require('vue-template-compiler')
  for (const enable of [false, true]) {
    for (const binding of ['v-model="table"', ':value="table"']) {
      // 使用 SFC 相同的模板编译器，覆盖 attrs 被 Vue 提取为 props 后的转发过程。
      const compiled = compiler.compileToFunctions(`<system-table ${binding} :attach="{ data: records }" ref="grid" />`)
      const parent = new Vue({
        data: () => ({
          records: [],
          table: { data: [], columns: [{ prop: 'name', label: '车牌' }], height: 352, page: { enable: false }, virtual: { enable, rowHeight: 32 } }
        }),
        render: compiled.render,
        staticRenderFns: compiled.staticRenderFns
      }).$mount()
      fixtures.add(parent)
      document.body.appendChild(parent.$el)
      await settle()
      // 模拟接口数据返回及后续数据替换，不能依赖 render 函数显式传 props。
      parent.records = rows(18)
      await settle()
      const grid = parent.$refs.grid
      assert.equal(grid.attach.data, parent.records)
      assert.equal(grid.value, parent.table)
      assert.equal(parent.table.data, parent.records)
      assert.equal(parent.table.getRef(), grid.$refs.table)
      assert.ok(grid.$el.querySelector('.el-table__body-wrapper tbody').textContent.includes('车辆-0'))
      parent.records = rows(3)
      await settle()
      assert.equal(grid.$el.querySelectorAll('.el-table__body-wrapper .el-table__row').length, 3)
      parent.$destroy()
      parent.$el.remove()
      fixtures.delete(parent)
    }
  }
})

test('10 万行、100 次同帧滚动只安排一次窗口更新，小幅滚动不重建窗口或主动布局', async () => {
  const fixture = await mount({ data: rows(100000) })
  const { grid, table } = fixture
  let unrelatedDependencies = 0
  const distantDependency = table.data[99999].__ob__.dep
  const depend = distantDependency.depend
  distantDependency.depend = function (...args) {
    unrelatedDependencies++
    return depend.apply(this, args)
  }
  let updates = 0,
    layouts = 0
  const update = grid.updateRenderData
  grid.updateRenderData = (...args) => {
    updates++
    return update(...args)
  }
  const layout = grid.$refs.table.doLayout
  grid.$refs.table.doLayout = (...args) => {
    layouts++
    return layout(...args)
  }
  for (let i = 1; i <= 100; i++) scroll(grid, 32000 + i)
  await settle()
  assert.equal(updates, 1)
  assert.equal(layouts, 0)
  assert.ok(grid.virtualScroll.renderData.length <= 23)
  const windowData = grid.virtualScroll.renderData
  scroll(grid, 32101)
  await settle()
  assert.equal(grid.virtualScroll.renderData, windowData)
  assert.equal(layouts, 0)
  assert.equal(unrelatedDependencies, 0, '滚动不得为窗口外的全量行收集依赖')
  assert.ok(grid.$el.querySelectorAll('.el-table__body-wrapper .el-table__row').length <= 23)
  fixture.destroy()
})

test('跨窗口勾选、全量全选、selectable 与事件顺序保持一致', async () => {
  const events = []
  const fixture = await mount({
    columns: [{ type: 'selection', selectable: (row) => row.enabled }, { prop: 'name' }],
    on: {
      select: (selection, row) => events.push(['select', selection, row]),
      'selection-change': (selection) => events.push(['change', selection]),
      'select-all': (selection) => events.push(['all', selection])
    }
  })
  const { grid, table } = fixture
  grid.$el.querySelector('.el-table__body-wrapper input[type=checkbox]').click()
  await settle()
  assert.equal(events[0][0], 'select')
  assert.equal(events[0][2], table.data[0])
  assert.equal(events[1][0], 'change')
  scroll(grid, 16000)
  await settle()
  assert.equal(grid._virtual.selected.has(table.data[0]), true)
  grid.$el.querySelector('.el-table__header-wrapper input[type=checkbox]').click()
  await settle()
  assert.equal(events.at(-2)[0], 'all')
  assert.equal(events.at(-1)[1].length, 500)
  assert.ok(events.at(-1)[1].every((row) => row.enabled))
  assert.equal(grid.$el.querySelector('.el-table__header-wrapper input').checked, true)
  grid.$el.querySelector('.el-table__header-wrapper input').click()
  await settle()
  assert.equal(grid._virtual.selected.size, 0)
  fixture.destroy()
})

test('全量排序、取消排序、自定义排序与全局序号在切换窗口后正确', async () => {
  const fixture = await mount()
  const { grid, table } = fixture
  table.getRef().sort('speed', 'descending')
  await settle()
  assert.equal(grid.virtualScroll.renderData[0], table.data[999])
  table.virtualScrollToRow(500)
  await settle()
  assert.equal(table.getVirtualRowIndex(0), grid.virtualScroll.startIndex)
  assert.equal(grid.virtualScroll.renderData[0].id, 999 - grid.virtualScroll.startIndex)
  const index = grid.$el.querySelector('.el-table__body-wrapper tbody tr td .cell')
  assert.equal(Number(index.textContent), grid.virtualScroll.startIndex + 1)
  table.getRef().clearSort()
  await settle()
  assert.equal(grid.virtualScroll.renderData[0], table.data[grid.virtualScroll.startIndex])
  fixture.destroy()
})

test('对象定位、左右固定列位移与数据变短后的滚动范围同步', async () => {
  const fixture = await mount()
  const { grid, table } = fixture
  table.virtualScrollToRow(table.data[900])
  table.getRef().setCurrentRow(table.data[900])
  await settle()
  assert.equal(table.getRef().store.states.currentRow, table.data[900])
  assert.ok(grid.$el.querySelector('.el-table__body-wrapper .current-row').textContent.includes('车辆-900'))
  assert.equal(grid._virtual.scrollTop, 899 * 32)
  for (const { wrapper, body } of grid._virtual.wrappers) {
    assert.equal(wrapper.scrollTop, 899 * 32)
    assert.equal(body.style.transform, `translateY(${grid.virtualScroll.startIndex * 32}px)`)
  }
  table.data = rows(3)
  await settle()
  assert.equal(grid.virtualScroll.renderData.length, 3)
  assert.equal(grid.virtualScroll.startIndex, 0)
  assert.equal(grid.$refs.table.bodyWrapper.scrollTop, 0)
  table.data = []
  await settle()
  assert.equal(grid.virtualScroll.renderData.length, 0)
  assert.ok(grid.$el.textContent.includes('暂无车辆'))
  fixture.destroy()
})

test('attach 替换、数组原地排序和实时行字段修改都更新界面', async () => {
  const fixture = await mount({}, { attach: { data: rows(100) } })
  const { grid, table, parent } = fixture
  assert.equal(table.data, parent.attached.data)
  parent.attached.data.sort((a, b) => b.id - a.id)
  await settle()
  assert.equal(grid.virtualScroll.renderData[0].id, 99)
  parent.attached.data[0].name = '实时车辆'
  await settle()
  assert.ok(grid.$el.querySelector('.custom-name').textContent.includes('实时车辆'))
  parent.suffix = '新状态'
  await settle()
  assert.ok(grid.$el.querySelector('.custom-name').textContent.includes('新状态'))
  parent.attached.data = rows(20)
  await settle()
  assert.equal(table.data, parent.attached.data)
  assert.equal(grid.virtualScroll.renderData[0].id, 0)
  fixture.destroy()
})

test('32/36px 样式与原组件一致，尺寸变化和动态固定列不累积占位节点或监听', async () => {
  const fixture = await mount()
  const { grid, table } = fixture
  table.virtual.rowHeight = 36
  await settle()
  assert.ok(grid._virtual.style.textContent.includes('height: 35px !important; line-height: 35px'))
  const main = grid.$refs.table.bodyWrapper
  const listenerCount = main.__resizeListeners__.length
  main.testHeight = 640
  grid.onVirtualResize()
  await settle()
  assert.ok(grid.virtualScroll.renderData.length >= 18)
  table.columns[0].fixed = false
  await settle()
  assert.equal(grid._virtual.wrappers.length, 2)
  assert.equal(main.__resizeListeners__.length, listenerCount)
  assert.equal(grid.$el.querySelectorAll('.virtual-scroll-placeholder').length, 2)
  table.columns[0].fixed = 'left'
  await settle()
  assert.equal(grid._virtual.wrappers.length, 3)
  assert.equal(main.__resizeListeners__.length, listenerCount)
  fixture.destroy()
})

test('分页请求、loading、回填及 query 映射沿用原有协议', async () => {
  const requests = []
  const fixture = await mount({
    page: { enable: true },
    request(query, done) {
      requests.push({ ...query })
      done({ data: rows(50), total: 900 })
    }
  })
  const { grid, table } = fixture
  grid.pageChange(3)
  await settle()
  assert.equal(requests[0].current, 3)
  assert.equal(table.page.total, 900)
  assert.equal(table.loading, false)
  assert.equal(grid._virtual.rows.length, 50)
  assert.ok(grid.$el.querySelector('.el-pagination'))
  grid.sizeChange(50)
  await settle()
  assert.equal(requests[1].current, 1)
  assert.equal(requests[1].size, 50)
  fixture.destroy()
})

test('销毁取消动画帧、监听和样式，迟到的 scroll 不再更新', async () => {
  const fixture = await mount({ resize: { enable: true } })
  const { grid } = fixture
  const wrapper = grid.$refs.table.bodyWrapper
  const styleId = grid._virtual.style.id
  scroll(grid, 10000)
  window.dispatchEvent(new window.Event('resize'))
  const scheduled = grid._virtual.frame
  assert.ok(frames.has(scheduled))
  fixture.destroy()
  assert.equal(frames.has(scheduled), false)
  assert.equal(document.getElementById(styleId), null)
  assert.equal((wrapper.__resizeListeners__ || []).includes(grid.onVirtualResize), false)
  wrapper.dispatchEvent(new window.Event('scroll'))
  await settle()
  assert.equal(grid._virtual.frame, null)
})

test('新旧虚拟表格的行样式规则、首行 DOM、列宽和表头文本一致', async () => {
  // 固定行高分别覆盖实时监控和 GPS 设置两类现有用法。
  for (const rowHeight of [32, 36]) {
    const old = await mount({ virtual: { enable: true, rowHeight } }, { legacy: true })
    const updated = await mount({ virtual: { enable: true, rowHeight } })
    // 表格/列 id 为 Element UI 自动生成，比较时只归一化这些实例标识。
    const normalize = (html) => html.replace(/el-table_\d+_column_\d+/g, 'column-id').replace(/\s+/g, ' ')
    assert.equal(
      normalize(updated.grid.$el.querySelector('.el-table__body-wrapper tbody tr').outerHTML),
      normalize(old.grid.$el.querySelector('.el-table__body-wrapper tbody tr').outerHTML)
    )
    assert.equal(
      updated.grid.$el.querySelector('.el-table__header-wrapper').textContent,
      old.grid.$el.querySelector('.el-table__header-wrapper').textContent
    )
    assert.deepEqual(
      updated.table.getRef().store.states.columns.map(({ width, fixed, align }) => [width, fixed, align]),
      old.table.getRef().store.states.columns.map(({ width, fixed, align }) => [width, fixed, align])
    )
    const originalCss = document.getElementById('dynamic-style-' + old.grid.tableId).sheet.cssRules
    const nextCss = updated.grid._virtual.style.sheet.cssRules
    const normalizeCss = (rules, id) => [...rules].map((rule) => rule.cssText.replaceAll(id, 'table-id').replace(/\s+/g, ' '))
    assert.deepEqual(normalizeCss(nextCss, updated.grid.tableId), normalizeCss(originalCss, old.grid.tableId))
    old.destroy()
    updated.destroy()
  }
})

test('隐藏、尺寸恢复、keep-alive 暂停恢复后保留选择与滚动位置', async () => {
  const fixture = await mount({ columns: [{ type: 'selection' }, { prop: 'name' }] }, { keepAlive: true })
  const { grid, parent } = fixture
  grid.$el.querySelector('.el-table__body-wrapper input').click()
  scroll(grid, 12000)
  await settle()
  const visible = grid.virtualScroll.renderData
  parent.visible = false
  await settle()
  assert.equal(grid._virtual.active, false)
  grid.scheduleVirtualFrame(true)
  assert.equal(grid._virtual.frame, null)
  parent.visible = true
  await settle()
  assert.equal(parent.$refs.grid, grid)
  assert.equal(grid._virtual.scrollTop, 12000)
  assert.equal(grid._virtual.selected.size, 1)
  const main = grid.$refs.table.bodyWrapper
  main.testHeight = 0
  grid.onVirtualResize()
  await settle()
  assert.deepEqual(grid.virtualScroll.renderData, visible)
  main.testHeight = 640
  grid.onVirtualResize()
  await settle()
  assert.ok(grid.virtualScroll.renderData.length > visible.length)
  fixture.destroy()
})

test('默认排序、sortMethod、动态列与选择清理保持可用', async () => {
  const fixture = await mount({
    columns: [
      { type: 'selection' },
      { type: 'index', index: (index) => `第${index + 1}项` },
      { prop: 'speed', sortable: true, sortMethod: (a, b) => b.speed - a.speed }
    ],
    defaultSort: { prop: 'speed', order: 'ascending' }
  })
  const { grid, table } = fixture
  assert.equal(grid.virtualScroll.renderData[0].id, 999)
  assert.ok(grid.$el.textContent.includes('第1项'))
  grid.$el.querySelector('.el-table__header-wrapper input').click()
  await settle()
  assert.equal(grid._virtual.selected.size, 1000)
  table.data = rows(5)
  await settle()
  assert.equal(grid._virtual.selected.size, 0)
  assert.equal(grid.$el.querySelector('.el-table__header-wrapper input').checked, false)
  table.data = []
  await settle()
  assert.equal(grid.$el.querySelector('.el-table__header-wrapper input').disabled, true)
  fixture.destroy()
})

test('运行时关闭并重启虚拟模式，数据、样式与尺寸观察器重新生效', async () => {
  const fixture = await mount({ data: rows(30) })
  const { grid, table } = fixture
  const wrapper = table.getRef().bodyWrapper
  const observer = wrapper.__ro__
  table.virtual.enable = false
  await settle()
  assert.equal(grid.$el.querySelectorAll('.virtual-scroll-placeholder').length, 0)
  assert.equal(grid.$el.querySelectorAll('.el-table__body-wrapper .el-table__row').length, 30)
  table.virtual.enable = true
  await settle()
  assert.ok(grid.virtualScroll.renderData.length < 30)
  assert.notEqual(wrapper.__ro__, observer)
  assert.ok(wrapper.__resizeListeners__.includes(grid.onVirtualResize))
  fixture.destroy()
})

test('请求竞态：迟到的成功或失败不得覆盖新数据、分页和 loading', async () => {
  const requests = []
  const fixture = await mount({ virtual: { enable: false }, page: { enable: true }, request(query, done, err) { requests.push({ done, err }) } })
  const { table } = fixture
  const first = table.getData()
  await settle()
  const second = table.getData()
  await settle()
  const latest = rows(3)
  requests[1].done({ data: latest, total: 30 })
  await second
  requests[0].done({ data: rows(10), total: 100 })
  await first
  await settle()
  assert.equal(table.data, latest)
  assert.equal(table.page.total, 30)
  const third = table.getData()
  await settle()
  const fourth = table.getData()
  await settle()
  requests[2].err(new Error('旧请求失败'))
  await third
  assert.equal(table.loading, true)
  requests[3].done([])
  await fourth
  assert.equal(table.loading, false)
  fixture.destroy()
})

test('request 同步抛错和 async 拒绝都结束 loading，并且 getData 可以正常结束', async () => {
  for (const request of [function (query, done) { throw new Error('同步异常') }, async function (query, done) { throw new Error('异步异常') }]) {
    const fixture = await mount({ request })
    await fixture.table.getData()
    await settle()
    assert.equal(fixture.table.loading, false)
    fixture.destroy()
  }
})

test('请求发出后更换配置或销毁组件，不再回填旧响应', async () => {
  const pending = []
  const fixture = await mount({ request(query, done) { pending.push(done) } })
  const first = fixture.table.getData()
  await settle()
  const replacement = { data: rows(2), columns: [], page: { enable: false } }
  fixture.parent.table = replacement
  await settle()
  pending[0](rows(10))
  await first
  assert.equal(replacement.data.length, 2)
  fixture.destroy()
  const next = await mount({ request(query, done) { pending.push(done) } })
  const original = next.table.data
  const result = next.table.getData()
  await settle()
  next.destroy()
  pending[1](rows(3))
  await result
  assert.equal(next.table.data, original)
})

test('五万行连续合并不溢栈，横向与纵向合并结果和旧版一致', async () => {
  const merge = loadSource(path.join(root, 'src/merge.js')).default
  const oldMerge = loadSource(require.resolve('agel-table-legacy/src/merge.js')).default
  // 先与旧实现逐格对比，再单独覆盖会导致旧版递归溢出的长段。
  const data = [{ a: 1, b: 1 }, { a: 1, b: 2 }, { a: 2, b: 2 }, { a: 2, b: 2 }]
  for (const direction of ['vertical', 'horizontal']) {
    const state = { value: { data, merge: { direction } }, mergeColumns: [{ index: 0, name: 'a' }, { index: 1, name: 'b' }] }
    assert.deepEqual(merge.methods.getMergeData.call({ ...state, ...merge.methods }), oldMerge.methods.getMergeData.call({ ...state, ...oldMerge.methods }))
  }
  const state = { value: { data: Array.from({ length: 50000 }, () => ({ a: '相同值' })), merge: {} }, mergeColumns: [{ index: 0, name: 'a' }], ...merge.methods }
  const result = state.getMergeData()
  assert.deepEqual(result['0_0'], [50000, 1])
  assert.deepEqual(result['0_49999'], [0, 1])
})

test('普通表格行更新不主动重排，窗口 resize 合并且销毁时取消', async () => {
  const fixture = await mount({ virtual: { enable: false }, resize: { enable: true }, data: rows(3) })
  let layouts = 0
  fixture.table.getRef().doLayout = () => { layouts++ }
  fixture.table.data[0].name = '实时更新'
  await settle()
  assert.equal(layouts, 0)
  for (let i = 0; i < 100; i++) window.dispatchEvent(new window.Event('resize'))
  const frame = fixture.grid._resizeFrame
  assert.ok(frames.has(frame))
  fixture.destroy()
  assert.equal(frames.has(frame), false)
  await settle()
})

test('对象配置列通过 getCol 和嵌套表头展开仍按属性返回', async () => {
  const columns = { name: { label: '姓名', children: [{ prop: 'first' }, { prop: 'last' }] }, age: { label: '年龄' } }
  const fixture = await mount({ columns, virtual: { enable: false } })
  assert.deepEqual(fixture.grid.getFlatColumns(columns).map((column) => column.prop), ['first', 'last', 'age'])
  assert.equal(fixture.table.getCol('first').prop, 'first')
  assert.equal(fixture.table.getCol('age').label, '年龄')
  fixture.destroy()
})

test('缓冲窗口覆盖从头到底的大跨度跳跃，边界不越界', () => {
  for (const length of [0, 1, 9, 100, 100000]) {
    for (const rowHeight of [32, 36]) {
      for (const height of [1, 320, 1080]) {
        let previous = null
        const maxTop = Math.max(0, length * rowHeight - height)
        for (const top of [0, 1, maxTop / 2, maxTop, 0]) {
          const scrollTop = Math.min(top, maxTop)
          const range = getVirtualRange(length, scrollTop, height, rowHeight, previous)
          assert.ok(range.start >= 0 && range.start <= range.end && range.end <= length)
          assert.ok(range.start <= Math.floor(scrollTop / rowHeight))
          assert.ok(range.end >= Math.min(length, Math.ceil((scrollTop + height) / rowHeight)))
          assert.ok(range.end - range.start <= Math.ceil(height / rowHeight) + 13)
          previous = range
        }
      }
    }
  }
})

// 关闭 DOM 后不留下 Element UI 的尺寸观察和计时资源。
afterEach(() => {
  for (const parent of fixtures) {
    parent.$destroy()
    parent.$el.remove()
  }
  fixtures.clear()
})
after(async () => {
  await new Promise((resolve) => setTimeout(resolve, 150))
  dom.window.close()
})
