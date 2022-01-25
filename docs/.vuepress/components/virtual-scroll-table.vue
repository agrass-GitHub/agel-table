<template>
  <div class="demo">
    <el-row style="margin-bottom:10px">
      <el-input-number v-model="number" :min="1" :max="100000" :step="100" placeholder="数据条数"></el-input-number>
      <el-button @click="setData">加载大数据</el-button>
      <el-input-number v-model="rowIndex" :min="1" :max="table.data.length" placeholder="指定跳转行数"></el-input-number>
      <el-button @click="jump">跳转到指定行数</el-button>
    </el-row>
    <agel-table v-model="table"></agel-table>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      number: 1000,
      rowIndex: 100,
      table: {
        border: true,
        height: 200,
        virtual: { enable: true, rowHeight: 35 },
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            selectable: (row, index) => {
              // console.log(index)
              return index > 2;
            },
          },
          { label: "#", type: "index", width: 50, align: "center" },
          { label: "姓名", prop: "name", width: 200 },
          { label: "随机数", prop: "address", minWidth: 100, sortable: true },
        ],
        data: [],
      },
    };
  },
  mounted() {
    this.setData();
  },
  methods: {
    setData() {
      let data = [];
      for (let i = 0; i < this.number; i++) {
        // 冻结对象可获得更好的性能
        data.push({
          name: "王小虎" + (i + 1) + "号",
          address: Math.random() * 100,
        });
      }
      this.table.data = data;
    },
    jump() {
      console.log(this.table.data[this.rowIndex])
      this.table.virtualScrollToRow(this.table.data[this.rowIndex]);
    },
  },
};
</script>