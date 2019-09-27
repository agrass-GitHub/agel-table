<template>
  <div class="app">
    <div class="left">
      <div class="table-box" :style="{height:table.isResize?'100%':'auto'}">
        <agel-table v-model="table">
          <template v-slot:append v-if="isSlotAppend">
            <p class="append-slot">table slot append .... loading ...</p>
          </template>
          <template v-slot:nameHeader="{index}">自定义表头{{index}}</template>
          <template v-slot:name="{row}">
            <el-button size="mini" @click="rowClick(row)">点击我</el-button>
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
          <el-checkbox v-model="table.isResize">自适应</el-checkbox>
          <el-checkbox v-model="table.showHeader">表头</el-checkbox>
          <el-checkbox v-model="table.stripe">斑马纹</el-checkbox>
          <el-checkbox v-model="table.isPage">分页</el-checkbox>
          <el-checkbox v-model="table.showSummary">合计</el-checkbox>
          <el-checkbox v-model="table.highlightCurrentRow">单选高亮行</el-checkbox>
          <el-checkbox v-model="table.isResizable" @change="changeResizable">拖动列</el-checkbox>
          <el-checkbox v-model="table.columns[0].fixed">固定列</el-checkbox>
          <el-checkbox v-model="mainColumn.sortable">排序</el-checkbox>
          <el-checkbox v-model="mainColumn.slot">自定义列</el-checkbox>
          <el-checkbox v-model="mainColumn.slotHeader">自定义表头</el-checkbox>
          <el-checkbox v-model="isCustomIndex">自定义索引</el-checkbox>
          <el-checkbox v-model="isSlotAppend">自定义追加</el-checkbox>
          <el-checkbox :value="true" :disabled="true">自定义类名</el-checkbox>
          <el-checkbox v-model="table.border" :disabled="true">边框</el-checkbox>
          <el-checkbox :value="true" :disabled="true">树形</el-checkbox>
          <el-checkbox :value="true" :disabled="true">筛选列</el-checkbox>
          <el-checkbox :value="true" :disabled="true">展开行</el-checkbox>
          <el-checkbox :value="true" :disabled="true">固定表头</el-checkbox>
          <el-checkbox :value="true" :disabled="true">流体高度</el-checkbox>
          <el-checkbox :value="true" :disabled="true">多级表头</el-checkbox>
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
          <el-button @click="getData">追加数据</el-button>
          <el-input-number v-model="number" :min="1" :max="100" :precision="0"></el-input-number>
        </div>
        <el-button @click="removeData">清空数据</el-button>
      </div>
    </div>
  </div>
</template>
 
<script>
export default {
  name: 'app',
  data() {
    return {
      index: 0,
      number: 5,
      isSlotAppend: false,
      isResizable: false,
      isCustomIndex: false,
      treeDeep: [1, 2, 3],
      table: {
        isResize: false,
        isPage: false,
        showSummary: false,
        border: true,
        showHeader: true,
        stripe: false,
        rowKey: 'id',
        lazy: true,
        highlightCurrentRow: false,
        data: [],
        columns: [
          {
            label: '多选',
            type: 'selection',
            display: true,
            fixed: false,
            resizable: false,
            align: 'center',
            width: 50
          },
          { label: '展开', type: 'expand', display: true, width: 60 },
          {
            label: '索引',
            type: 'index',
            display: true,
            align: 'center',
            resizable: false,
            width: 80,
            index: v => (this.isCustomIndex ? `index-${v}` : v)
          },
          {
            label: '姓名',
            prop: 'name',
            minWidth: 300,
            sortable: false,
            slot: false,
            resizable: false,
            slotHeader: false,
            filters: [
              { text: '编号前3名', value: 3 },
              { text: '编号前10名', value: 10 }
            ],
            filterMethod: (v, row) => row.index <= v
          },
          {
            label: '平台账户',
            prop: 'user',
            width: 120,
            resizable: false,
            // 多级表头必须出现 border
            children: [
              { label: '账号', prop: 'user', width: 100 },
              { label: '密码', prop: 'pwd', width: 100 }
            ],
            display: true
          },
          { label: '手机', prop: 'phone', display: true, resizable: false },
          {
            label: '简介',
            prop: 'intor',
            display: true,
            resizable: false,
            width: 600
          }
        ],
        rowClassName: ({ rowIndex }) => `customRowClass-${rowIndex + 1}`,
        load: (tree, treeNode, resolve) => {
          this.http(tree.level + 1, 0, 3).then(data => {
            this.treeDeep.pop();
            resolve(data);
          });
        },
        on: {
          sortChange({ column, prop, order }) {
            console.log(this, { column, prop, order });
          }
        }
      }
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    displayColumns() {
      return this.table.columns.filter(item => item.display != undefined);
    },
    mainColumn() {
      return this.table.columns.find(v => v.label == '姓名');
    }
  },
  methods: {
    getId() {
      return Number(
        Math.random()
          .toString()
          .substr(3, 3) + Date.now()
      ).toString(36);
    },
    http(level, index, maxLength) {
      return new Promise(resolve => {
        setTimeout(() => {
          let data = [];
          for (let i = 0; i < maxLength; i++) {
            index++;
            data.push({
              id: this.getId(),
              name: `编号-${level}-${index}`,
              user: 'admin',
              phone: 110,
              intor: '暂无简介',
              index: index,
              level: level,
              hasChildren: this.treeDeep.includes(index)
            });
          }
          resolve(data);
        }, 200);
      });
    },
    rowClick(row) {
      this.$message(`当前点击的是${row.name}`);
    },
    changeResizable(is) {
      this.table.columns.forEach(v => (v.resizable = is));
    },
    removeData() {
      this.table.loading = true;
      this.http().then(() => {
        this.table.data = [];
        this.index = 0;
        this.table.loading = false;
      });
    },
    getData() {
      this.table.loading = true;
      this.http(1, this.index, this.number).then(data => {
        this.table.data = this.table.data.concat(data);
        this.index = this.table.data.length;
        this.table.loading = false;
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