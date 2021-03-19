<template>
  <div class="demo">
    <code v-show="queryString">{{qstr}}</code>
    <el-input v-model="table.query.name" style="width:100px"></el-input>
    <agel-table v-model="table"></agel-table>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      queryString: "",
      table: {
        border: true,
        height: 200,
        page: { enable: true, total: 1000 },
        columns: [{ label: "日期", prop: "date", sortable: "custom" }],
        query: {
          userId: "admin",
          name: "张三",
        },
        queryProps: {
          pageSize: (v) => ["page", v],
          currentPage: (v) => ["size", v],
          orderColumn: (v) => ["orderColumn", v],
          order: (v) => ["order", v == "descending" ? 1 : 0],
        },
      },
    };
  },
  mounted() {
    this.getQuery();
  },
  computed: {
    qstr() {
      return JSON.stringify(this.table.query);
    },
  },
  methods: {
    getQuery() {
      this.queryString = JSON.stringify(this.table.getQuery());
    },
  },
};
</script>