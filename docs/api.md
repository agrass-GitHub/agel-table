---
title: API 参考
sidebar: auto
---

# API 参考

## 全局注册与默认配置

通过 Vue 插件注册组件。所有选项均可省略；传入的默认值只在表格对象未配置对应属性时生效。

```js
import Vue from 'vue'
import ElementUI from 'element-ui'
import agelTable from 'agel-table'

Vue.use(ElementUI)
Vue.use(agelTable, {
  table: { border: true, size: 'small' },
  page: { height: 45, pageSizes: [10, 20, 50, 100] },
  column: { align: 'left' },
  menu: { width: 140 },
  queryProps: {
    currentPage: 'page',
    pageSize: 'size',
    orderColumn: 'sortField',
    order: (value) => ['sortOrder', value === 'descending' ? 'desc' : 'asc']
  },
  slotEmpty(h) {
    return h('el-empty', { props: { description: '暂无数据' } })
  }
})
```

| 全局选项 | 说明 |
| --- | --- |
| table | Element UI 表格的默认属性。页面表格对象中的同名属性优先。 |
| page | 分页组件的默认属性；单个表格仍需设置 page.enable 开启分页。 |
| column | 所有列共享的默认属性；单列配置优先。 |
| menu | 操作列默认属性；可在全局设定宽度、按钮和回调。 |
| queryProps | 将内置查询字段映射为后端接口字段。 |
| slotEmpty | 全局空数据内容渲染函数，参数为 Vue createElement 函数 h。 |

## 表格配置对象

组件通过 value 接收配置对象；在模板中通常使用 v-model 绑定。

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| data | Array | [] | 表格数据。 |
| columns | Array or Object | [] | 列定义，支持嵌套列和对象形式。 |
| loading | Boolean | false | Element UI loading 指令的开关。 |
| height | Number or String | — | 表格容器高度；数字按 px 处理，也可传 CSS 高度。 |
| query | Object | {} | 查询参数。组件会补充分页和排序字段。 |
| request | Function | — | 接口请求代理。服务端分页使用 request(query, done, fail)。 |
| queryProps | Object | 全局/内置映射 | 当前表格的查询字段映射，优先级高于全局设置。 |
| defaultSort | Object | — | Element UI 默认排序，如 { prop: 'name', order: 'ascending' }。 |
| page | Object | — | 分页选项，见下文。 |
| menu | Object | — | 操作列选项，见下文。 |
| merge | Object | — | 单元格合并选项，见下文。 |
| virtual | Object | — | 固定行高虚拟滚动选项，见下文。 |
| resize | Object | — | 容器自适应高度选项，见下文。 |
| on | Object | {} | Element UI 表格/分页事件回调。 |

