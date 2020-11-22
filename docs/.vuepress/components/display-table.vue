<template>
  <div class="demo">
    <el-checkbox v-for="item in table.columns" v-model="item.display" :key="item.label">{{item.label}}</el-checkbox>
    <agel-table v-model="table"></agel-table>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      table: {
        border: true,
        height: 100,
        columns: [
          { label: "日期", prop: "date", width: 200, display: true },
          { label: "姓名", prop: "name", width: 200, display: true },
          { label: "地址", prop: "address", minWidth: 300, display: true },
        ],
        data: [],
      },
    };
  },
};
</script>