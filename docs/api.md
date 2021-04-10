---
title: API 文档
sidebar: auto
---

## props

::: tip
  `v-model/value` 不可设置为计算属性，[使用计算属性可参考 attach 属性的用法](/example.html#attach-属性的用法)
:::

| 属性    | 类型   | 必填 | 说明                             | 锚点                  |
| ------- | ------ | ---- | -------------------------------- | --------------------- |
| v-model/value | Object | 是   | table 参数配置，建议使用 v-model | [参考](/api.md#table) |
| attach  | Object | 否   | table 附属配置，会同步到 v-model | [参考](/api.md#table) |


## table

::: tip
- 支持所有 Element-ui [Table Attributes](https://element.eleme.cn/#/zh-CN/component/table#table-attributes)
- 所有属性都是可选，请注意的默认值为【内置】的属性，请勿传递覆盖
- `page` 等带灰色背景的为扩展功能，只有传递了该对象，相关属性和方法才会注入到 table
:::

| 属性        | 类型         | 默认值  | 说明                                 | 
| ----------- | ------------ | ------ | ------------------------------------ | 
| ......      | ......       | ...... | All Element-ui Table Attributes      | 
| loading     | Boolean      | false  | 是否开启加载状态                       | 
| data        | Array        | [ ]    | 数据                                 | 
| columns     | Array/Object | [ ]    | 列配置                               | 
| selection   | Array        | [ ]    | selection 发生变化会自动回填到这里| 
| query       | Object       | { }    | table 查询参数，默认包含分页排序参数  | 
| queryProps  | Object       | { }    | 指定默认参数键名，格式化 value  | 
| on          | Object       | { }    | table 和 page 组件的 Event 事件      | 
| request     | Function     | -      | 接口数据代理函数                     |
| getData     | Function     | 内置   | 工作流程代理函数                     |
| getRef      | Function(prop:string) | 内置   |参数(table,page) 获取  组件实例   |  
| `page`        | Object       | { }    | 分页配置                | 
| `merge`       | Object       | { }    | 自动合并单元格                  | 
| `virtual`     | Object       | { }    | 大数据虚拟滚动                   |
| `resize`      | Object        | { }   | 随窗口大小自适应高度              |
| `virtualScrollToRow`         | Function       | 内置   | 滚动到指定行，开启虚拟滚动生效  |
| `virtualScrollUpdate`         | Function       | 内置   | 手动刷新状态，开启虚拟滚动生效  |
| `resizeTable`     | Function     | 内置   | 自适应table，开启resize生效  |

## queryProps

:::tip
`query` 默认存在四个基本查询属性,可设置键名，也可对 value 进行格式化，[使用方法参考](/example.html#queryprops-属性的用法)
:::

| 属性       | 类型            | 默认值   | 说明                               |
| ---------- | --------------- | -------- | ---------------------------------- |
| pageSize    | String/Function | pageSize        | 页码数 |
| currentPage | String/Function | currentPage        | 当前页 |
| orderColumn | String/Function | orderColumn | 排序列 prop  |
| order       | String/Function | order | 倒序正序  |

## column

::: tip
支持所有 Element-ui [Table-column Attributes](https://element.eleme.cn/#/zh-CN/component/table#table-column-attributes)
:::

| 属性       | 类型            | 默认值   | 说明                               |
| ---------- | --------------- | -------- | ---------------------------------- |
| ......     | ......          | ......   | All Element-ui Column Attributes   |
| display    | Boolean         | true     | 是否显示该列                       |
| merge      | Boolean         | false    | 该列相同行是否自动合并              |
| children   | Array           | -        | 配置多级表头                       |
| slotColumn | String/Function | -        | 自定义表列的插槽名称 / render 函数 |
| slotHeader | String/Function | -        | 自定义表头的插槽名称 / render 函数 |
| slotExpand | String/Function | 'expand' | 自定展开行的插槽名称 / render 函数 |


## on

::: tip
- 支持所有 Element-ui [Table Events](https://element.eleme.cn/#/zh-CN/component/table#table-events)，[Pagination Events](https://element.eleme.cn/#/zh-CN/component/pagination#events)
- el-pagination 与 el-table 拥有重名事件 `currentChange`，故此修改为 `page-change`
:::

| 属性       | 说明                                   |
| ---------- | ------------------------------------------ |
| ......     | All Element-ui Table and Pagination Events |
| page-change | page.currentPage 发生变化时触发         |
| size-change | page.pageSize 发生变化时触发            |
| sort-change | 排序发生变化时触发                      |


## page

::: tip
- 支持所有 Element-ui [pagination Attributes](https://element.eleme.cn/#/zh-CN/component/pagination#attributes)
- 最好在全局配置成你项目中的分页配置，也可在局部使用覆盖
:::

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

## merge

::: tip
- 自动合并单元格扩展功能
- 暂只支持 vertical 纵向合并
:::

| 属性        | 类型     | 默认值        | 说明    
| ----------- | ------  | --------------| ---------------                    | 
| enable      | Boolean | false         | 是否开启合并     
| auto        | Boolean | false         | 是否自动合并相同单元格                         |
| direction   | String  | vertical      | 合并方向       |

## virtual

::: tip
- 大数据虚构滚动扩展功能，若数据量大开启可显著提高渲染性能
- `rowHeight` 必填，内置参数请勿随便覆盖修改
:::

| 属性        | 类型     | 默认值        | 说明    
| ----------- | ------  | --------------| ---------------   |
| enable      | Boolean | false         | 是否开启虚拟滚动     |
| rowHeight   | Number  | 0             | 行高度      |
| offsetNum   | 内置  | 10             | 渲染数量偏移量      |
| totalHeight | 内置    | -             | 总高度      |
| renderHeight | 内置   | -             | 渲染区域高度      |
| indexStart   | 内置   | -              | 开始渲染位置      |
| indexEnd    | 内置     | -             | 结束渲染位置      |
| renderNum   | 内置     | -             | 可视区域渲染数量      |
| warppers    | 内置     | -             | 容器          |
| data        | 内置     | -             | 动态渲染数据      |
| sortData    | 内置     | -             | 排序后的数据          |
| selectAll    | 内置    | -             | selection 列是否全选          |


## resize
::: tip
- 跟随窗口大小自适应高度扩展功能，窗口不可出现滚动条效果最佳
- 自适应逻辑：`table.height = table.offsetParent.clientHeight - table.offsetTop - offset`
:::

| 属性        | 类型     | 默认值        | 说明    
| ----------- | ------  | --------------| ---------------                    | 
| enable      | Boolean | false         | 是否开启合自适应    
| offset      | Number  | 0             | calcHeight 偏移高度                         |



## 相关链接

- [element-ui table 组件](https://element.eleme.cn/#/zh-CN/component/table)
- [element-ui pagination 组件](https://element.eleme.cn/#/zh-CN/component/pagination)
