<template>
  <div>
    <agel-table v-model="table"></agel-table>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      table: {
        border: true,
        stripe: true,
        height: 300,
        lazy: true,
        "highlight-current-row": true,
        "show-summary": true,
        "sum-text": "合计",
        "row-key": "date",
        "default-sort": { prop: "date", order: "ascending" },
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
            index: (index) => index * 2,
          },
          { label: "日期", prop: "date", width: 200, sortable: true },
          {
            label: "配送信息",
            children: [
              { label: "姓名", prop: "name", width: 80 },
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
        data: [
          {
            date: "2016-05-01",
            name: "王小虎",
            sex: "男",
            address: "上海市普陀区金沙江路 1518 弄",
            hasChildren: true,
          },
          {
            date: "2016-05-02",
            name: "王小虎",
            sex: "女",
            address: "上海市普陀区金沙江路 1517 弄",
          },
          {
            date: "2016-05-03",
            name: "王小虎",
            sex: "男",
            address: "上海市普陀区金沙江路 1517 弄",
          },
          {
            date: "2016-05-04",
            name: "王小虎",
            sex: "女",
            address: "上海市普陀区金沙江路 1517 弄",
          },
          {
            date: "2016-05-05",
            name: "王小虎",
            sex: "男",
            address: "上海市普陀区金沙江路 1517 弄",
          },
          {
            date: "2016-05-06",
            name: "王小虎",
            sex: "女",
            address: "上海市普陀区金沙江路 1517 弄",
          },
          {
            date: "2016-05-07",
            name: "王小虎",
            sex: "男",
            address: "上海市普陀区金沙江路 1517 弄",
          },
          {
            date: "2016-05-08",
            name: "王小虎",
            sex: "女",
            address: "上海市普陀区金沙江路 1517 弄",
          },
        ],
      },
    };
  },
};
</script>
<style>
.el-table .success-row {
  background: #f0f9eb;
}
</style>