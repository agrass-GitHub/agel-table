# API 文档

## props

::: tip

- 设计上的原因，组件初始化完成后，会为 `table`（_v-model,下文都简称 table_) 参数添加额外的内置属性和方法，因此该参数必须使用 `v-model`，且不可设为计算属性
- 可传递可选参数 `attach`， 当发生变化最终同步合并到 table
  :::

| 属性    | 类型   | 必填 | 说明                             | 锚点                  |
| ------- | ------ | ---- | -------------------------------- | --------------------- |
| v-model | Object | 是   | table 参数配置，必须使用 v-model | [参考](/api.md#table) |
| attach  | Object | 否   | table 附属配置，会同步到 v-model | [参考](/api.md#table) |

```html
<agel-table v-model="table" :attach="attach" />
```

```js
export default {
  data() {
    return {
      is: true,
      table: { columns: [{ label: '姓名', prop: 'name' }] }
    };
  },
  computed: {
    attach() {
      return {
        height: is ? 500 : 0
      };
    }
  },
  mounted() {
    console.log(this.table.height); // 500
  }
};
```

## table

::: tip

- 所有属性都是可选，请注意的默认值为【内置】的属性，请勿传递覆盖
- 支持所有 Element-ui [Table Attributes](https://element.eleme.cn/#/zh-CN/component/table#table-attributes)
- \$ref 可用来直接调用 Element-ui Table [Methods](https://element.eleme.cn/#/zh-CN/component/table#table-methods)

:::

| 属性        | 类型     | 默认值 | 说明                                 | 锚点                                 |
| ----------- | -------- | ------ | ------------------------------------ | ------------------------------------ |
| ......      | ......   | ...... | All Element-ui Table Attributes      | ......                               |
| \$ref       | Object   | 内置   | Element-ui Table Vue 实例            | -                                    |
| loading     | Boolean  | false  | 是否开启加载状态                     | -                                    |
| immediate   | Boolean  | false  | 初始化完成之后自动调用 getData       | -                                    |
| isPage      | Boolean  | true   | 显示分页组件                         | -                                    |
| isResize    | Boolean  | false  | 自适应父容器高度，跟随窗口调整而变化 | -                                    |
| isMerge     | Boolean  | false  | 所有列相同行自动合并                 | -                                    |
| class       | String   | -      | Table 的 Class 名称                  | -                                    |
| order       | String   | -      | 当前排序状态                         | -                                    |
| orderColumn | String   | -      | 当前排序列名称                       | -                                    |
| data        | Array    | [ ]    | 数据                                 | -                                    |
| columns     | Array    | [ ]    | 列配置                               | [参考](/api.md#column)               |
| page        | Object   | { }    | Page 组件相关配置                    | [参考](/api.md#page)                 |
| on          | Object   | { }    | Table 和 Page 组件的 Event 事件      | [参考](/api.md#on)                   |
| queryProps  | Object   | { }    | 指定 query 的的参数键名              | [参考](/api.md#queryprops，getquery) |
| getQuery    | Function | 内置   | 返回 query 参数                      | [参考](/api.md#queryprops，getquery) |
| request     | Function | null   | 接口数据代理函数                     | [参考](/api.md#request，getdata)     |
| getData     | Function | 内置   | 工作流程代理函数                     | [参考](/api.md#request，getdata)     |
| resize      | Function | 内置   | 自适应父容器高度                     | -                                    |

## column

::: tip

- 所有属性都是可选，修改 key 属性会使该列查询渲染
- 支持所有 Element-ui [Table-column Attributes](https://element.eleme.cn/#/zh-CN/component/table#table-column-attributes)
  :::

| 属性       | 类型    | 默认值 | 说明                             |
| ---------- | ------- | ------ | -------------------------------- |
| ......     | ......  | ...... | All Element-ui Column Attributes |
| children   | Array   | -      | 配置多级表头                     |
| slotColumn | String  | -      | 自定义表列的插槽名称             |
| slotHeader | String  | -      | 自定义表头的插槽名称             |
| display    | Boolean | true   | 是否显示该列                     |
| merge      | Boolean | false  | 该列相同行是否自动合并           |
| `key`      | String  | 内置   | 列的唯一 key 值                  |

## page

::: tip

- 支持所有 Element-ui [pagination Attributes](https://element.eleme.cn/#/zh-CN/component/pagination#attributes)
- 最好在全局配置成你项目中的分页配置，也可在局部使用覆盖
  :::

| 属性        | 类型   | 默认值                                    | 说明       |
| ----------- | ------ | ----------------------------------------- | ---------- |
| ......      | ...... | All Element-ui Pagination Attributes      | ......     |
| height      | Nnmber | 48                                        | 占据高度   |
| class       | String | 'agel-pagination''                        | class 名称 |
| layout      | String | 'total, sizes, prev, pager, next, jumper' | -          |
| pageSizes   | Array  | [10, 20, 50, 100]                         | -          |
| pageSize    | Nnmber | 20                                        | -          |
| currentPage | Nnmber | 1                                         | -          |
| total       | Nnmber | 0                                         | -          |

## on

::: tip

- 支持所有 Element-ui [Table Events](https://element.eleme.cn/#/zh-CN/component/table#table-events)，[Pagination Events](https://element.eleme.cn/#/zh-CN/component/pagination#events)
- Pagination 和 Table 拥有同名事件 `current-change`，避免冲突该事件只生效于 Table
- Pagination 组件的`current-change`,`prev-click`,`next-click`合并为 `pageChange`
- 当分页或者排序（sortable 为 custom）发生变化，Table 会自动触发 `getData`
  :::

| 属性       | 注释说明                                   |
| ---------- | ------------------------------------------ |
| ......     | All Element-ui Table and Pagination Events |
| pageChange | 当 page.currentPage 发生变化时触发         |
| sizeChange | 当 page.pageSize 发生变化时触发            |
| sortChange | 当 排序发生变化时触发                      |

## queryProps，getQuery

::: tip

- queryProps 包含以下四个值：分页，分页大小，排序，排序列；根据自己的业务场景可重新定义属性键名
- getQuery 只是一个快捷方法直接返回 query，可根据业务场景覆盖进行自定义
  :::

| 属性        | 类型   | 默认值      |
| ----------- | ------ | ----------- |
| page        | String | page        |
| pageSize    | String | pageSize    |
| order       | String | order       |
| orderColumn | String | orderColumn |

```js
const query = this.table.queryProps();
```

## request，getData

::: tip

- request 可参考 Element-ui Table [load](https://element.eleme.cn/#/zh-CN/component/table#shu-xing-shu-ju-yu-lan-jia-zai)
- getData 流程： 开启 loading -> getQuery -> request -> 回填数据和分页 -> 关闭 loading
  :::

```js
export default {
  data() {
    return {
      table: {
        columns: [{ label: '姓名', prop: 'name' }],
        request(query, resolve) {
          this.$http(query).then((res) => {
            resolve({ data: res.data, total: res.pageToal });
            // 如果没有分页信息可直接返回数组 resolve(res.data);
          });
        }
      }
    };
  },
  mounted() {
    this.table.getData();
  }
};
```

## slot 插槽

::: tip

- 支持所有 Element-ui Table Column Slot
  :::

| 插槽名 | 注释说明                                                     |
| ------ | ------------------------------------------------------------ |
| empty  | 没有数据展示                                                 |
| append | 插入至表格最后一行之后的内容                                 |
| expand | 展开行的内容                                                 |
| -      | 自定义列的内容，需要在 column 的 slotColumn 属性指定插槽名称 |
| -      | 自定义表头内容，需要在 column 的 slotHeader 属性指定插槽名称 |

```html
<agel-table v-model="table">
  <template v-slot:append>
    <p>table slot append .... loading ...</p>
  </template>
  <template v-slot:empty>
    <p>table slot empty .... 暂无数据 ...</p>
  </template>
  <template v-slot:cutomHeader="scope">
    <p>自定义表头</p>
  </template>
  <template v-slot:cutomColumn="scope">
    <p>自定义列</p>
  </template>
  <template v-slot:expand="scope">
    <p>展开行内容</p>
  </template>
</agel-table>
```

```js
export default {
  data() {
    return {
      table: {
        columns: [
          { label: '展开', type: 'expand' },
          {
            label: '姓名',
            slotHeader: 'cutomHeader',
            slotColumn: 'cutomColumn'
          }
        ]
      }
    };
  }
};
```

## 相关链接

- [element-ui table 组件](https://element.eleme.cn/#/zh-CN/component/table)
- [element-ui pagination 组件](https://element.eleme.cn/#/zh-CN/component/pagination)
