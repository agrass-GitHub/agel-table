const props = function () {
  return {
    enable: true,
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
    let api = Object.assign(props(), this.$agelTableConfig.page || {}, this.value.page || {},);
    this.extendApi('page', api);
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
      if (params.length === 2) return "currentChange";
      // emit page pageChange event
      if (params.length === 1) {
        this.value.page.currentPage = params[0];
        this.value.getData();
        return "pageChange";
      }
    }
  }
}