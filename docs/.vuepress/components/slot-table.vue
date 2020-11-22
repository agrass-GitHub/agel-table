<template>
  <agel-table v-model="table">
    <template v-slot:expand="props">
      <div style="text-align:center">{{props.row.date}}=>template展开行内容</div>
    </template>
    <template v-slot:date="props">
      <el-tag>{{props.row.date}}</el-tag>
    </template>
    <template v-slot:dateHeader>
      <el-tag>模板自定义列-表头</el-tag>
    </template>
    <template v-slot:append>
      <p style="text-align:center">最后一行 slot append...</p>
    </template>
  </agel-table>
</template>
 
<script>
export default {
  data() {
    return {
      table: {
        border: true,
        columns: [
          {
            label: "展开行",
            type: "expand",
            width: 80,
            // 也支持 render 函数写法
            // slotExpand: (h, { row }) => {
            //   return <p style="text-align:center">{row.date}=>render展开行内容</p>;
            // },
          },
          {
            width: 200,
            slotColumn: "date",
            slotHeader: "dateHeader",
          },
          {
            minWidth: 200,
            slotColumn: (h, { row }) => {
              return <el-tag>{row.name}</el-tag>;
            },
            slotHeader: () => {
              return <el-tag>render函数自定义列-表头</el-tag>;
            },
          },
        ],
        data: [
          { date: "2016-05-02", name: "王小虎", address: "上海市" },
          { date: "2016-05-04", name: "王小虎", address: "上海市" },
        ],
      },
    };
  },
};
</script>