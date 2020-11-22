const queryProps = function () {
  return {
    order: "",
    orderColumn: "",
    props: {
      currentPage: "currentPage",
      pageSize: "pageSize",
      order: "order",
      orderColumn: "orderColumn"
    },
    formatter: (query) => query
  }
}

const pageProps = function () {
  return {
    enable: false,
    height: 45,
    pageSize: 20,
    pageSizes: [10, 20, 50, 100],
    currentPage: 1,
    layout: "total, sizes, prev, pager, next, jumper",
    class: "agel-pagination",
    total: 0
  }
}

export default {
  created() {
    let page = Object.assign(pageProps(), this.$agelTableConfig.page || {}, this.value.page || {},);
    let query = Object.assign(queryProps(), this.$agelTableConfig.query || {}, this.value.query || {},);
    this.extendApi('query', query);
    this.extendApi('page', page);
    this.extendApi("getData", this.getData);
    this.extendApi("getQuery", this.getQuery);
    this.interceptEvent["sort-change"] = this.sortChange;
    this.interceptEvent["current-change"] = this.currentChange;
    this.interceptEvent["size-change"] = this.sizeChange;
  },
  methods: {
    sizeChange(size) {
      this.value.page.currentPage = 1;
      this.value.page.pageSize = size;
      this.value.getData();
    },
    // 重名事件 page currentChange and table currentChange
    currentChange(...params) {
      // emit table currentChange event
      if (params.length === 2) return "current-change";
      // emit page pageChange event
      if (params.length === 1) {
        this.value.page.currentPage = params[0];
        this.value.getData();
        return "page-change";
      }
    },
    sortChange({ column, prop, order }) {
      if (column.sortable !== "custom") return;
      this.value.query.order = order;
      this.value.query.orderColumn = prop;
      this.value.getData();
    },
    getQuery() {
      let { props, formatter, ...queryObj } = this.value.query;
      let { order, orderColumn, ...otherQuery } = queryObj;
      return formatter({
        [props.currentPage]: this.value.page.currentPage,
        [props.pageSize]: this.value.page.pageSize,
        [props.order]: order,
        [props.orderColumn]: orderColumn,
        ...otherQuery,
      })
    },
    getData() {
      let request = this.value.request;
      if (!request) return;
      this.value.loading = true;
      return new Promise((resolve, reject) => {
        return request(this.getQuery(), resolve, reject)
      })
        .then(res => {
          let { data, total } = Array.isArray(res)
            ? { data: res, total: res.length }
            : res;
          this.value.loading = false;
          this.value.data = data;
          this.value.page.total = total;
        })
        .catch(() => {
          this.value.loading = false;
        });
    },
  }
}