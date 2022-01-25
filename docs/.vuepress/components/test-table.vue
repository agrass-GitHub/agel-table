<template>
  <agel-table v-model="table"></agel-table>
</template>
 
<script>
export default {
  data() {
    return {
      table: {
        border: true,
        menu: {
          xx:111,
          enable: true,
          onEdit: () => {},
          onDel: () => {},
          menuRender:({h,menu})=>{
            return <el-tag>{menu.xx}</el-tag>
          }
        },
        columns: [
           {
            type: "selection",
            align: "center",
            width: 50,
            fixed: "left",
          },
          { label: "日期", prop: "date", width: 200 },
          { label: "姓名", prop: "name", width: 200 },
          { label: "地址", prop: "address", minWidth: 300 },
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