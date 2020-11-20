<template>
  <div class="demo-page">
    <div class="table-box" :style="{height:table.isResize?'60vh':'auto'}">
      <agel-table v-model="table"></agel-table>
    </div>
  </div>
</template>
 
<script>
import Vue from 'vue';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import agelTable from '../../../src/index';
Vue.use(Element);
Vue.use(agelTable, {
  column: {
    align: 'center'
  }
});
export default {
  name: 'test',
  data() {
    return {
      drawer: false,
      table: {
        isResize: true,
        highlightCurrentRow: true,
        data: [
          {
            id: 1,
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            id: 2,
            date: '2016-05-04',
            name: '王小虎1',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            id: 3,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          },
          {
            id: 4,
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }
        ],
        columns: [
          { type: 'index', index: v => v },
          {
            type: 'expand',
            slotExpand(h) {
              return <p>小虎</p>;
            }
          },
          {
            label: '懒加载',
            minWidth: 150,
            prop: 'name'
          },
          {
            label: '懒加载2',
            prop: 'address',
            merge: true,
            children: [
              {
                label: '懒加载',
                prop: 'address',
                merge: false,
                minWidth: 150
              },
              {
                label: '懒加载',
                prop: 'address',
                minWidth: 150,
                slotExpand(h) {
                  return <p>小虎</p>;
                },
                slotHeader: (h, { column }) => {
                  return <div>自定义表头{column.label}</div>;
                },
                slotColumn: (h, { row }) => {
                  return <div>自定义懒加载,{row.name}</div>;
                }
              }
            ]
          }
        ],
        request: (params, resolve) => {
          this.http(params).then(data => {
            resolve({ data, total: params.pageSize * 5 });
          });
        }
      }
    };
  },
  computed: {
    displayColumns() {
      return Object.keys(this.table.columns).map(v => this.table.columns[v]);
    }
  },
  watch: {
    'table.isResize'(v) {
      if (!v) this.table.height = '';
    }
  },
  methods: {
    getData() {
      this.table.getData();
    },
    removeData() {
      this.table.columns.name.dispaly = false;
      this.http({ page: 1, pageSize: 0 }).then(data => {
        this.table.data = data;
        this.table.page.total = 0;
        this.table.page.currentPage = 1;
      });
    },
    // 模拟数据
    http({ page, pageSize, level = 1 }) {
      return new Promise(resolve => {
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
</script>
 



<style lang='stylus' >
.demo-page-panel {
  .el-drawer__body {
    overflow: auto;
    padding: 0px 20px;
  }

  .button-box, .check-box {
    margin-bottom: 20px;
  }

  .lablel {
    white-space: nowrap;
    margin-bottom: 10px;
  }

  .input-item {
    margin-bottom: 20px;
  }

  button {
    margin-right: 20px;
  }
}

.demo-page {
  max-width: 1000px;
  margin: 0 auto;

  // cover default table css
  table {
    margin: 0 0;

    tr {
      border-top: 0px;
    }

    tr:nth-child(2n) {
      background-color: transparent;
    }

    th, td {
      border-top: 0px;
      border-left: 0px;
    }
  }

  .append-slot {
    text-align: center;
    padding: 10px;
  }

  .el-button {
    margin-right: 10px;
  }

  .table-box {
    margin-top: 20px;
    border: 1px solid #93cdff;
  }

  .table-box .customRowClass-1 {
    background: oldlace;
  }

  .table-box .customRowClass-2 {
    background: #f0f9eb;
  }

  .table-box .customRowClass-3 {
    background: #f56c6c33;
  }
}
</style>
