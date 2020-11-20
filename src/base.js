const props = function () {
  return {
    $ref: undefined,
    loading: false,
    columns: [],
    data: [],
    order: "",
    orderColumn: "",
    on: {},
    queryProps: {
      page: "page",
      pageSize: "pageSize",
      order: "order",
      orderColumn: "orderColumn"
    },
    request: undefined,
  }
}

export default {
  created() {
    let extendObj = props();
    let api = Object.assign(props(), this.$agelTableConfig.table || {}, this.value);
    Object.keys(api).forEach(key => {
      // if (!this.value.hasOwnProperty(key)) {
      this.extendApi(key, api[key], extendObj.hasOwnProperty(key))
      // }
    })
    this.extendApi("getQuery", this.getQuery);
    this.extendApi("getData", this.getData);
    this.interceptEvent["sort-change"] = this.sortChange;
  },
  mounted() {
    this.value.$ref = this.$refs.table;
  },
  methods: {
    getQuery() {
      let { page, pageSize, order, orderColumn } = this.value.queryProps;
      return {
        [page]: this.value.page.currentPage,
        [pageSize]: this.value.page.pageSize,
        [order]: this.value.order,
        [orderColumn]: this.value.orderColumn
      };
    },
    getData() {
      if (!this.value.request) return;
      this.value.loading = true;
      return new Promise((resolve, reject) => {
        return this.value.request(this.value.getQuery(), resolve, reject)
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
    sortChange({ column, prop, order }) {
      if (column.sortable !== "custom") return;
      this.value.order = order;
      this.value.orderColumn = prop;
      this.value.getData();
    },
  }
}