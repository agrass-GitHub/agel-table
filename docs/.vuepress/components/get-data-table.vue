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
        loading: false,
        height: "200px",
        data: [],
        page: { enable: true },
        query: { name: "小虎" },
        defaultSort: { prop: "date", order: "descending" },
        columns: [
          { label: "日期", prop: "date", width: 200, sortable: "custom" },
          { label: "姓名", prop: "name", width: 200 },
          { label: "地址", prop: "address", minWidth: 300 },
        ],
        request: () => {
          this.table.loading = true;
          this.http(this.table.query)
            .then((res) => {
              this.table.data = res.data;
              this.table.page.total = res.total;
              this.table.loading = false;
            })
            .catch(() => {
              this.table.loading = false;
            });
        },
      },
      table2: {
        // request 函数也可以接受 done，err 参数
        // 然后通过 table.getData 调用, getData => 开启loading => request => 回填分页 data => 关闭 loading
        request: (query, done, err) => {
          this.http(query)
            .then((res) => done({ data: res.data, total: res.total })) // 若没有分页可以直接 done(data)
            .catch(err);
        },
      },
    };
  },
  computed: {
    queryString() {
      return JSON.stringify(this.table.query);
    },
  },
  mounted() {
    this.table.request();
    // this.table2.getData()
  },
  methods: {
    onSearch() {
      this.table.request();
    },
    http(query) {
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