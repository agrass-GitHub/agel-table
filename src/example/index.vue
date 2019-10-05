<template>
  <div class="app">
    <div class="left">
      <div class="table-box" :style="{height:table.isResize?'100%':'auto'}">
        <agel-table v-model="table" ref="table">
          <template v-slot:append v-if="isSlotAppend">
            <p class="append-slot">table slot append .... loading ...</p>
          </template>
          <template v-slot:empty v-if="isSlotEmpty">
            <p class="append-slot">table slot empty .... 暂无数据 ...</p>
          </template>
          <template v-slot:cutomHeader="scope">
            <el-button size="mini" @click="rowClick(scope)">{{scope.column.label}}</el-button>
          </template>
          <template v-slot:cutomColumn="scope">
            <el-button size="mini" @click="rowClick(scope)">自定义列</el-button>
          </template>
          <template v-slot:expand="{index,row}">
            <p>展开行：{{row.name}}</p>
          </template>
        </agel-table>
      </div>
    </div>
    <div class="right">
      <div class="input-box">
        <div class="input-item">
          <div class="lablel">功能</div>
          <el-checkbox v-model="table.showHeader">表头</el-checkbox>
          <el-checkbox v-model="table.isPage">分页</el-checkbox>
          <el-checkbox v-model="table.isResize">自适应</el-checkbox>
          <el-checkbox v-model="table.loading">加载</el-checkbox>
          <el-checkbox v-model="table.stripe">斑马纹</el-checkbox>
          <el-checkbox v-model="table.showSummary">合计</el-checkbox>
          <el-checkbox v-model="table.highlightCurrentRow">单选高亮行</el-checkbox>
          <el-checkbox v-model="table.columns[0].fixed">固定列</el-checkbox>
          <el-checkbox v-model="mainColumn.sortable">排序</el-checkbox>
          <el-checkbox v-model="isCustomIndex">自定义索引</el-checkbox>
          <el-checkbox v-model="isSlotAppend">自定义追加</el-checkbox>
          <el-checkbox v-model="isSlotEmpty">自定义无数据</el-checkbox>
          <el-checkbox :value="true" :disabled="true">自定义类名</el-checkbox>
          <!-- 多级表头下默认自带边框 -->
          <el-checkbox v-model="table.border" :disabled="true">边框</el-checkbox>
          <el-checkbox :value="true" :disabled="true">筛选列</el-checkbox>
          <el-checkbox :value="true" :disabled="true">拖动列</el-checkbox>
          <el-checkbox :value="true" :disabled="true">展开行</el-checkbox>
          <el-checkbox :value="true" :disabled="true">固定表头</el-checkbox>
          <el-checkbox :value="true" :disabled="true">流体高度</el-checkbox>
          <el-checkbox :value="true" :disabled="true">多级表头</el-checkbox>
          <el-checkbox :value="true" :disabled="true">懒加载树形</el-checkbox>
          <el-checkbox :value="true" :disabled="true">自定义列</el-checkbox>
          <el-checkbox :value="true" :disabled="true">自定义表头</el-checkbox>
        </div>
        <div class="input-item">
          <div class="lablel">动态显示列</div>
          <el-checkbox
            v-model="item.display"
            v-for="(item,i) in displayColumns"
            :key="i"
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
      </div>
    </div>
  </div>
</template>
 
