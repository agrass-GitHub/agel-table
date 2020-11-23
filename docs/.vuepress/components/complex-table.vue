<template>
  <div class="demo">
    <el-button @click="clearSelection">清空选中</el-button>
    <agel-table v-model="table"></agel-table>
  </div>
</template>
 
<script>
export default {
  data() {
    let data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        date: "2016-05-01 10:20",
        name: "王小虎" + i,
        sex: i % 2 == 0 ? "男" : "女",
        address: "上海市普陀区金沙江路 1518 弄",
        hasChildren: i == 0,
      });
    }
    return {
      table: {
        data,
        border: true,
        stripe: true,
        height: 300,
        lazy: true,
        "highlight-current-row": true,
        "show-summary": true,
        "sum-text": "合计",
        "row-key": "name",
        "default-sort": { prop: "name", order: "ascending" },
        "tree-props": { children: "children", hasChildren: "hasChildren" },
        "summary-method": () => ["合", "计", "也", "还", "可", "以"],
        "row-class-name": ({ rowIndex }) => {
          return rowIndex == 0 ? "success-row" : "";
        },
        load: (tree, treeNode, resolve) => {
          setTimeout(() => {
            resolve([
              {
                date: "2016-05-01 10:20",
                name: "王小虎",
                sex: "男",
                address: "上海市普陀区金沙江路 1517 弄",
              },
            ]);
          }, 1000);
        },
        columns: [
          { type: "selection", width: 50, align: "center", fixed: true },
          {
            label: "#",
            type: "index",
            align: "center",
            width: 50,
            index: (index) => "#" + (index + 1),
          },
          { label: "日期", prop: "date", width: 200 },
          {
            label: "配送信息",
            children: [
              { label: "姓名", prop: "name", width: 80, sortable: true },
              {
                label: "性别",
                prop: "sex",
                width: 80,
                filters: [
                  { text: "男", value: "男" },
                  { text: "女", value: "女" },
                ],
                "filter-method": (value, row) => {
                  return row.sex === value;
                },
              },
              { label: "地址", prop: "address", width: 400 },
            ],
          },
        ],
        on: {
          "selection-change": () => {
            this.$message.success("选择项发送变化");
          },
        },
      },
    };
  },
  methods: {
    clearSelection() {
      this.table.$ref.clearSelection();
    },
  },
};
</script>
<style>
.el-table .success-row {
  background: #f0f9eb;
}
</style>