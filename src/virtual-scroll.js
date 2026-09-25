import { orderBy } from 'element-ui/packages/table/src/util'
import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'

// 计算固定行高的可见窗口；缓冲区尚够用时复用旧窗口，避免逐像素重建表格。
export function getVirtualRange(length, scrollTop, viewportHeight, rowHeight, previous, buffer = 6) {
  const first = Math.floor(scrollTop / rowHeight)
  const last = Math.min(length, Math.ceil((scrollTop + viewportHeight) / rowHeight))
  const margin = Math.floor(buffer / 2)
  if (
    previous &&
    previous.end <= length &&
    (previous.start === 0 || first >= previous.start + margin) &&
    (previous.end === length || last <= previous.end - margin)
  ) {
    return previous
  }
  return { start: Math.max(0, first - buffer), end: Math.min(length, last + buffer) }
}

export default {
  // 全量数据、DOM 引用和选中集合不进入 Vue 响应式树，滚动只依赖可见行。
  created() {
    this._virtual = {
      rows: [],
      source: null,
      selected: new Set(),
      checkable: [],
      wrappers: [],
      frame: null,
      active: true,
      mounted: false,
      force: false,
      layout: false,
      resize: false,
      scrollTop: 0,
      range: null,
      style: null,
      stopSort: null
    }
  },
  // 只有小型窗口和选择版本参与渲染，行对象继续沿用业务层原始引用。
  data() {
    return {
      virtualScroll: {
        renderData: [],
        startIndex: 0,
        endIndex: 0,
        selectionVersion: 0
      }
    }
  },
  // 等待 Element UI 建立固定列，再挂接真实滚动容器。
  mounted() {
    this.$nextTick(() => {
      if (!this.isEnable('virtual') || this._isBeingDestroyed || this._isDestroyed) return
      this.setupVirtualScroll()
    })
  },
  // 缓存页激活后恢复窗口和滚动位置，隐藏期间不做无效 DOM 更新。
  activated() {
    if (!this.isEnable('virtual')) return
    this._virtual.active = true
    if (this._virtual.mounted) this.scheduleVirtualFrame(true, true)
  },
  // keep-alive 隐藏时取消待执行帧，保留选择和当前位置。
  deactivated() {
    this._virtual.active = false
    this.cancelVirtualFrame()
  },
  // 卸载必须成对释放滚动监听、尺寸监听、动画帧、占位节点和局部样式。
  beforeDestroy() {
    this._virtual.active = false
    this.disposeVirtualScroll()
  },
  watch: {
    // 浅监听同时响应数组替换及 splice/sort，不遍历所有行的字段。
    'value.data'() {
      if (this.isEnable('virtual') && this._virtual.mounted) this.refreshVirtualData()
    },
    // 动态列显示、列宽和固定方向变化才需要重新布局，滚动不走此路径。
    columns() {
      if (this.isEnable('virtual') && this._virtual.mounted) {
        this.refreshVirtualData()
        this.scheduleVirtualFrame(true, true)
      }
    },
    // 行高沿用调用页面配置的 32/36px，同时更新原有 Element UI 样式。
    'value.virtual.rowHeight'() {
      if (this.isEnable('virtual') && this._virtual.mounted) this.scheduleVirtualFrame(true, true)
    },
    // 同一实例更换配置或切换模式时成对安装/释放虚拟资源。
    'value.virtual.enable'() {
      if (!this._isMounted) return
      this.$nextTick(() => {
        if (this._isBeingDestroyed || this._isDestroyed) return
        if (this.isEnable('virtual')) this.setupVirtualScroll()
        else this.disposeVirtualScroll()
      })
    }
  },
  methods: {
    // 初始挂载与运行时启用复用同一入口，排序观察每次启用只创建一次。
    setupVirtualScroll() {
      const state = this._virtual
      if (state.mounted) return
      state.mounted = true
      state.scrollTop = this.$refs.table.bodyWrapper.scrollTop
      this.mountVirtualContainers()
      // Element UI 的 clearSort 不发送 sort-change，单独捕获静默清排序。
      state.stopSort = this.$watch(() => this.$refs.table.store.states.sortingColumn, (column) => {
        if (!column) this.refreshVirtualData()
      })
      this.refreshVirtualData()
    },
    // 关闭虚拟模式或卸载后不保留旧的全量数据、样式、占位与观察器。
    disposeVirtualScroll() {
      const state = this._virtual
      this.cancelVirtualFrame()
      this.releaseVirtualContainers()
      if (state.style) state.style.remove()
      if (state.stopSort) state.stopSort()
      state.style = null
      state.stopSort = null
      state.mounted = false
      state.rows = []
      state.source = null
      state.checkable = []
      state.selected.clear()
      state.range = null
      state.force = state.layout = state.resize = false
      this.virtualScroll.renderData = []
      this.virtualScroll.startIndex = this.virtualScroll.endIndex = 0
    },
    // 释放旧容器，供动态固定列变化和组件卸载共用。
    releaseVirtualContainers() {
      const main = this._virtual.wrappers[0]
      if (main) {
        main.wrapper.removeEventListener('scroll', this.onVirtualScroll)
        removeResizeListener(main.wrapper, this.onVirtualResize)
        // Element UI 保留已断开的 observer；清空标记后再次启用才能重新观察尺寸。
        if (!main.wrapper.__resizeListeners__.length) {
          delete main.wrapper.__resizeListeners__
          delete main.wrapper.__ro__
        }
      }
      this._virtual.wrappers.forEach(({ placeholder, body }) => {
        placeholder.remove()
        body.style.transform = ''
      })
      this._virtual.wrappers = []
    },
    // 缓存主表和左右固定列的 DOM，滚动帧内不再 querySelector。
    mountVirtualContainers() {
      const table = this.$refs.table
      const previous = this._virtual.wrappers
      const wrappers = [table.bodyWrapper, table.$refs.fixedBodyWrapper, table.$refs.rightFixedBodyWrapper].filter(Boolean)
      this._virtual.wrappers = wrappers.map((wrapper) => {
        const existing = previous.find((entry) => entry.wrapper === wrapper)
        if (existing) return existing
        const body = wrapper.querySelector('.el-table__body')
        const placeholder = document.createElement('div')
        placeholder.className = 'virtual-scroll-placeholder'
        placeholder.setAttribute('aria-hidden', 'true')
        wrapper.appendChild(placeholder)
        return { wrapper, body, placeholder }
      })
      const main = this._virtual.wrappers[0].wrapper
      // 固定列变化时复用主容器监听，避免反复建立 ResizeObserver 引发重排循环。
      if (!previous.length || previous[0].wrapper !== main) {
        if (previous.length) {
          previous[0].wrapper.removeEventListener('scroll', this.onVirtualScroll)
          removeResizeListener(previous[0].wrapper, this.onVirtualResize)
        }
        main.addEventListener('scroll', this.onVirtualScroll, { passive: true })
        addResizeListener(main, this.onVirtualResize)
      }
      previous.forEach(({ wrapper, placeholder, body }) => {
        if (wrappers.includes(wrapper)) return
        placeholder.remove()
        body.style.transform = ''
      })
      this.applyVirtualStyle()
    },
    // 保留旧虚拟表格的行高、表头及复选框规则，继续复用系统 Element UI 皮肤。
    applyVirtualStyle() {
      if (!this._virtual.style) {
        const style = document.createElement('style')
        style.id = 'dynamic-style-' + this.tableId
        document.head.appendChild(style)
        this._virtual.style = style
      }
      const height = this.value.virtual.rowHeight - 1
      this._virtual.style.textContent = `
        #${this.tableId} .el-table__cell { padding: 0px !important; }
        #${this.tableId} .el-table__cell .cell { height: ${height}px !important; line-height: ${height}px; }
        #${this.tableId} .virtual-scroll-checkbox .el-checkbox__inner,
        #${this.tableId} .virtual-scroll-checkbox .el-checkbox__inner::after { transition: none; }
      `
    },
    // 同一帧只处理最后一次滚动；横向滚动继续由 Element UI 同步表头。
    onVirtualScroll() {
      const main = this._virtual.wrappers[0].wrapper
      if (!this._virtual.active || !main.clientHeight || main.scrollTop === this._virtual.scrollTop) return
      this._virtual.scrollTop = main.scrollTop
      this.scheduleVirtualFrame()
    },
    // Element UI 自己处理布局；这里只根据最新容器高度更新窗口。
    onVirtualResize() {
      this.scheduleVirtualFrame(true)
    },
    // 合并滚动、数据与尺寸更新，禁止一个事件排入多个相同 rAF。
    scheduleVirtualFrame(force = false, layout = false) {
      const state = this._virtual
      state.force = state.force || force
      state.layout = state.layout || layout
      if (!state.active || !state.mounted || state.frame !== null) return
      state.frame = window.requestAnimationFrame(() => {
        state.frame = null
        if (!state.active) return
        if (state.resize) {
          state.resize = false
          this.resizeTable()
        }
        if (state.layout) {
          state.layout = false
          this.$refs.table.doLayout()
          this.mountVirtualContainers()
        }
        const refresh = state.force
        state.force = false
        this.updateRenderData(refresh)
      })
    },
    // 暂停或销毁时取消尚未执行的渲染任务。
    cancelVirtualFrame() {
      if (this._virtual.frame !== null) window.cancelAnimationFrame(this._virtual.frame)
      this._virtual.frame = null
    },
    // 只在数据结构或排序变化时访问全量数组，行字段更新由可见单元格自己响应。
    refreshVirtualData() {
      const state = this._virtual
      const source = this.value.data
      if (source !== state.source) {
        state.selected.clear()
        this.virtualScroll.selectionVersion++
        state.source = source
      }
      const sorting = this.$refs.table.store.states.sortingColumn
      state.rows =
        sorting && sorting.sortable === 'virtual-sortable'
          ? orderBy(source, sorting.property, sorting.order, sorting.sortMethod, sorting.sortBy)
          : source
      const selection = this.flatColumns.find((column) => column.type === 'virtual-selection')
      state.checkable = selection && selection.selectable ? state.rows.filter((row, index) => selection.selectable(row, index)) : state.rows
      this.scheduleVirtualFrame(true)
    },
    // 将窗口数据交给原生 el-table；窗口不变时不切片、不更新响应式数据。
    updateRenderData(force = false) {
      const state = this._virtual
      const main = state.wrappers[0].wrapper
      const height = main.clientHeight
      if (!height) return
      const rowHeight = this.value.virtual.rowHeight
      const maxTop = Math.max(0, state.rows.length * rowHeight - height)
      const scrollTop = Math.max(0, Math.min(state.scrollTop, maxTop))
      state.scrollTop = scrollTop
      const range = getVirtualRange(state.rows.length, scrollTop, height, rowHeight, force ? null : state.range)
      if (!force && range === state.range) return
      state.range = range
      this.virtualScroll.startIndex = range.start
      this.virtualScroll.endIndex = range.end
      // 冻结的是临时数组，不冻结行对象，实时更新和编辑能力保持不变。
      this.virtualScroll.renderData = Object.freeze(state.rows.slice(range.start, range.end))
      const placeholderHeight = (state.rows.length - (range.end - range.start)) * rowHeight
      // 等可见行完成 DOM 更新再定位，避免旧表体高度导致浏览器提前截断 scrollTop。
      this.$nextTick(() => {
        if (!state.active || state.range !== range) return
        state.wrappers.forEach(({ wrapper, placeholder, body }) => {
          placeholder.style.height = placeholderHeight + 'px'
          body.style.transform = `translateY(${range.start * rowHeight}px)`
          if (wrapper.scrollTop !== scrollTop) wrapper.scrollTop = scrollTop
        })
      })
    },
    // 兼容原方法的对象/下标入参和向前保留一行的定位方式。
    virtualScrollToRow(rowOrIndex) {
      const rows = this._virtual.rows
      const index = typeof rowOrIndex === 'number' ? rowOrIndex : rows.indexOf(rowOrIndex)
      this._virtual.scrollTop = Math.max(0, index - 1) * this.value.virtual.rowHeight
      this.scheduleVirtualFrame(true)
    },
    // 序号列继续输出全局下标，而不是可见窗口内下标。
    getVirtualRowIndex(index) {
      return this.virtualScroll.startIndex + index
    },
    // 保留 agel-table 原有虚拟排序、选择和序号列配置契约。
    handleVirtualScrollColumn(column) {
      if (column.sortable === true) column.sortable = 'virtual-sortable'
      if (column.type === 'selection') {
        column.slotHeader = (h) => this.renderVirtualSelectionHeader(h)
        column.slotColumn = (h, scope) => this.renderVirtualSelectionCell(h, scope, column)
        column.type = 'virtual-selection'
      }
      if (column.type === 'index') {
        const indexMethod = column.index
        column.index = (index) => {
          const globalIndex = this.getVirtualRowIndex(index)
          return typeof indexMethod === 'function' ? indexMethod(globalIndex) : globalIndex + (typeof indexMethod === 'number' ? indexMethod : 1)
        }
      }
    },
    // 选中变更仍输出按选择顺序排列的原始行对象数组。
    emitVirtualSelection(event, row) {
      this.virtualScroll.selectionVersion++
      const selection = Array.from(this._virtual.selected)
      const events = this.value.on || {}
      if (events[event]) {
        if (event === 'select-all') events[event](selection)
        else events[event](selection, row)
      }
      if (events['selection-change']) events['selection-change'](selection)
    },
    // 全选针对全量可选行，头部复选框状态计算不再扫描每一行。
    renderVirtualSelectionHeader(h) {
      this.virtualScroll.selectionVersion
      const state = this._virtual
      const count = state.selected.size
      const all = state.checkable.length > 0 && count === state.checkable.length
      return h('el-checkbox', {
        class: 'virtual-scroll-checkbox',
        props: { value: all, disabled: state.checkable.length === 0, indeterminate: count > 0 && !all },
        on: {
          // 全选和取消全选只在用户点击时构建集合。
          input: (checked) => {
            state.selected = new Set(checked ? state.checkable : [])
            this.emitVirtualSelection('select-all')
          }
        }
      })
    },
    // Set 查询保证已选上万行时，可见复选框依然是常数时间判断。
    renderVirtualSelectionCell(h, { row, $index }, column) {
      this.virtualScroll.selectionVersion
      const state = this._virtual
      return h('el-checkbox', {
        class: 'virtual-scroll-checkbox',
        props: {
          value: state.selected.has(row),
          disabled: column.selectable ? !column.selectable(row, this.getVirtualRowIndex($index)) : false
        },
        on: {
          // 保留旧组件 select、selection-change 的调用顺序。
          input: () => {
            state.selected.has(row) ? state.selected.delete(row) : state.selected.add(row)
            this.emitVirtualSelection('select', row)
          }
        },
        nativeOn: { click: (event) => event.stopPropagation() }
      })
    }
  }
}
