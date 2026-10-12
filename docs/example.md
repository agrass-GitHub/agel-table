---
title: 使用指南
sidebar: auto
---

# 使用指南

agel-table 面向 Vue 2 + Element UI 2 项目。它将表格配置集中到一个对象中，并在 Element UI 表格上增加分页请求、操作列、列配置、合并、自适应高度和虚拟滚动能力。

## 环境要求

- Vue 2.x
- Element UI 2.x

请先在宿主项目中安装并注册 Element UI。agel-table 不会替应用加载 Element UI 样式。

```sh
npm install agel-table
```

## 注册组件

在应用入口全局注册一次即可。传入的第二个参数是所有表格共享的默认配置；页面级配置优先于默认值。

```js
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import agelTable from 'agel-table'

Vue.use(ElementUI)
Vue.use(agelTable, {
  table: {
    border: true
  },
  page: {
    height: 45,
    pageSizes: [10, 20, 50, 100],
    layout: 'total, sizes, prev, pager, next, jumper'
  },
  menu: {
    width: 140
  }
})
```

Vue.use(agelTable, options) 会注册 &lt;agel-table&gt;，无需再手动调用 Vue.component。全局选项只提供默认值，表格对象中的同名属性优先。上例没有设置 page.enable，因此分页仍需在具体表格上开启；若全局设置 page: { enable: true }，所有表格默认带分页，可在单个表格上用 page: { enable: false } 关闭。

## 创建本地数据表格

v-model 绑定一个响应式对象。表格属性、列定义和数据都放在这个对象中。

```vue
<template>
  <agel-table v-model="table" />
</template>

<script>
export default {
  data() {
    return {
      table: {
        height: 320,
        columns: [
          { prop: 'name', label: '姓名', minWidth: 120 },
          { prop: 'department', label: '部门', width: 160 }
        ],
        data: [
          { name: '张三', department: '生产部' },
          { name: '李四', department: '安全部' }
        ]
      }
    }
  }
}
</script>
```

table.data 变化时，表格会响应更新。需要直接调用 Element UI 的表格方法时，使用 table.getRef() 获取内部 el-table 实例。

## 接入服务端数据和分页

在 table.page.enable 开启分页，并用三参数形式定义 request(query, done, fail)。分页或服务端排序变化时，组件会用最新查询参数调用 request；调用 done 回填当前页数据和总数。

下面的示例用定时器模拟服务端响应：

```vue
<template>
  <div>
    <el-input v-model="table.query.keyword" placeholder="姓名" />
    <el-button @click="search">查询</el-button>
    <agel-table v-model="table" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      table: {
        height: 360,
        query: { keyword: '' },
        page: { enable: true, pageSize: 10 },
        columns: [
          { prop: 'name', label: '姓名', sortable: 'custom' },
          { prop: 'department', label: '部门' }
        ],
        request: (query, done, fail) => {
          setTimeout(() => {
            const allRows = Array.from({ length: 37 }, (_, index) => ({
              name: '员工 ' + (index + 1),
              department: index % 2 === 0 ? '生产部' : '安全部'
            }))
            const filteredRows = allRows.filter((row) => row.name.includes(query.keyword))
            const sortedRows = query.orderColumn === 'name'
              ? filteredRows.slice().sort((left, right) => {
                  const result = left.name.localeCompare(right.name)
                  return query.order === 'descending' ? -result : result
                })
              : filteredRows
            const start = (query.currentPage - 1) * query.pageSize

            done({
              data: sortedRows.slice(start, start + query.pageSize),
              total: sortedRows.length
            })
          }, 200)
        }
      }
    }
  },
  mounted() {
    this.table.getData()
  },
  methods: {
    search() {
      this.table.getData({ currentPage: 1 })
    }
  }
}
</script>
```

默认查询字段为 currentPage、pageSize、orderColumn 和 order，可以通过 queryProps 映射到后端字段。分页组件负责展示页码和触发查询，不会在浏览器端自动切分完整数据；使用分页时，request 应返回当前页数据。

