---
title: API 文档
sidebar: auto
---

## props

| 属性    | 类型   | 必填 | 说明                             | 锚点                  |
| ------- | ------ | ---- | -------------------------------- | --------------------- |
| v-model | Object | 是   | table 参数配置，必须使用 v-model | [参考](/api.md#table) |
| attach  | Object | 否   | table 附属配置，会同步到 v-model | [参考](/api.md#table) |


## table

::: tip
- 支持所有 Element-ui [Table Attributes](https://element.eleme.cn/#/zh-CN/component/table#table-attributes)
- \$ref 可用来直接调用 Element-ui Table [Methods](https://element.eleme.cn/#/zh-CN/component/table#table-methods)
- 所有属性都是可选，请注意的默认值为【内置】的属性，请勿传递覆盖
:::

| 属性        | 类型         | 默认值  | 说明                                 | 
| ----------- | ------------ | ------ | ------------------------------------ | 
| ......      | ......       | ...... | All Element-ui Table Attributes      | 
| \$ref       | Object       | 内置   | Element-ui Table Vue 实例             | 
| loading     | Boolean      | false  | 是否开启加载状态                       | 
| data        | Array        | [ ]    | 数据                                 | 
| columns     | Array/Object | [ ]    | 列配置                               | 
| on          | Object       | { }    | Table 和 Page 组件的 Event 事件      | 
| page        | Object       | { }    | Page 组件相关配置                    | 
| merge       | Object       | { }    | 自动合并单元格配置                   | 
| virtual     | Object       | { }    | 虚拟滚动配置                         |
| query       | Object       | { }    | 指定 query 的的参数键名              | 
| request     | Function     | null   | 接口数据代理函数                     |
| getQuery    | Function     | 内置   | 返回 query 参数                      | 
| getData     | Function     | 内置   | 工作流程代理函数                     | 
| virtualScrollToRow     | Function     | 内置   | 滚动到指定行，开启虚拟滚动生效  |

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
| pageChange | page.currentPage 发生变化时触发         |
| sizeChange | page.pageSize 发生变化时触发            |
| sortChange | 排序发生变化时触发                      |

## query

:::tip
你可以设置成你项目中所需要的 table `query.props`，也可以使用 `formatter` 再进行格式化，建议这一步放在全局配置里面
:::

| 属性        | 类型     | 默认值       | 说明                      |
| ----------- | ------   | ----------- |-----------                |
| ......      |  Any     | -           | 可以定义任何参数           |  
| order       | String   | -           | ascending/descending      | 
| orderColumn | String   | -           | 排序列的 prop              |
| props       | Object   | {currentPage: "currentPage", pageSize: "pageSize", order: "order",orderColumn: "orderColumn"} | 键值配置选项     |
| formatter   | Function | -           | 对参数进行格式化     |

```js
// 使用
const query = this.table.getQuery();
```

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
暂只支持 vertical 纵向合并
:::

| 属性        | 类型     | 默认值        | 说明    
| ----------- | ------  | --------------| ---------------                    | 
| enable      | Boolean | false         | 是否开启合并     
| auto        | Boolean | false         | 是否自动合并相同单元格                         |
| auto        | String  | vertical      | 纵向合并横向合并，可选 vertical,horizontal         |

## virtual

::: tip
rowHeight 必填，内置参数请勿随便覆盖修改
:::

| 属性        | 类型     | 默认值        | 说明    
| ----------- | ------  | --------------| ---------------   |
| enable      | Boolean | false         | 是否开启虚拟滚动     |
| rowHeight   | Number  | 0             | 行高度      |
| offsetNum   | Number  | 8             | 渲染数量偏移量      |
| totalHeight | 内置    | -             | 总高度      |
| renderHeight | 内置   | -             | 渲染区域高度      |
| indexStart   | 内置   | -              | 开始渲染位置      |
| indexEnd    | 内置     | -             | 结束渲染位置      |
| renderNum   | 内置     | -             | 可视区域渲染数量      |
| data        | 内置     | -             | 动态渲染数据      |
| warppers    | 内置     | -             | 容器          |






## 相关链接

- [element-ui table 组件](https://element.eleme.cn/#/zh-CN/component/table)
- [element-ui pagination 组件](https://element.eleme.cn/#/zh-CN/component/pagination)
