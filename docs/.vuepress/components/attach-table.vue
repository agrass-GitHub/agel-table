<template>
  <div class="demo">
    <el-button @click="add">修改高度</el-button>
    <agel-table v-model="table" :attach="{border,height,data,columns}"></agel-table>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      table: {},
      border: true,
      height: 150,
    };
  },
  computed: {
    data() {
      return [
        { date: "2016-05-02", name: "王小虎", address: "上海市" },
        { date: "2016-05-04", name: "王小虎", address: "上海市" },
      ];
    },
    columns() {
      // columns 属性也可以设置成对象
      return {
        date: { label: "日期", width: 200 },
        name: { label: "姓名", width: 200 },
        address: { label: "地址", minWidth: 300 },
      };
    },
  },
  methods: {
    add() {
      this.height += 10;
      this.$message("高度发生变化，同步：" + this.table.height);
    },
  },
};
</script>