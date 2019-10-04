# agel-table | 使 element-ui table 组件更简单

## 特性

- 支持 element-ui table 组件的所有 api 和 slot
- 更少的代码量，更简单的思想，更快的开发速度

该组件的思想就是以一个 table 对象来做所有的操作，哪怕页上多个列表也不用在 data 定义一堆 data1，data2 ... 等变量，简单明了。

## 安装

`npm install agel-table --save`

## 使用

### 简单 demo

```html
<template>
  <agel-table v-model="table"> </agel-table>
</template>
<script>
  export default {
    data() {
      return {
        table: {
          // ... more attrs
          data: [],
          columns: [{ label: '姓名', prop: 'name' }]
        }
      };
    }
  };
</script>
```

## 全局配置

```js
import agelTable from 'agel-table';

const conigf = {
  name: 'agel-table', // component name,use() 生效
  table: {}, // table attrs
  column: {} // column attrs
  page: {}, // page attrs
}

Vue.use(agelTable, conigf);

// or

Vue.prototype.$agelTableConfig = config;
```

# API 文档

## Table 参数

- `agel-table` 初始化完成后，会为 table 对象添加额外的内置参数
- `this.table.$ref` 可以用来直接调用 Element-ui Table Methods
- `request` 可参考 Element-ui Table `load` 属性

| 属性        | 类型     | 注释说明                                                                                       |
| ----------- | -------- | ---------------------------------------------------------------------------------------------- |
| ......      | Any      | More Element-ui Table Attributes                                                               |
| data        | Array    | 数据                                                                                           |
| \$ref       | Object   | Element-ui Table Vue 实例，内置属性不需要传递                                                  |
| loading     | Boolean  | 开启加载状态                                                                                   |
| isPage      | Boolean  | 显示分页组件                                                                                   |
| isResize    | Boolean  | 是否自适应父容器高度                                                                           |
| class       | String   | Table 的 Class 名称                                                                            |
| order       | String   | 当前排序状态                                                                                   |
| orderColumn | Array    | 当前排序列名称                                                                                 |
| queryProps  | Object   | 指定传递给 request 方法的的参数属性值 `{page,pageSize,order,orderColumn}`                      |
| page        | Object   | Page 组件相关配置                                                                              |
| on          | Object   | Table Page 组件的 Event 事件                                                                   |
| request     | Function | 获取列表数据的接口函数,参数:`({page,pageSize,order,orderColumn}, resolve)`,返回:`{data,total}` |
| getData     | Function | 获取列表数据的函数，自动调用 request，内置方法不需要传递                                       |
| resize      | Function | 自适应容器高度，内置方法不需要传递                                                             |

## Column 参数

- 值得提醒的是，当你修改列的属性，为了更好的更新，table 是会重新渲染所有的列

| 属性       | 类型    | 注释说明                          |
| ---------- | ------- | --------------------------------- |
| ......     | Any     | More Element-ui Column Attributes |
| display    | Boolean | 是否显示该列                      |
| children   | Array   | 配置多级表头                      |
| slotColumn | String  | 自定义表列的插槽名称              |
| slotHeader | String  | 自定义表头的插槽名称              |

## Page 参数

- 最好在全局配置成你项目中的分页配置，也可在局部使用覆盖

| 属性        | 默认                                      |
| ----------- | ----------------------------------------- |
| ......      | More Element-ui Pagination Attributes     |
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

| 属性       | 注释说明                                |
| ---------- | --------------------------------------- |
| ......     | More Element-ui Table Pagination Events |
| pageChange | 当 page.currentPage 发生变化时触发      |
| sizeChange | 当 page.pageSize 发生变化时触发         |
| sortChange | 当 排序发生变化时触发                   |

## Slot 插槽

| 插槽名 | 注释说明                                                       |
| ------ | -------------------------------------------------------------- |
| empty  | 没有数据展示                                                   |
| append | 插入至表格最后一行之后的内容                                   |
| expand | 展开行的内容                                                   |
| -      | 自定义列的内容，需要在 column 的 slotColumn 属性指定插槽名称   |
| -      | 自定义表头的内容，需要在 column 的 slotHeader 属性指定插槽名称 |

## 相关链接

- [element-ui table 组件](https://element.eleme.cn/#/zh-CN/component/table)
- [element-ui pagination 组件](https://element.eleme.cn/#/zh-CN/component/pagination)
