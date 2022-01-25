<template>
  <div class="demo">
    <div style="margin-bottom:10px">
      <el-checkbox v-for="item in table.columns" v-if="item.prop" :key="item.prop" v-model="item.display">{{item.label}}</el-checkbox>
    </div>
    <agel-table v-model="table"></agel-table>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      address: true,
      table: {
        columns: [
          {
            type: "selection",
            display: () => {
              return this.table.columns[1].display;
            },
          },
          { label: "日期", prop: "date", width: 200, display: true },
          {
            label: "姓名",
            prop: "name",
            width: 200,
            display: true,
          },
          {
            label: "地址",
            prop: "address",
            minWidth: 300,
            display: true,
          },
        ],
        data: [],
      },
    };
  },
};
</script>