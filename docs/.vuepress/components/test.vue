<template>
  <div class="demo-page">
    <!-- 测试使用 -->
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
        <el-checkbox v-model="table.showSummary">合计</el-checkbox>
        <el-checkbox v-model="table.isResize">自适应</el-checkbox>
        <el-checkbox v-model="table.highlightCurrentRow">单选高亮行</el-checkbox>
        <el-checkbox v-model="table.loading">加载</el-checkbox>
        <el-checkbox v-model="table.stripe">斑马纹</el-checkbox>
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
      <agel-table v-model="table" :attach="attach">
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
          { type: 'expand' },
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
                merge: true,
                minWidth: 150
              },
              {
                label: '懒加载',
                prop: 'address',
                minWidth: 150
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
    },
    attach() {
      let attach = {
        columns: [
          { type: 'index', index: v => v },
          { type: 'expand' },
          {
            label: '懒加载',
            minWidth: 150,
            prop: 'name'
          },
          {
            label: '懒加载2',
            prop: 'address',
            display: this.drawer,
            merge: true,
            children: [
              {
                label: '懒加载',
                prop: 'address',
                merge: true,
                minWidth: 150
              },
              {
                label: '懒加载',
                prop: 'address',
                minWidth: 150
              }
            ]
          }
        ]
      };
      if (this.drawer) {
        attach.isPage = false;
      }
      return attach;
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
