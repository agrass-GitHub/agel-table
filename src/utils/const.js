export const loadingPropKeys = ['element-loading-text', 'element-loading-spinner', 'element-loading-background']

export const tablePropKeys = ["data", "height", "max-height", "stripe", "border", "size", "fit", "show-header", "highlight-current-row", "current-row-key", "row-class-name", "row-style", "cell-class-name", "cell-style", "header-row-class-name", "header-row-style", "header-cell-class-name", "header-cell-style", "row-key", "empty-text", "default-expand-all", "expand-row-keys", "default-sort", "tooltip-effect", "show-summary", "sum-text", "summary-method", "span-method", "select-on-indeterminate", "indent", "lazy", "load", "tree-props"].concat(loadingPropKeys);

export const tableColumnPropKeys = ["type", "index", "column-key", "label", "prop", "width", "min-width", "fixed", "render-header", "sortable", "sort-method", "sort-by", "sort-orders", "resizable", "formatter", "show-overflow-tooltip", "align", "header-align", "class-name", "label-class-name", "selectable", "reserve-selection", "filters", "filter-placement", "filter-multiple", "filter-method", "filtered-value"];

// agTable Props 
export const agTableProps = {
  loading: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
    default: () => new Array(),
  },
  columns: {
    type: Array,
    default: () => new Array(),
  },
  query: {
    type: Object,
    default: () => new Object(),
  },
  request: {
    type: Function,
  },
  page: {
    type: Object,
  },
  selection: {
    type: Array,
  }
}

export const agColumnProps = {
  label: {
    type: [String, Object, Function],
  },
  slot: {
    type: [Boolean, Object, Function],
    default: false,
  },
  display: {
    type: Boolean,
    default: true,
  },
  merge: {
    type: Boolean,
    default: false,
  },
  children: {
    type: Array,
    default: () => new Array(),
  },
};

// agTable page Props 
export const pagProps = {
  enable: {
    type: Boolean,
    default: false,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  total: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 20,
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100]
  },
  layout: {
    type: String,
    default: "total, sizes, prev, pager, next, jumper",
  },
  height: {
    type: Number,
    default: 45,
  },
}

export const mergeProps = {
  enable: {
    type: Boolean,
    default: false,
  },
  auto: {
    type: Boolean,
    default: false,
  },
  // 合并方向 可选 vertical horizontal
  direction: {
    type: String,
    default: 'vertical',
  }
}

export const resizeProps = {
  enable: {
    type: Boolean,
    default: false,
  },
  offset: {
    type: Number,
    default: false,
  },
}

// 全局 query 的 props 解析
export const queryProps = {
  pageSize: "pageSize",
  currentPage: "currentPage",
  sortProp: "sortProp",
  sortOrder: "sortOrder"
}