其余受支持的表格属性会传递给 Element UI Table，包括条纹、边框、行样式、合计行和树形数据等。属性名称兼容驼峰和短横线写法。具体行为请参阅 [Element UI Table 文档](https://element.eleme.cn/#/zh-CN/component/table)。

### 列配置

数组形式的列定义最常用；对象形式以字段名为键，组件会将键转换为 prop。

```js
columns: [
  { prop: 'name', label: '姓名', minWidth: 120 },
  {
    label: '联系信息',
    children: [
      { prop: 'phone', label: '电话', width: 140 },
      { prop: 'email', label: '邮箱', minWidth: 180 }
    ]
  }
]
```

| agel-table 扩展属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| display | Boolean or Function | true | 是否显示该列。函数应返回 Boolean，不接收参数。 |
| children | Array | [] | 子列定义，用于多级表头。 |
| slotColumn | String or Function | — | 自定义单元格。字符串对应具名作用域插槽；函数签名为 slotColumn(h, scope)。 |
| slotHeader | String or Function | — | 自定义表头。字符串对应具名作用域插槽；函数签名为 slotHeader(h, scope)。 |
| slotExpand | String | — | 展开列内容的具名作用域插槽别名。 |
| merge | Boolean | false | merge.auto 未开启时，指定此列参与自动合并。 |

其他列属性使用 Element UI Table-column 属性，例如 type、index、width、fixed、sortable、formatter、align 和 filters。可通过全局 column 默认值统一设置列属性。

### 插槽

具名作用域插槽通过列配置中的 slotColumn 或 slotHeader 引用。作用域对象与 Element UI 列插槽一致，常用字段为 row、column、$index。

```vue
<agel-table v-model="table">
  <template slot="status" slot-scope="{ row }">
    <el-tag>{{ row.status }}</el-tag>
  </template>
  <template slot="statusHeader">
    当前状态
  </template>
  <template slot="empty">
    暂无匹配记录
  </template>
</agel-table>

columns: [
  {
    prop: 'status',
    label: '状态',
    slotColumn: 'status',
    slotHeader: 'statusHeader'
  }
]
```

还支持 Element UI 的 append 插槽。没有局部 empty 插槽时，组件使用全局 slotEmpty 配置（如果已配置）。

### attach 外部属性

attach 可将父组件中的响应式属性同步到表格配置对象，适合拆分既有的数据和列状态：

```vue
<agel-table
  v-model="table"
  :attach="{ data, columns, height }"
/>
```

attach 只同步传入的顶层属性，并覆盖 table 对象中的同名值。若需要更明确的数据流，优先直接把 data、columns 和 height 放在 table 对象中。

## request 与 queryProps

### 服务端请求

使用分页或服务端排序时，推荐通过三参数请求代理：

```js
request(query, done, fail) {
  api.list(query)
    .then((response) => {
      done({
        data: response.data.records,
        total: response.data.total
      })
    })
    .catch(fail)
}
```

成功时 done 接收数据数组，或 { data, total } 对象；分页开启时请提供 total。失败时调用 fail(error)。回调代理会管理 loading 和最新请求回填；组件不会在浏览器端切分完整数据。

分页、pageSize 改变以及 sortable: 'custom' 列排序会触发请求。客户端分页需要由业务代码自行切分数据，不由该分页组件自动完成。

请求以函数声明参数个数区分回调代理：声明两个或更多形参时，组件以 request(query, done, fail) 调用；零到一个形参时，组件直接调用 request() 并返回其返回值，不自动解析返回数据。需要组件管理 loading 和数据回填时，请使用三参数形式。

调用 table.getData(options) 可主动刷新。传入 currentPage 或 pageSize 可重置分页；也可以传入 queryProps 映射后的字段名。

### 查询字段映射

内置映射为：

| 语义 | 默认字段 |
| --- | --- |
| 当前页 | currentPage |
| 每页条数 | pageSize |
| 排序字段 | orderColumn |
| 排序方向 | order |

可使用字符串改名，也可用函数同时改名和转换值：

```js
queryProps: {
  currentPage: 'page',
  pageSize: 'size',
  orderColumn: 'sortField',
  order: (value) => ['sortOrder', value === 'descending' ? 'desc' : 'asc']
}
```

映射函数接收 Element UI 的排序方向（ascending 或 descending），返回 [查询字段名, 查询值]。

## 分页 page

分页属性会传递给 Element UI Pagination；分页事件通过 table.on 配置。

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| enable | Boolean | false | 是否渲染分页组件。 |
| currentPage | Number | 1 | 当前页。 |
| pageSize | Number | 20 | 每页条数。 |
| pageSizes | Array | [10, 20, 50, 100] | 每页条数选项。 |
| total | Number | 0 | 数据总数。 |
| layout | String | total, sizes, prev, pager, next, jumper | Pagination 布局。 |
| height | Number | 45 | 分页区域高度，表格设置 height 时用于计算表格高度。 |
| justify | String | flex-end | 分页区域的水平对齐方式。 |

其他属性参见 [Element UI Pagination 文档](https://element.eleme.cn/#/zh-CN/component/pagination)。

## 操作列 menu

设置 enable 开启操作列。操作回调接收 Element UI 列作用域对象。

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| enable | Boolean | false | 是否显示操作列。 |
| label | String | 操作 | 列标题。 |
| width | Number | 100 | 列宽。 |
| align | String | center | 对齐方式。 |
| fixed | Boolean or String | — | 可使用 Element UI 固定列设置。 |
| insertIndex | Number | — | 插入位置；从 0 开始。不设置时追加到末尾。 |
| onEdit | Function | — | 编辑按钮回调；设置后显示默认编辑按钮。 |
| onDel | Function | — | 删除按钮回调；设置后显示默认删除按钮。 |
| editRender | Function | — | 自定义编辑按钮，参数为 { h, clickEvent }。 |
| delRender | Function | — | 自定义删除按钮，参数为 { h, clickEvent }。 |
| menuRender | Function | — | 自定义额外内容，参数为 { h, menu, scope }。 |

## 单元格合并 merge

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| enable | Boolean | false | 是否启用合并。 |
| auto | Boolean | false | 自动合并所有具有 prop 且非特殊类型的列。 |
| direction | String | vertical | vertical 按行合并；horizontal 按列合并。 |

未开启 auto 时，可在要合并的列上设置 merge: true。合并根据相邻单元格值是否相同计算。

## 虚拟滚动 virtual

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| enable | Boolean | false | 是否启用虚拟滚动。 |
| rowHeight | Number | — | 固定行高，单位 px；启用时必须提供正数。 |

虚拟模式只渲染视口附近的行，适用于固定行高的大型平面列表。支持固定列、序号列、选择列和客户端排序。以下功能不能与虚拟模式组合使用：

- 可变行高、树形数据或懒加载。
- Element UI 表格筛选、展开行或单元格合并。
- 会改变行高的换行文本、未固定尺寸的图片或自定义样式。

数据首次进入 Vue 响应式系统的成本仍然存在。若每行包含大量深层对象，可优先减少无关字段或按需加载数据。

## 高度自适应 resize

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| enable | Boolean | false | 是否监听窗口尺寸并自适应高度。 |
| relative | String or Element | table.offsetParent | 参照选择器或 DOM 元素。 |
| offset | Number or Function | 0 | 额外扣除的像素高度；函数返回 Number。 |

计算结果为参照元素高度减去 offset 及表格顶部间距。布局变化后可调用 table.resizeTable() 主动重新计算。

## 事件 on

表格与分页事件统一写在 table.on 对象中。事件名称使用 Element UI 的事件名。

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| selection-change | selection | 选择项变化。 |
| select | selection, row | 选择或取消一行。 |
| select-all | selection | 点击全选框。 |
| sort-change | { column, prop, order } | 排序变化。 |
| current-change | currentRow, oldCurrentRow | 表格当前行变化。 |
| page-change | currentPage | 分页页码变化。用于区分页码事件和表格 current-change。 |
| size-change | pageSize | 每页条数变化。 |

其他传递给 el-table 或 el-pagination 的事件可放入 on。分页内部维护 currentPage 和 pageSize；服务端查询所需参数会同步写入 query。

## 实例方法

以下方法会挂载到绑定的 table 对象上：

| 方法 | 参数 | 说明 |
| --- | --- | --- |
| getRef(name = 'table') | 'table' 或 'page' | 获取内部 Element UI 表格或分页组件实例。 |
| getCol(prop) | 字段名 | 获取对应的扁平列配置。 |
| getData(options) | 可选分页参数 | 触发回调式 request；该方法仅在回调式请求配置时注入。 |
| resizeTable() | — | 重新计算自适应高度；resize 配置存在时注入。 |
| getVirtualRowIndex(index) | 可见窗口内的 0 起始下标 | 转换为完整数据中的 0 起始下标；虚拟配置存在时注入。 |
| virtualScrollToRow(indexOrRow) | 0 起始下标或原始行对象 | 滚动到指定数据行附近；虚拟配置存在时注入。 |

table.getRef() 可调用 Element UI Table 自身公开的方法，例如 clearSelection、toggleRowSelection 或 sort。
