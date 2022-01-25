---
title: 使用文档
sidebar: auto
---

## 介绍

[agel-table](https://github.com/agrass-GitHub/agel-table)是 element-ui table 的二次封装，保持灵活性，极简的思想，更少的代码，更多的功能，更快速的开发 ⬆⬆⬆
[![npm](https://img.shields.io/npm/v/agel-table.svg)](https://www.npmjs.com/package/agel-table)
[![download](https://img.shields.io/npm/dt/agel-table)](https://npmcharts.com/compare/agel-table?minimal=true)


### 特性

该组件的思想就是以一个 table 对象来做所有的操作，哪怕页上多个列表也不用在 data 定义一堆 data1,data2,loading1,loading2 ... 等变量，更加简单明了。

- 保持灵活性，极简的思想，更少的代码，更多的功能，更快速的开发
- 支持 element-ui table 组件的所有 api, slot, event, method
- 纯数据配置
- 集成分页组件
- 菜单列
- 动态显隐列
- 数据代理
- 自动合并相同行
- 虚拟滚动支持大数据渲染 10w+
- 跟随容器大小自适应高度

### 安装

`npm install agel-table --save # yarn add agel-table` 

## 创建表格

### 数据配置

表格通过一个 table 对象渲染，下面的 Demo 展示了 element-ui 官网 el-table 的大多数例子:

<div>
  <el-tag style="margin:0px 5px 5px 0px"  v-for="text in ['基础表格','带斑马纹表格','带边框表格','带状态表格','固定列','固定表头','单选','多选','排序','表尾合计行','自定义索引','树形数据与懒加载','分页','菜单列']" :key="text">{{text}}</el-tag>
</div>

分页与菜单列的属性建议配置在全局，在局部进行按需覆盖。


<ClientOnly><complex-table/></ClientOnly>

::: details 点击查看代码
<<< @/docs/.vuepress/components/complex-table.vue
:::

### 自定义列

设置 `column.slotColumn` 支持配置自定义列，支持渲染函数

设置 `column.slotHeader` 支持配置自定义表头，支持渲染函数

<ClientOnly><slot-table/></ClientOnly>

::: details 点击查看代码
<<< @/docs/.vuepress/components/slot-table.vue
:::

### 动态显隐

设置 `column.display` 控制是否显示隐藏，支持函数配置

<ClientOnly><display-table/></ClientOnly>

::: details 点击查看代码
<<< @/docs/.vuepress/components/display-table.vue
:::
 
### 数据代理

设置 `request` 属性可开启数据代理，当分页或者排序发生变化，会自动调用。

表格 `query` 对象默认存在四个基本查询属性，可以通过全局设置 `queryProps` 配置别名。

<ClientOnly> <get-data-table/></ClientOnly>

::: details 点击查看代码
<<< @/docs/.vuepress/components/get-data-table.vue
:::


### 自动合并

设置 `merge` 可开启自动合并单元格。

<ClientOnly> <merge-cell-table/></ClientOnly>

::: details 点击查看代码
<<< @/docs/.vuepress/components/merge-cell-table.vue
:::

### 虚拟滚动

设置 `virtual` 可开启虚拟滚动，纯文本渲染效率最佳 :smile:

只需要设置好 `rowHieght`，表格会自动设置固定行高，不会被 CSS 样式表所影响。

支持多选列，索引列，固定列，排序，在组件内部做了兼容，不支持过滤、树形、合并单元格。


<ClientOnly> <virtual-scroll-table/></ClientOnly>

::: details 点击查看代码
<<< @/docs/.vuepress/components/virtual-scroll-table.vue
:::


### 自适应高

设置 `resize` 属性可开启自适应高度，请指定 `relative` 参照物，否则默认取的 table.offsetParent 

[DEMO展示请点击](/table-resize-demo)

::: details 点击查看代码
<<< @/docs/.vuepress/components/resize-table.vue
:::

### 全局配置

支持全局属性，配置将被继承到每个表格上; 分页与菜单列相关的属性建议配置在全局，在局部页面根据需求进行覆盖。

```js
import agelTable from "agel-table"

const tableConfig = {
  table: {
    border: true,
    highlightCurrentRow: true,
  },
  column:{
    width:100,
  },
  menu:{
    width:100,
    editRender: ({ h, clickEvent }) =>  h("el-button", { on: clickEvent }, '编辑'),
    delRender: ({ h, clickEvent }) => h("el-button", { on: clickEvent }, '删除')
  },
  page: { 
     enable: true, 
     height: 45, 
     layout: "total, prev, pager, next, jumper, sizes", 
     background: true 
  },
  queryProps: {
    currentPage: "page",
    pageSize: "size",
    orderColumn: 'sortProp',
    order: (v) => ["sortOrder", v == "descending" ? 1 : 0], // 可格式化 order value
  },
}

Vue.use(agelTable,tableConfig)

// use 注册组件 OR component 注册组件

Vue.prototype.$agelTableConfig = tableConfig;
Vue.component('agel-table', agelTable);
```

## 表格配置

### table 

表格属性配置。

| 属性        | 类型         | 默认值  | 说明                                 | 
| ----------- | ------------ | ------ | ------------------------------------ | 
| ......      | ......       | ...... | All Element-ui [Table Attributes](https://element.eleme.cn/#/zh-CN/component/table#table-attributes)     | 
| loading     | Boolean      | false  | 是否开启加载状态                       | 
| data        | Array        | [ ]    | 数据                                 | 
| columns     | Array/Object | [ ]    | 列配置                               | 
| query       | Object       | { }    | 查询参数，默认包含分页排序参数  | 
| on          | Object       | { }    | table 和 page 组件的 Event 事件      | 
| request     | Function     | -      | 接口数据代理函数                     |
| `page`        | Object       | { }    | 分页配置                | 
| `merge`       | Object       | { }    | 自动合并单元格                  | 
| `virtual`     | Object       | { }    | 大数据虚拟滚动                   |
| `resize`      | Object        | { }   | 随窗口大小自适应高度              |

### column

表格列扩展属性。

| 属性       | 类型            | 默认值   | 说明                               |
| ---------- | --------------- | -------- | ---------------------------------- |
| ......     | ......          | ......   | All Element-ui [Table-column Attributes](https://element.eleme.cn/#/zh-CN/component/table#table-column-attributes)   |
| display    | Boolean/Function         | true     | 是否显示该列                       |
| merge      | Boolean         | false    | 该列相同行是否自动合并              |
| children   | Array           | -        | 配置多级表头                       |
| slotColumn | String/Function | -        | 自定义表列的插槽名称 / slotColumn(h,scope) |
| slotHeader | String/Function | -        | 自定义表头的插槽名称 / slotHeader(h,scope) |

### page

开启分页配置，基础属性建议配置在全局。

| 属性        | 类型   | 默认值                                    | 说明              |
| ----------- | ------  | ----------------------------------------- | --------------- | 
| ......      | ......  | All Element-ui Pagination Attributes      | ......          |
| enable      | Boolean | false                                     | 是否开启分页     |
| height      | Nnmber  | 45                                        | 占据高度         |
| layout      | String  | 'total, sizes, prev, pager, next, jumper' | 组件布局          |
| pageSizes   | Array   | [10, 20, 50, 100]                         | 页码选项设置      |
| pageSize    | Nnmber  | 20                                        | 每页显示条目个数  |
| currentPage | Nnmber  | 1                                         | 当前页           |
| total       | Nnmber  | 0                                         | 总条目数          |

### menu

开启菜单列，`editRender` `delRender` 等基础属性建议配置在全局。

| 属性        | 类型   | 默认值                                    | 说明              |
| ----------- | ------  | ----------------------------------------- | --------------- | 
| ......     | ......          | ......   | All Element-ui [Table-column Attributes](https://element.eleme.cn/#/zh-CN/component/table#table-column-attributes)   |
| enable      | Boolean | false                                     | 是否开启菜单列     |
| insertIndex | Number  | -                                 | 菜单列位置,默认在结尾    |
| onEdit        | Function | -                               | 菜单编辑按钮点击回调，设置后显示编辑按钮     |
| onDel         | Function | -                               | 菜单删除按钮点击回调，设置后显示删除按钮     |
| editRender    | Function | -                               | 自定义编辑按钮, editRender({h,clickEvent})    |
| delRender     | Function | -                               | 自定义删除按钮, delRender({h,clickEvent})    |
| menuRender    | Function | -                               | 自定义菜单按钮, menuRender({h,scope,menu})    |

### merge

开启自动合并单元格。

| 属性        | 类型     | 默认值        | 说明    
| ----------- | ------  | --------------| ---------------                    | 
| enable      | Boolean | false         | 是否开启合并单元格     
| auto        | Boolean | false         | 是否自动合并相同单元格                         |
| direction   | String  | vertical      | 合并方向，可选 vertical horizontal       |

### virtual

开启虚拟滚动。

| 属性        | 类型     | 默认值        | 说明    
| ----------- | ------  | --------------| ---------------   |
| enable      | Boolean | false         | 是否开启虚拟滚动     |
| rowHeight   | Number  | 0             | 行高度      |


### resize

开启高度自适应容器。

| 属性        | 类型     | 默认值        | 说明    
| ----------- | ------  | --------------| ---------------                    | 
| enable      | Boolean | false         | 是否开启自适应    
| relative    | Stribg/Dom  | table.offsetParent             | 自适应参照物元素或者选择器                      |
| offset      | Number/Function  | 0             | calcHeight 偏移高度                         |


### methods

和传统的通过 `$refs.table.xxx()` 来调用组件方法有所不同，在 ageltable 中方法会自动注入到 table 对象中，可以直接通过 `table.xxx()` 来调用。

| 属性        | 参数              | 说明                                 | 备注                                 |  
| ----------- | ------------    | ------------------------------------ | ------- | 
| getRef      | -               | 获取组件实例   |  
| getCol      | prop            | 获取 column 列对象  |  
| getData     | -               | 快捷调用 request                       |request 配置 done 参数可用
| resizeTable | -               | 刷新自适应表格                      | resize 开启可用
| getVirtualRowIndex | -        | 获取虚拟滚动中当前 Index            | virtual 开启可用
| virtualScrollToRow | index/row        | 滚动到指定行                        | virtual 开启可用
