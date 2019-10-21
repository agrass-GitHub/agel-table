---
navbar: true
sidebar: false
pageClass: demo-page-class
# layout: demo
---

:::tip 演示
包含了 element-ui table 大多数基础使用例子，[完整代码](https://github.com/agrass-GitHub/agel-table/blob/master/docs/.vuepress/components/demo.vue)
:::

<ClientOnly><demo></demo> </ClientOnly>

```html
<agel-table v-model="table">
  <template v-slot:append>
    <p class="append-slot">table slot append .... loading ...</p>
  </template>
  <template v-slot:empty>
    <p class="append-slot">table slot empty .... 暂无数据 ...</p>
  </template>
  <template v-slot:cutomHeader="scope">
    <el-button size="mini">{{scope.column.label}}</el-button>
  </template>
  <template v-slot:cutomColumn="scope">
    <el-button size="mini">自定义列</el-button>
  </template>
  <template v-slot:expand="{index,row}">
    <p>展开行：{{row.name}}</p>
  </template>
</agel-table>
```

```js
export default {
  data() {
    return {
      table: {
        isResize: true,
        isPage: true,
        showSummary: true,
        immediate: true,
        lazy: true,
        highlightCurrentRow: true,
        rowKey: 'id',
        sumText: '合',
        columns: [
          {
            label: '多选',
            type: 'selection',
            align: 'center',
            fixed: true,
            display: true,
            width: 50
          },
          {
            label: '索引',
            type: 'index',
            display: true,
            align: 'center',
            width: 120,
            index: (v) => {
              let { currentPage, pageSize } = this.table.page;
              return `index-${(currentPage - 1) * pageSize + v}`;
            }
          },
          { label: '展开', type: 'expand', display: true, width: 60 },
          { label: '懒加载', minWidth: 150, prop: 'user', display: true },
          {
            label: '多级表头',
            width: 250,
            prop: 'name',
            // 多级表头必须出现 border
            children: [
              {
                label: '排序筛选',
                prop: 'name',
                width: 150,
                display: true,
                sortable: 'custom',
                filters: [{ text: 'index == 1', value: 1 }],
                filterMethod: (v, row) => row.index == v
              },
              {
                label: '自定义表头',
                display: true,
                width: 250,
                slotHeader: 'cutomHeader',
                slotColumn: 'cutomColumn'
              }
            ]
          }
        ],
        page: {
          pageSize: 3,
          pageSizes: [3, 10]
        },
        request: (params, resolve) => {
          this.http(params).then((data) => {
            resolve({ data, total: params.pageSize * 5 });
          });
        },
        load: (tree, treeNode, resolve) => {
          this.http({
            page: 1,
            pageSize: 3 - tree.level,
            level: tree.level + 1
          }).then((data) => resolve(data));
        },
        summaryMethod: () => ['合', ...this.table.columns.map((v, i) => i + 1)],
        rowClassName: ({ rowIndex }) => `customRowClass-${rowIndex + 1}`,
        on: {
          sortChange: (sort) => {
            console.log('触发sortChange:', sort);
          },
          currentChange: (row) => {
            console.log('触发currentChange:', row);
          },
          pageChange: (page) => {
            console.log('触发pageChange:' + page);
          },
          sizeChange: (size) => {
            console.log('触发sizeChange:' + size);
          }
        }
      }
    };
  },
  watch: {
    'table.isResize'(v) {
      if (!v) this.table.height = '';
    }
  },
  methods: {
    // 模拟数据
    http({ page, pageSize, level = 1 }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let data = [];
          for (let i = 0; i < pageSize; i++) {
            let index = (page - 1) * pageSize + i;
            data.push({
              id: Math.random(),
              name: `我是${level}级`,
              user: 'admin',
              index: index,
              level: level,
              hasChildren: i == 0 && level < 3
            });
          }
          resolve(data);
        }, 200);
      });
    }
  }
};
```
