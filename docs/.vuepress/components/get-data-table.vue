<template>
  <div class="demo">
    <p><code v-show="queryString">{{queryString}}</code></p>
    <p>
      <el-input v-model="table.query.name" style="width:100px;margin-right:10px;"></el-input>
      <el-button icon="el-icon-search" @click="onSearch">查询</el-button>
    </p>
    <agel-table v-model="table"></agel-table>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      table: {
        border: true,
        data: [],
        // 该对象放置table 对象的查询参数，默认有 currentPage,pageSize,orderColumn,order
        query: { name: "小虎" },
        // 默认排序列
        defaultSort: { prop: "date", order: "descending" },
        // 分页组件在此配置，建议配置在全局，页面可省略
        page: {
          enable: true,
          currentPage: 1,
          pageSize: 5,
          pageSizes: [5, 10, 15, 20],
        },
        // 菜单列配置
        menu: {
          enable: true,
          fixed: "right",
          onEdit: ({ row }) => {
            this.$message.info("编辑", row.date);
          },
          onDel: ({ row }) => {
            this.$message.info("删除", row.date);
          },
        },
        // 表格列配置
        columns: [
          { label: "日期", prop: "date", width: 200, sortable: "custom" },
          { label: "姓名", prop: "name", width: 200 },
          { label: "地址", prop: "address", minWidth: 300 },
        ],
        // 接口函数
        request: (query, done, err) => {
          // query == this.table.query
          this.getHttpData(query)
            .then((res) => done({ data: res.data, total: res.total }))
            .catch(err);
        },
      },
    };
  },
  computed: {
    queryString() {
      return  JSON.stringify(this.table.query);
    },
  },
  // table.getData 只能在 mounted 生命周期之后调用
  mounted() {
    this.table.getData();
  },
  methods: {
    onSearch() {
      // restPage 重置 分页 为 1
      this.table.getData({ restPage: true });
    },
    getHttpData(query) {
      // 模拟一个 http 请求
      return new Promise((reslove) => {
        setTimeout(() => {
          let data = [];
          for (let i = 0; i < query.pageSize; i++) {
            let index = (query.currentPage - 1) * query.pageSize + (i + 1);
            data.push({
              date: "2016-05-02",
              name: "王小虎" + index,
              address: "上海市" + index,
            });
          }
          reslove({ data: data, total: 100 });
        }, 1000);
      });
    },
  },
};
</script>