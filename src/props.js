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


/**
 * @description table 扩展属性方法
 */
export const tableProps = function () {
  return {
    loading: false,
    data: [],
    columns: [],
    selection: [],
    on: undefined,
    query: {},
    request: undefined,
    getData: this.getData,
    getRef: this.getRef,
  };
};


/**
 * @description query 默认存在四个基本查询属性，可设置成你项目中所需要的 table queryProps，
 */
export const queryProps = function () {
  return {
    pageSize: (v) => ["pageSize", v],
    currentPage: (v) => ["currentPage", v],
    orderColumn: (v) => ["orderColumn", v],
    order: (v) => ["order", v],
  };
}


/**
 * @description 分页 扩展 props 
 */
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


/**
 * @description column 扩展 props 
 */
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


/**
 * @description 虚拟滚动功能 扩展 props
 */
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
    // 排序数据
    sortData: [],
  }
}

/**
 * @description 合并功能 扩展 props
 */
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


/**
 * @description 自适应功能 扩展 props
 */
export const resizeProps = function () {
  return {
    // 是否开启
    enable: false,
    // 偏移位置
    offset: 0,
  }
}

/**
 * @description el-table 默认 props，只有数组里的 key 可以传递到 el-table
 */
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
