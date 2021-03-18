<template>
  <div>
    <el-button @click="()=>table.getData()">查询</el-button>
    <el-button @click="getRef">ref</el-button>
    <agel-table v-model="table"></agel-table>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      table: {
        border: true,
        "highlight-current-row": true,
        columns: [
          { type: "selection", width: 50, align: "center" },
          { label: "姓名", prop: "name", width: 200 },
          { label: "日期1s", prop: "date", width: 200, sortable: "custom" },
          { label: "姓名", prop: "name", width: 200 },
          { label: "地址", prop: "address", minWidth: 300 },
        ],
        data: [
          { date: "2016-05-02", name: "王小虎", address: "上海市" },
          { date: "2016-05-04", name: "王小虎", address: "上海市" },
        ],
        // page: { enable: true, total: 100 },
        on: {
          "page-change"(v) {
            console.log("0", v);
          },
          "current-change"(v) {
            console.log("1", v);
          },
          "size-change"(v) {
            console.log(v);
          },
          "sort-change"(v) {
            console.log(v);
          },
          "selection-change": () => {
            console.log(this.table.selection);
          },
        },
        request: (query, doen) => {
          setTimeout(() => {
            doen({
              data: [
                { date: "2016-05-102", name: "王小虎", address: "上海市" },
                { date: "2016-05-204", name: "王小虎", address: "上海市" },
                { date: "2016-05-302", name: "王小虎", address: "上海市" },
                { date: "2016-05-404", name: "王小虎", address: "上海市" },
                { date: "2016-05-502", name: "王小虎", address: "上海市" },
                { date: "2016-05-604", name: "王小虎", address: "上海市" },
              ],
              total: 100,
            });
          }, 1000);
        },
      },
    };
  },
  methods: {
    getRef() {
      console.log(this.table.getRef());
    },
  },
};
</script>