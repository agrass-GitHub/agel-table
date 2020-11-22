<template>
  <div class="demo">
    <code v-show="queryString">{{queryString}}</code>
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
          props: {
            currentPage: "page",
            pageSize: "size",
            order: "order",
            orderColumn: "orderName",
          },
          formatter: (query) => {
            query.order = query.order == "descending" ? 1 : 0;
            return query;
          },
        },
        on: {
          "sort-change": this.getQuery,
          "page-change": this.getQuery,
          "size-change": this.getQuery,
        },
      },
    };
  },
  mounted() {
    this.getQuery();
  },
  methods: {
    getQuery() {
      this.queryString = JSON.stringify(this.table.getQuery());
    },
  },
};
</script>