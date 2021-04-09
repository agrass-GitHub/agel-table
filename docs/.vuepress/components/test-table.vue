<template>
  <div class="demo">
    <el-row>
      <el-input-number v-model="number" :min="1" :max="100000" :step="100" placeholder="数据条数"></el-input-number>
      <el-button @click="setData">加载大数据</el-button>
      <el-input-number v-model="row" :min="1" :max="table.data.length" placeholder="指定跳转行数"></el-input-number>
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
      row: 100,
      table: {
        border: true,
        height: 300,
        virtual: { enable: true, rowHeight: 34 },
        columns: [
          { label: "序号", type: "index", width: 100, align: "center" },
          { label: "日期", prop: "date", width: 200 },
          { label: "姓名", prop: "name", width: 200 },
          { label: "地址", prop: "address", minWidth: 100 },
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
        data.push(
          Object.freeze({
            date: "2016-05-02",
            name: "王小虎" + i + 1 + "号",
            address: "上海市",
          })
        );
      }
      this.table.data = data;
    },
    jump() {
      this.table.virtualScrollToRow(this.row);
    },
  },
};
</script>