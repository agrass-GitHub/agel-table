<template>
  <div class="demo">
    <p><code>{{queryString}}</code></p>
    <el-input v-model="table.query.name" style="width:100px"></el-input>
    <el-button @click="()=>table.getData()">查询</el-button>
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
        defaultSort: { prop: "date", order: "descending" },
        columns: [
          { label: "性别", prop: "sex", sortable: "custom" },
          { label: "日期", prop: "date", sortable: "custom" },
        ],
        query: {
          name: "张三",
        },
        queryProps: {
          pageSize: "size",
          currentPage: "page",
          orderColumn: "orderName",
          // 也可对 value 进行格式化,
          order: (v) => ["order", v == "descending" ? "倒序" : "正序"],
        },
        request: async (query) => {
          let a = query.name2[0];
          return await this.mockData();
        },
      },
    };
  },
  computed: {
    queryString() {
      return JSON.stringify(this.table.query);
    },
  },
  methods: {
    async mockData() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([{ sex: "男" }]);
        }, 1000);
      });
    },
  },
};
</script>