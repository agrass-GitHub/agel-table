
/**
 * @description agel-table 基础 mixin
 */

// el-table 默认 props，只有数组里的 key 可以传递到 el-table, 如若组件更新未及时写到的可通过 $agelTableConfig.attributes 进行传递
const defaultProps = ["data", "height", "max-height", "stripe", "border", "size", "fit", "show-header", "highlight-current-row", "current-row-key", "row-class-name", "row-style", "cell-class-name", "cell-style", "header-row-class-name", "header-row-style", "header-cell-class-name", "header-cell-style", "row-key", "empty-text", "default-expand-all", "expand-row-keys", "default-sort", "tooltip-effect", "show-summary", "sum-text", "summary-method", "span-method", "select-on-indeterminate", "indent", "lazy", "load", "tree-props",];

// table 扩展属性
const tableProps = function () {
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

// query 默认存在四个基本查询属性，可设置成你项目中所需要的 table queryProps，
const queryProps = function () {
  return {
    pageSize: (v) => ["pageSize", v],
    currentPage: (v) => ["currentPage", v],
    orderColumn: (v) => ["orderColumn", v],
    order: (v) => ["order", v],
  };
}

const kebabcase = (v) => v.replace(/([A-Z])/g, "-$1").toLowerCase();


export default {
  created() {
    let config = this.$agelTableConfig || {};
    // table
    const table = Object.assign(tableProps.call(this), config.table || {}, this.value);
    Object.keys(table).forEach((key) => {
      table[key] != undefined && this.$set(this.value, key, table[key]);
    });

    // queryProps
    const queryPropsFormat = Object.assign(queryProps(), config.queryProps || {}, this.value.queryProps || {});
    this.$set(this.value, "queryProps", queryPropsFormat);
    this.setQuery("orderColumn", "");
    this.setQuery("order", "");

    // page
    const page = Object.assign(pageProps(), config.page || {}, this.value.page || {});
    if (this.value.page || this.$agelTableConfig.page) {
      this.$set(this.value, "page", page);
      this.setQuery("currentPage", page.page);
      this.setQuery("pageSize", page.pageSize);
    }
  },
  computed: {
    data() {
      return this.getProps("virtual")
        ? this.value.virtual.data
        : this.value.data;
    },
    attrs() {
      let attrs = {};
      const tableAttrs = defaultProps.concat(
        this.$agelTableConfig.attributes || []
      );
      for (const key in this.value) {
        if (tableAttrs.includes(key) || tableAttrs.includes(kebabcase(key))) {
          attrs[key] = this.value[key];
        }
      }
      return attrs;
    },
    styles() {
      let { height, page = {} } = this.value;
      return {
        containerHeight: isNaN(height) ? height : height + "px",
        pageHeight: (page.height || 0) + "px",
        tableHeight: height
          ? page.enable
            ? `calc(100% - ${page.height}px)`
            : "100%"
          : height,
      };
    },
    events() {
      let events = {
        "current-change": this.currentChange,
        "sort-change": this.sortChange,
        "size-change": this.sizeChange,
        "selection-change": this.selectionChange,
      };
      for (let key in this.value.on || {}) {
        if (!events[kebabcase(key)]) {
          events[kebabcase(key)] = this.value.on[key];
        }
      }
      return events;
    },
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
    selectionChange(selection) {
      this.value.selection = selection;
      if (this.value.on && this.value.on["selection-change"]) {
        this.value.on["selection-change"](selection);
      }
    },
    sortChange({ column, prop, order }) {
      if (typeof column.sortable == "string") {
        this.setQuery("orderColumn", prop);
        this.setQuery("order", order);
        if (column.sortable == "custom-by-virtual") {
          this.setVirtualSortData();
        } else {
          this.getData();
        }
      }
      if (this.value.on && this.value.on["sort-change"]) {
        this.value.on["sort-change"]({ column, prop, order });
      }
    },
    pageChange(page) {
      this.value.page.currentPage = page;
      this.$nextTick(this.getData);
      if (this.value.on && this.value.on["page-change"]) {
        this.value.on["page-change"](page);
      }
    },
    sizeChange(size) {
      this.value.page.currentPage = 1;
      this.value.page.pageSize = size;
      this.$nextTick(this.getData);
      if (this.value.on && this.value.on["size-change"]) {
        this.value.on["size-change"](size);
      }
    },
    currentChange(...params) {
      // emit page pageChange event
      if (params.length === 1) this.pageChange(params[0]);
      // emit table currentChange event
      if (params.length === 2) {
        if (this.value.on && this.value.on["current-change"]) {
          this.value.on["current-change"](...params);
        }
      }
    },
    setQuery(key, value) {
      let props = this.value.queryProps;
      if (!props[key]) return;
      if (typeof props[key] === "string") {
        this.$set(this.value.query, props[key], value);
      }
      if (typeof props[key] === "function") {
        let [newkey, newValue] = props[key](value);
        this.$set(this.value.query, newkey, newValue);
      }
    },
    getData() {
      let request = this.value.request;
      if (!request || typeof request != "function") return;
      this.value.loading = true;
      return new Promise((resolve, reject) => {
        return request(this.value.query, resolve, reject);
      })
        .then((res) => {
          let { data, total } = Array.isArray(res)
            ? { data: res, total: res.length }
            : res;
          this.value.loading = false;
          this.value.data = data;
          if (this.getProps("page")) this.value.page.total = total;
        })
        .catch(() => {
          this.value.loading = false;
        });
    },
    getRef(name = "table") {
      return this.$refs[name];
    },
    getProps(name) {
      return this.value[name] && this.value[name].enable
        ? this.value[name]
        : false;
    },
  }
};