done 接收数组，或 { data, total }。失败时调用 fail(error)；异步请求的拒绝也会结束 loading。table.getData() 仅在使用三参数请求代理时注入。请求协议和映射详情见 [API 参考](./api.md#request-与-queryprops)。

## 自定义单元格和表头

字符串形式的 slotColumn / slotHeader 对应 &lt;agel-table&gt; 上的具名作用域插槽：

```vue
<agel-table v-model="table">
  <template slot="status" slot-scope="{ row }">
    <el-tag :type="row.status === '正常' ? 'success' : 'warning'">
      {{ row.status }}
    </el-tag>
  </template>
</agel-table>

columns: [
  { prop: 'status', label: '状态', slotColumn: 'status' }
]
```

也可以直接传入渲染函数：slotColumn(h, scope) 和 slotHeader(h, scope)。完整示例包含展开行、自定义插槽和 render 函数：

<ClientOnly><slot-table /></ClientOnly>

::: details 查看示例源码
<<< @/docs/.vuepress/components/slot-table.vue
:::

## 扩展能力示例

### 动态列显隐与嵌套表头

列支持 Element UI 的常用列属性，以及 display、children 等 agel-table 扩展项。display 可为布尔值或返回布尔值的函数。

<ClientOnly><display-table /></ClientOnly>

### 操作列

设置 menu.enable 后，可以配置编辑、删除回调和自定义操作内容。菜单列默认追加到末尾，也可通过 insertIndex 指定插入位置。

<ClientOnly><get-data-table /></ClientOnly>

::: details 查看请求代理与操作列示例源码
<<< @/docs/.vuepress/components/get-data-table.vue
:::

### 合并单元格

merge.auto 会按相同字段值自动合并；也可以仅在指定列上设置 merge: true。横向合并使用 direction: 'horizontal'。

<ClientOnly><merge-cell-table /></ClientOnly>

### 自适应高度

设置 resize.enable 后，表格会根据参照元素和底部偏移量计算可用高度。可将 relative 设为 CSS 选择器或 DOM 元素；省略时使用表格容器的 offsetParent。

<ClientOnly><resize-table /></ClientOnly>

### 虚拟滚动

将 virtual 配置为 { enable: true, rowHeight: 32 } 开启固定行高虚拟滚动。rowHeight 以像素为单位，必须与实际行布局保持一致。

支持固定列、序号列、选择列、客户端排序、数据替换、行定位和容器尺寸变化。虚拟模式下不支持树形/懒加载、表格筛选、展开行、单元格合并或可变行高；不要使用会改变行高的单元格内容或样式。

示例默认加载 1 万行，并提供 1 万和 10 万行快捷加载；输入框不设置固定行数上限。组件不会按 1000 行截断传入的 data，实际可加载规模取决于浏览器内存和数据对象大小。

<ClientOnly><virtual-scroll-table /></ClientOnly>

::: details 查看示例源码
<<< @/docs/.vuepress/components/virtual-scroll-table.vue
:::

更多限制和滚动定位方法见 [API 参考](./api.md#虚拟滚动-virtual)。

## 性能建议

组件内部已对渲染、滚动和合并计算做了缓存与合并；业务侧保持以下用法，可以避免不必要的整表刷新。

### 选择合适的渲染模式

非虚拟模式下 Element UI 会为每一行创建 DOM。数据达到数千行、或需要连续实时刷新时，建议开启 virtual，并让 rowHeight 与实际行高一致。分页能满足需求时，服务端分页通常是更简单的选择。

### 保持列配置引用稳定

组件按列对象识别每一列。把 columns 定义在 data 中并原地修改，例如 `table.getCol('name').label = '新标题'`、`column.display = false` 或修改 width / fixed，表格只更新变化的列。

避免在模板中直接写列字面量（例如 `:attach="{ columns: [{ prop: 'name', label: '姓名' }] }"`）：父组件每次渲染都会创建新的列对象，新对象会被当作新列，导致所有列重建并重新布局。用 computed 生成列时，它只在依赖变化时重新创建，可以接受；频繁变化的属性仍建议原地修改。

### 保持数据引用稳定

- 通过 attach 传数据时，传入 data 中的数组或 computed 结果，不要在模板中写 `list.filter(...)`。
- 实时更新单行时直接修改行对象字段，不必替换整个 data 数组。虚拟模式下只有可见行会重新渲染。
- 虚拟模式下替换 data 数组会清空选中状态；需要保留选中时，用 push、splice 等方法原地修改。

### 只读大数据可以冻结

Vue 2 会把赋给 table.data 的每一行转换为响应式对象，10 万行时这一步本身就有明显开销。如果行数据只用于展示、之后不会修改字段，可以在赋值前冻结：

```js
this.table.data = Object.freeze(list.map((row) => Object.freeze(row)))
```

冻结后虚拟滚动、客户端排序和选择列照常工作，但修改行字段不会再更新界面，需要更新时替换整个数组。

### 合并单元格的计算量

开启 merge 后，数据或合并列变化时会对全量数据重新计算一次合并信息，计算量与「行数 × 合并列数」成正比。只在需要合并的列上设置 merge: true，比开启 merge.auto 计算更少；虚拟模式不支持合并单元格。

## 下一步

- [API 参考：表格配置、事件、方法](./api.md)
- [Element UI 兼容说明](./sum.md)
- [更新日志](./log.md)
