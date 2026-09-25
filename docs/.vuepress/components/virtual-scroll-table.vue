<template>
  <div class="demo">
    <el-row style="margin-bottom:10px; display:flex; flex-wrap:wrap; align-items:center; gap:8px">
      <el-input-number v-model="number" :min="1" :step="100" placeholder="数据条数"></el-input-number>
      <el-button @click="setData()">加载指定行数</el-button>
      <el-button @click="setData(10000)">加载 1 万行</el-button>
      <el-button @click="setData(100000)">加载 10 万行</el-button>
      <el-input-number v-model="rowIndex" :min="1" :max="Math.max(table.data.length, 1)" placeholder="指定跳转行数"></el-input-number>
      <el-button @click="jump">跳转到指定行数</el-button>
    </el-row>
    <agel-table v-model="table"></agel-table>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      number: 10000,
      rowIndex: 100,
      table: {
        border: true,
        height: 200,
        virtual: { enable: true, rowHeight: 32 },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
            selectable: (row, index) => index > 2
          },
          { label: '#', type: 'index', width: 100, align: 'center' },
          { label: '姓名', prop: 'name', width: 200 },
          { label: '随机数', prop: 'address', minWidth: 100, sortable: true }
        ],
        data: []
      }
    }
  },
  mounted() {
    this.setData()
  },
  methods: {
    setData(count = this.number) {
      this.number = count
      const data = []
      for (let i = 0; i < count; i++) {
        data.push({
          name: `王小虎${i + 1}号`,
          address: Math.random() * 100
        })
      }
      this.table.data = data
    },
    jump() {
      const row = this.table.data[this.rowIndex - 1]
      if (row) this.table.virtualScrollToRow(row)
    }
  }
}
</script>
