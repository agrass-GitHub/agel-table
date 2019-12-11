<template>
  <div class="demo-page">
    <el-drawer
      title="功能区面板"
      direction="rtl"
      :visible.sync="drawer"
      size="400px"
      custom-class="demo-page-panel"
    >
      <div class="input-item">
        <div class="lablel">功能切换</div>
        <el-checkbox v-model="table.isPage">分页</el-checkbox>
        <el-checkbox v-model="table.isResize">自适应</el-checkbox>
        <el-checkbox v-model="table.loading">加载</el-checkbox>
        <el-checkbox :value="true" disabled>合并行</el-checkbox>
      </div>
      <div class="input-item">
        <div class="lablel">动态显示列</div>
        <el-checkbox
          v-model="item.display"
          v-for="(item,i) in displayColumns"
          :key="item.label"
          :label="item.label"
        ></el-checkbox>
      </div>
      <div class="input-item">
        <div class="lablel">高度</div>
        <el-input type="number" v-model="table.height"></el-input>
      </div>
      <div class="input-item">
        <div class="lablel">最大高度</div>
        <el-input type="number" v-model="table.maxHeight"></el-input>
      </div>
      <div class="input-item">
        <el-button @click="getData">加载数据</el-button>
        <el-button @click="removeData">清空数据</el-button>
      </div>
    </el-drawer>
    <div>
      <el-button @click="drawer=!drawer">功能区</el-button>
      <span v-if="table.isResize">盒子高度 60vh, 表格会自适应变化</span>
      <span v-else>盒子高度 auto</span>
    </div>
    <div class="table-box" :style="{height:table.isResize?'60vh':'auto'}">
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
    </div>
  </div>
</template>
 
<script>
import Vue from 'vue';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import agelTable from '../../../src/index';
Vue.use(Element);
Vue.use(agelTable);

export default {
  name: 'demo',
  data() {
    return {
      drawer: false,
      table: {
        isResize: true,
        isPage: true,
        showSummary: true,
        immediate: true,
        sumText: '合',
        columns: [
          {
            label: '多选',
            type: 'selection',
            align: 'center',
            display: true,
            width: 50
          },
          {
            label: '自定义索引',
            type: 'index',
            display: true,
            align: 'center',
            width: 120,
            index: v => {
              let { currentPage, pageSize } = this.table.page;
              return `index-${(currentPage - 1) * pageSize + v}`;
            }
          },
          {
            label: '展开',
            type: 'expand',
            display: true,
            width: 60
          },
          {
            label: '名称',
            minWidth: 250,
            prop: 'name',
            display: true
          },
          {
            label: '多级表头',
            width: 250,
            prop: 'name',
            // 多级表头必须出现 border
            children: [
              {
                label: '合并行',
                prop: 'merge',
                width: 150,
                display: true,
                merge: true,
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
          this.http(params).then(data => {
            resolve({ data, total: params.pageSize * 5 });
          });
        },
        summaryMethod: () => ['合', ...this.table.columns.map((v, i) => i + 1)],
        rowClassName: ({ rowIndex }) => `customRowClass-${rowIndex + 1}`,
        on: {
          sortChange: sort => {
            console.log('触发sortChange:', sort);
          },
          currentChange: row => {
            console.log('触发currentChange:', row);
          },
          pageChange: page => {
            console.log('触发pageChange:' + page);
          },
          sizeChange: size => {
            console.log('触发sizeChange:' + size);
          }
        }
      }
    };
  },
  computed: {
    displayColumns() {
      let arr = this.table.columns;
      return [
        ...arr.filter(v => !v.children),
        ...arr.find(v => v.children).children
      ];
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
              name: `agel-table`,
              merge: '自动合并',
              index: index
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
