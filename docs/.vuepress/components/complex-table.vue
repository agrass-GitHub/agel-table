<template>
  <div class="demo">
    <div style="margin-bottom:10px">
      <el-button @click="clearSelection">清空选中</el-button>
      <el-button @click="updateLabel">修改列信息</el-button>
    </div>
    <agel-table v-model="table"> </agel-table>
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
        address: "上海市",
        hasChildren: i == 0,
      });
    }
    return {
      table: {
        data,
        border: true,
        stripe: true,
        height: 400,
        lazy: true,
        highlightCurrentRow: true,
        defaultSort: { prop: "name", order: "ascending" },
        rowKey: "name",
        treeProps: { children: "children", hasChildren: "hasChildren" },
        showSummary: true,
        summaryMethod: () => ["这", "是", "一", "个", "合", "计"],
        rowClassName: ({ rowIndex }) => (rowIndex == 0 ? "success-row" : ""),
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
          {
            type: "selection",
            width: 50,
            align: "center",
            fixed: true,
          },
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
              {
                label: "姓名",
                prop: "name",
                width: 80,
                sortable: true,
              },
              {
                label: "性别",
                prop: "sex",
                width: 80,
                filters: [
                  { text: "男", value: "男" },
                  { text: "女", value: "女" },
                ],
                filterMethod: (value, row) => row.sex === value,
              },
              {
                label: "地址",
                minWidth: 300,
                prop: "address",
              },
            ],
          },
        ],
        on: {
          "selection-change": () => {
            this.$message.success("选择项发生变化");
          },
        },
      },
    };
  },
  methods: {
    clearSelection() {
      this.table.getRef().clearSelection();
    },
    updateLabel() {
      this.table.getCol("address").label = "地址" + Math.random();
    },
  },
};
</script>
<style>
.el-table .success-row {
  background: #f0f9eb;
}
</style>