<script>
import { guid } from '../lib/tool';
export default {
  name: 'app',
  data() {
    return {
      isSlotAppend: false,
      isSlotEmpty: false,
      isCustomIndex: false,
      treeDeep: [0, 1, 2],
      table: {
        isResize: false,
        isPage: true,
        showSummary: false,
        border: true,
        showHeader: true,
        stripe: false,
        rowKey: 'id',
        lazy: true,
        highlightCurrentRow: false,
        columns: [
          {
            label: '多选',
            type: 'selection',
            display: true,
            align: 'center',
            width: 50
          },
          { label: '展开', type: 'expand', display: true, width: 60 },
          {
            label: '索引',
            type: 'index',
            display: true,
            align: 'center',
            width: 80,
            index: v => {
              let { currentPage, pageSize } = this.table.page;
              return this.isCustomIndex
                ? `index-${(currentPage - 1) * pageSize + v}`
                : v;
            }
          },
          {
            label: '用户',
            minWidth: 300,
            prop: 'user',
            sortable: 'custom',
            display: true,
            slotColumn: 'cutomColumn',
            slotHeader: 'cutomHeader',
            filters: [
              { text: '编号 < 1-3', value: 3 },
              { text: '编号 < 1-5', value: 5 }
            ],
            filterMethod: (v, row) => row.index <= v
          },
          {
            label: '平台账户',
            width: 120,
            // 多级表头必须出现 border
            children: [
              {
                label: '姓名',
                prop: 'name',
                width: 100,
                display: true
              },
              {
                label: '性别',
                prop: 'user',
                width: 100,
                display: true,
                slotColumn: 'cutomColumn',
                slotHeader: 'cutomHeader'
              }
            ],
            display: true
          },
          {
            label: '手机',
            prop: 'phone',
            width: 100,
            showOverflowTooltip: true,
            display: true
          },
          {
            label: '简介',
            prop: 'intor',
            display: true,
            minWidth: 300
          }
        ],
        request: (params, resolve) => {
          this.http(params).then(data => {
            resolve({ data, total: params.pageSize * 5 });
          });
        },
        load: (tree, treeNode, resolve) => {
          this.http({
            page: 1,
            pageSize: 3 - tree.level,
            level: tree.level + 1
          }).then(data => resolve(data));
        },
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
  mounted() {},
  computed: {
    displayColumns() {
      return this.table.columns.filter(item => item.display != undefined);
    },
    mainColumn() {
      return this.table.columns.find(v => v.label == '用户');
    }
  },
  methods: {
    // 模拟数据
    http({ page, pageSize, level = 1 }) {
      return new Promise(resolve => {
        setTimeout(() => {
          let data = [];
          for (let i = 0; i < pageSize; i++) {
            let index = (page - 1) * pageSize + i;
            data.push({
              id: guid(),
              name: `编号-${level}-${index}`,
              user: 'admin',
              phone: 100,
              intor: '暂无简介',
              index: index,
              level: level,
              hasChildren: i < 3 && level < 3
            });
          }
          resolve(data);
        }, 200);
      });
    },
    rowClick({ row }) {
      console.log('触发按钮点击事件', row);
    },
    getData() {
      this.table.getData();
    },
    removeData() {
      this.http({ page: 1, pageSize: 0 }).then(data => {
        this.table.data = data;
        this.table.page.total = 0;
        this.table.page.currentPage = 1;
      });
    }
  }
};
</script>
 
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body,
html,
.app {
  width: 100%;
  height: 100%;
  min-width: 1200px;
}

.app {
  display: flex;
}
.left {
  width: calc(100% - 400px);
  padding: 50px;
}
.right {
  width: 400px;
  background: #93cdff59;
  padding: 50px 10px;
}

.button-box,
.check-box,
.input-box {
  margin-bottom: 20px;
}

.input-box .lablel {
  white-space: nowrap;
  margin-bottom: 10px;
}
.input-box .input-item {
  margin-bottom: 20px;
}
.input-box button {
  margin-right: 20px;
}

.input-box .el-checkbox {
  margin-right: 0;
  width: 33.3%;
}

.append-slot {
  text-align: center;
  padding: 10px;
}

.table-box {
  border: 1px solid #93cdff;
}

.el-table .customRowClass-1 {
  background: oldlace;
}

.el-table .customRowClass-2 {
  background: #f0f9eb;
}
.el-table .customRowClass-3 {
  background: #f56c6c33;
}
</style>