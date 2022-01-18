
import "./styles/style.css";
import "element-ui/lib/theme-chalk/index.css";
import Element from "element-ui/lib/index";
import agelTable from "../../src/index"

export default ({ Vue }) => {
  Vue.use(Element, { size: "mini" });

  Vue.use(agelTable, {
    table: {
      border: true,
      "element-loading-text": "拼命加载中",
      "element-loading-spinner": "el-icon-loading",
      "element-loading-background": "rgba(0, 0, 0, 0.8)",
    },
    page: {
      // enable: true,
      height: 50,
      currentPage: 2,
      total: 1000,
      pageSize: 1,
      pageSizes: [1, 2, 3, 4, 5, 6],
    },
  });
};
