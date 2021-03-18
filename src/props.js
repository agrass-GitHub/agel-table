/**
 * @description props api参数
 */


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
    columns: [],
    data: [],
    selection: [],
    loading: false,
    on: undefined,
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

export const virtualProps = function () {
  return {
    // 是否开启
    enable: false,
    // 行高度
    rowHeight: 0,
    // 总高度
    totalHeight: 0,
    // 渲染区域高度
    renderHeight: 0,
    // 开始渲染位置
    indexStart: 0,
    // 结束渲染位置
    indexEnd: 0,
    // 可视区域渲染数量
    renderNum: 0,
    // 渲染数量偏移量
    offsetNum: 10,
    // 容器
    warppers: [],
    // 动态渲染数据      
    data: [],
  }
}

export const mergeProps = function () {
  return {
    // 是否开启
    enable: false,
    // 是否自动合并
    auto: false,
    // 合并方向
    direction: "vertical"
  }
}

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
