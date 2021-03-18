export const kebabcase = (v) => v.replace(/([A-Z])/g, "-$1").toLowerCase();

export const guid = function () {
  return "xxxxxxxx".replace(/[x]/g, (c) => {
    let r = (Math.random() * 16) | 0;
    let v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};


export const tableProps = function () {
  return {
    loading: false,
    columns: [],
    selection: [],
    data: [],
    on: {},
    request: undefined,
    getData: this.getData,
    getQuery: this.getQuery,
    getRef: this.getRef,
  };
};

export const queryProps = function () {
  return {
    order: "",
    orderColumn: "",
    props: {
      currentPage: "currentPage",
      pageSize: "pageSize",
      order: "order",
      orderColumn: "orderColumn",
    },
    formatter: (query) => query,
  };
};

export const pageProps = function () {
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

export const columnProps = function () {
  return {
    key: guid(),
    display: true,
    merge: undefined,
    slotColumn: undefined,
    slotHeader: undefined,
    children: undefined,
  };
};

export const defaultProps = [
  "data",
  "height",
  "max-height",
  "stripe",
  "border",
  "size",
  "fit",
  "show-header",
  "highlight-current-row",
  "current-row-key",
  "row-class-name",
  "row-style",
  "cell-class-name",
  "cell-style",
  "header-row-class-name",
  "header-row-style",
  "header-cell-class-name",
  "header-cell-style",
  "row-key",
  "empty-text",
  "default-expand-all",
  "expand-row-keys",
  "default-sort",
  "tooltip-effect",
  "show-summary",
  "sum-text",
  "summary-method",
  "span-method",
  "select-on-indeterminate",
  "indent",
  "lazy",
  "load",
  "tree-props",
];
