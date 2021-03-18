/**
 * @description page
 */

import { pageProps } from "./props";

export default {
  created() {
    const page = Object.assign(
      pageProps(),
      this.$agelTableConfig.page || {},
      this.value.page || {}
    );
    if (page.enable) this.$set(this.value, "page", page);
  },
  methods: {
    pageChange(page) {
      this.value.page.currentPage = page;
      this.value.getData();
      if (this.value.on && this.value.on["page-change"]) {
        this.value.on["page-change"](page);
      }
    },
    sizeChange(size) {
      this.value.page.currentPage = 1;
      this.value.page.pageSize = size;
      this.value.getData();
      if (this.value.on && this.value.on["size-change"]) {
        this.value.on["size-change"](size);
      }
    },
  }
}