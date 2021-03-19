<template>
  <div class="demo">
    <code>{{queryString}}</code>
    <el-input v-model="table.query.name" style="width:100px"></el-input>
    <el-button>查询</el-button>
    <agel-table v-model="table"></agel-table>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      table: {
        border: true,
        height: 200,
        page: { enable: true, total: 1000 },
        columns: [{ label: "日期", prop: "date", sortable: "custom" }],
        query: {
          name: "张三",
        },
        queryProps: {
          pageSize: "page",
          currentPage: "size",
          orderColumn: "orderName",
          order: (v) => ["order", v == "descending" ? 1 : 0],
        },
      },
    };
  },
  computed: {
    queryString() {
      return JSON.stringify(this.table.query);
    },
  },
};
</script>