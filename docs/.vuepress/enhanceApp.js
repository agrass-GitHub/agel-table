
import "./styles/style.css";
import "element-ui/lib/theme-chalk/index.css";
import Element from "element-ui/lib/index";
import agelTable from "../../src/index"

export default ({ Vue }) => {
  Vue.use(Element, { size: "mini" });

  Vue.use(agelTable, {
    table: {
      border: true,
      highlightCurrentRow: true,
    },
   
  });
};
