/**
 * @description 分页
 */
const pageProps = function () {
  return {
    enable: false,
    height: 45,
    pageSize: 20,
    pageSizes: [10, 20, 50, 100],
    currentPage: 1,
    layout: "total, sizes, prev, pager, next, jumper",
    class: "agel-pagination",
    total: 0,
  };
};

export default {
  created() {
    const page = Object.assign(
      pageProps(),
      this.$agelTableConfig.page || {},
      this.value.page || {}
    );
    if (this.value.page || this.$agelTableConfig.page) {
      this.$set(this.value, "page", page);
      this.setQuery("currentPage", page.page);
      this.setQuery("pageSize", page.pageSize);
    }
  },
  watch: {
    'value.page.currentPage'(v) {
      v != undefined && this.setQuery("currentPage", v);
    },
    'value.page.pageSize'(v) {
      v != undefined && this.setQuery("pageSize", v);
    }
  },
  methods: {
    pageChange(page) {
      this.value.page.currentPage = page;
      this.getData();
      if (this.value.on && this.value.on["page-change"]) {
        this.value.on["page-change"](page);
      }
    },
    sizeChange(size) {
      this.value.page.currentPage = 1;
      this.value.page.pageSize = size;
      this.getData();
      if (this.value.on && this.value.on["size-change"]) {
        this.value.on["size-change"](size);
      }
    },
  }
}