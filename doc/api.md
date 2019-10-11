# API 文档

## Props

- 初始化完成后，会为 table（v-model) 参数添加额外的内置参数和方法，该参数所有选项都是可选，哪怕完全可以传递一个空对象，也会正常渲染
- 根据场景需求可传递可选参数 `attach`，最终会合并到 table

| 属性    | 类型   | 注释说明                                         |
| ------- | ------ | ------------------------------------------------ |
| v-model | Object | table 参数配置，不可为计算属性，必须使用 v-model |
| attach  | Object | table 附属配置，可以为计算属性，会合并到 v-model |

## Table 参数

- `$ref` 可直接调用 Element-ui Table Methods
- `request` 可参考 Element-ui Table `load` 属性

| 属性        | 类型     | 注释说明                                                                                     |
| ----------- | -------- | -------------------------------------------------------------------------------------------- |
| ......      | Any      | All Element-ui Table Attributes                                                              |
| data        | Array    | 数据                                                                                         |
| \$ref       | Object   | Element-ui Table Vue 实例，内置属性不需要传递                                                |
| loading     | Boolean  | 开启加载状态                                                                                 |
| isPage      | Boolean  | 显示分页组件                                                                                 |
| isResize    | Boolean  | 是否自适应父容器高度，跟随窗口调整而变化                                                     |
| class       | String   | Table 的 Class 名称                                                                          |
| order       | String   | 当前排序状态                                                                                 |
| orderColumn | String   | 当前排序列名称                                                                               |
| page        | Object   | Page 组件相关配置                                                                            |
| on          | Object   | Table Page 组件的 Event 事件                                                                 |
| queryProps  | Object   | 指定传递给 request 方法的的参数属性值 `{page,pageSize,order,orderColumn}`                    |
| getQuery    | Function | 返回 query 参数 `{page,pageSize,order,orderColumn}`                                          |
| request     | Function | 获取列表数据的接口函数,参数:`(query, resolve)`,返回:`resolve({data,total})`                  |
| getData     | Function | 获取列表数据的函数，自动调用 request，同时加载 loading，回填 data 和分页，内置方法不需要传递 |
| resize      | Function | 自适应容器高度，内置方法不需要传递                                                           |

## Column 参数

- 当列包含多级表头时，为了更好的更新，columns 每次变化是会重新渲染所有的列

| 属性       | 类型    | 注释说明                         |
| ---------- | ------- | -------------------------------- |
| ......     | Any     | All Element-ui Column Attributes |
| display    | Boolean | 是否显示该列                     |
| children   | Array   | 配置多级表头                     |
| slotColumn | String  | 自定义表列的插槽名称             |
| slotHeader | String  | 自定义表头的插槽名称             |

## Page 参数

- 最好在全局配置成你项目中的分页配置，也可在局部使用覆盖

| 属性        | 默认                                      |
| ----------- | ----------------------------------------- |
| ......      | All Element-ui Pagination Attributes      |
| class       | 'agel-pagination''                        |
| layout      | 'total, sizes, prev, pager, next, jumper' |
| pageSizes   | [10, 20, 50, 100]                         |
| pageSizes   | 20                                        |
| currentPage | 1                                         |
| total       | 0                                         |

## On 参数

- page 和 table 拥有同名事件 `current-change`,该事件只生效于 table
- page 组件的`current-change`,`prev-click`,`next-click`合并为 pageChange
- 当分页或者排序发生变化，table 会自动触发 `getData` 事件

| 属性       | 注释说明                               |
| ---------- | -------------------------------------- |
| ......     | All Element-ui Table Pagination Events |
| pageChange | 当 page.currentPage 发生变化时触发     |
| sizeChange | 当 page.pageSize 发生变化时触发        |
| sortChange | 当 排序发生变化时触发                  |

## Slot 插槽

| 插槽名 | 注释说明                                                       |
| ------ | -------------------------------------------------------------- |
| empty  | 没有数据展示                                                   |
| append | 插入至表格最后一行之后的内容                                   |
| expand | 展开行的内容                                                   |
| -      | 自定义列的内容，需要在 column 的 slotColumn 属性指定插槽名称   |
| -      | 自定义表头的内容，需要在 column 的 slotHeader 属性指定插槽名称 |
