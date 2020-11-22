<template>
  <agel-table v-model="table"></agel-table>
</template>
 
<script>
export default {
  data() {
    return {
      table: {
        border: true,
        page: {
          enable: true,
          height: 50,
          currentPage: 2,
          total: 1000,
          pageSize: 1,
          pageSizes: [1, 2, 3, 4, 5, 6],
        },
        columns: [{ label: "自定义分页配置，支持所有分页属性和事件" }],
        on: {
          "page-change": () => {
            // el-pagination 与 el-table 拥有重名事件 currentChange，故此修改为 page-change
            // currentPage 将自动变化 不需要手动赋值
            this.$message.success(
              `page-change,当前页码:${this.table.page.currentPage}页`
            );
          },
          "size-change": () => {
            // pageSize 将自动变化 不需要手动赋值
            this.$message.success(
              `page-change,每页展示:${this.table.page.pageSize}条`
            );
          },
          "prev-click": () => {
            this.$message.success("prev-click");
          },
          "next-click": () => {
            this.$message.success("next-click");
          },
        },
      },
    };
  },
};
</script>