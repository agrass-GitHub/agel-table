<template>
  <div class="demo">
    <el-input v-model="table.query.name" style="width:100px;margin-right:10px;"></el-input>
    <el-button icon="el-icon-search" @click="load">查询</el-button>
    <el-button @click="()=>table.loading=!table.loading">{{table.loading?'关闭':'开启'}}loading</el-button>
    <p><code v-show="queryString">{{queryString}}</code></p>
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
        height: "200px",
        data: [],
        page: { enable: true },
        query: { name: "小虎" },
        columns: [
          { label: "日期", prop: "date", width: 200, sortable: "custom" },
          { label: "姓名", prop: "name", width: 200 },
          { label: "地址", prop: "address", minWidth: 300 },
        ],
        request: (query, reslove, rejcet) => {
          this.queryString = JSON.stringify(query);
          this.http(query)
            .then((res) => reslove({ data: res.data, total: res.total }))
            .catch(rejcet);
        },
      },
    };
  },
  methods: {
    load() {
      this.table.getData();
    },
    http(quey) {
      // 模拟一个 http 请求
      return new Promise((reslove) => {
        setTimeout(() => {
          let data = [];
          for (let i = 0; i < quey.pageSize; i++) {
            let index = (quey.currentPage - 1) * quey.pageSize + (i + 1);
            data.push({
              date: "2016-05-02",
              name: "王小虎" + index,
              address: "上海市" + index,
            });
          }
          //  reslove(data); 如果没有分页，可直接 reslove 一个 data 数组
          reslove({ data: data, total: 100 });
        }, 1000);
      });
    },
  },
};
</script>