<template>
  <div ref="container" v-loading="value.loading" class="agel-table" :style="{height:styles.containerHeight}">
    <!-- el-table -->
    <el-table ref="table" v-bind="attrs" :data="data" :height="styles.tableHeight" v-on="events" style="width:100%">
      <!-- append  -->
      <template v-slot:append>
        <slot name="append" />
      </template>

      <!-- empty  -->
      <template v-slot:empty>
        <slot name="empty" />
      </template>

      <!-- columns  -->
      <template v-slot:default>
        {{renderColumns()}}
        <slot name="columns" />
      </template>
    </el-table>

    <!-- el-pagination -->
    <el-pagination v-if="value.page.enable" ref="page" v-bind="value.page" :style="{height:styles.pageHeight}" v-on="events"></el-pagination>

  </div>
</template>
 
<script>
import mergeCell from "./merge-cell";
import virtualScroll from "./virtual-scroll";

const kebabcase = (v) => v.replace(/([A-Z])/g, "-$1").toLowerCase();

const guid = function () {
  return "xxxxxxxx".replace(/[x]/g, (c) => {
    let r = (Math.random() * 16) | 0;
    let v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const defaultProps = [
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

const tableProps = function () {
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

const queryProps = function () {
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

const columnProps = function () {
  return {
    key: guid(),
    display: true,
    merge: undefined,
    slotColumn: undefined,
    slotHeader: undefined,
    children: undefined,
  };
};

export default {
  name: "agel-table",
  inheritAttrs: false,
  mixins: [mergeCell, virtualScroll],
  props: {
    value: {
      required: true,
      type: Object,
      default: () => new Object(),
    },
    attach: {
      type: Object,
      default: () => new Object(),
    },
  },
  watch: {
    attach: {
      deep: true,
      immediate: true,
      handler: function () {
        for (let key in this.attach) {
          if (this.attach[key] !== undefined) {
            this.$set(this.value, key, this.attach[key]);
          }
        }
      },
    },
  },
  computed: {
    styles() {
      let { height, page = {} } = this.value;
      return {
        containerHeight: isNaN(height) ? height : height + "px",
        pageHeight: page.height + "px",
        tableHeight: height
          ? page.enable
            ? `calc(100% - ${page.height}px)`
            : "100%"
          : height,
      };
    },
    attrs() {
      let attrs = {};
      for (const key in this.value) {
        if (
          defaultProps.includes(key) ||
          defaultProps.includes(kebabcase(key))
        ) {
          attrs[key] = this.value[key];
        }
      }
      return attrs;
    },
    events() {
      let events = {
        "current-change": this.currentChange,
        "sort-change": this.sortChange,
        "size-change": this.sizeChange,
      };
      for (let key in this.value.on) {
        if (!events[kebabcase(key)]) {
          events[kebabcase(key)] = this.value.on[key];
        }
      }
      return events;
    },
    data() {
      return this.value.virtual.enable
        ? this.value.virtual.data
        : this.value.data;
    },
    columns() {
      return this.getColumns(this.value.columns);
    },
  },
  methods: {
    sortChange({ column, prop, order }) {
      if (column.sortable !== "custom") return;
      this.value.query.order = order;
      this.value.query.orderColumn = prop;
      this.value.getData();
      if (this.value.on["sort-change"]) {
        this.value.on["sort-change"]({ column, prop, order });
      }
    },
    currentChange(...params) {
      // emit page pageChange event
      if (params.length === 1) {
        this.value.page.currentPage = params[0];
        this.value.getData();
        if (this.value.on["page-change"]) {
          this.value.on["page-change"](...params);
        }
      }
      // emit table currentChange event
      if (params.length === 2) {
        if (this.value.on["current-change"]) {
          this.value.on["current-change"](...params);
        }
      }
    },
    sizeChange(size) {
      this.value.page.currentPage = 1;
      this.value.page.pageSize = size;
      this.value.getData();
      if (this.value.on["size-change"]) {
        this.value.on["size-change"](size);
      }
    },
    getQuery() {
      let { props, formatter, ...queryObj } = this.value.query;
      let { order, orderColumn, ...otherQuery } = queryObj;
      return formatter({
        [props.currentPage]: this.value.page.currentPage,
        [props.pageSize]: this.value.page.pageSize,
        [props.order]: order,
        [props.orderColumn]: orderColumn,
        ...otherQuery,
      });
    },
    getData() {
      let request = this.value.request;
      if (typeof request != "function") {
        console.error("缺少 request 参数");
        return;
      }
      this.value.loading = true;
      return new Promise((resolve, reject) => {
        return request(this.getQuery(), resolve, reject);
      })
        .then((res) => {
          let { data, total } = Array.isArray(res)
            ? { data: res, total: res.length }
            : res;
          this.value.loading = false;
          this.value.data = data;
          this.value.page.total = total;
        })
        .catch(() => {
          this.value.loading = false;
        });
    },
    getRef(name = "table") {
      return this.$refs[name];
    },
    getColumns(columns) {
      let config = columns;
      if (!Array.isArray(config)) {
        config = Object.keys(columns).map((k) => {
          let v = columns[k];
          if (v.prop == undefined) this.$set(v, "prop", k);
          return v;
        });
      }
      return config
        .map((v) => {
          let attrs = Object.assign(
            columnProps(),
            this.$agelTableConfig.column || {},
            v
          );
          if (attrs.children) {
            attrs.children = this.getColumns(attrs.children);
            if (attrs.children.length == 0) attrs.key = guid();
          }
          return attrs;
        })
        .filter((v) => v.display);
    },
    getColumnSlots(slots) {
      const o = {};
      const table = this.$scopedSlots;
      slots.forEach((v) => {
        let { 0: name, 1: slot, 2: condition } = v;
        if (!condition || !slot) return;
        if (typeof slot === "function") {
          o[name] = (scoped) => slot(this.$createElement, scoped);
        } else if (typeof slot === "string") {
          o[name] = (scoped) => table[slot]({ ...scoped });
        }
      });
      return o;
    },
    getColumnsVnode(columns) {
      let extendKeys = Object.keys(columnProps());
      const h = this.$createElement;
      return columns.map((v) => {
        let attrs = {};
        for (const key in v) {
          if (!extendKeys.includes(key)) attrs[key] = v[key];
        }
        if (v.children && v.children.length > 0) {
          return h(
            "el-table-column",
            { props: attrs, key: v.key },
            this.getColumnsVnode(v.children)
          );
        }
        const slots = this.getColumnSlots([
          ["header", v.slotHeader, true],
          ["default", v.slotColumn, true],
          ["default", v.slotExpand || "expand", v.type == "expand"],
        ]);
        return h("el-table-column", {
          props: attrs,
          key: v.key,
          scopedSlots: slots,
        });
      });
    },
    renderColumns() {
      this.$slots.columns = this.getColumnsVnode(this.columns || []);
      this.$nextTick(() => {
        this.$refs.table && this.$refs.table.doLayout();
      });
    },
  },
  created() {
    const table = Object.assign(
      tableProps.call(this),
      this.$agelTableConfig.table || {},
      this.value
    );
    const page = Object.assign(
      pageProps(),
      this.$agelTableConfig.page || {},
      this.value.page || {}
    );
    const query = Object.assign(
      queryProps(),
      this.$agelTableConfig.query || {},
      this.value.query || {}
    );
    Object.keys(table).forEach((key) => this.$set(this.value, key, table[key]));
    this.$set(this.value, "page", page);
    this.$set(this.value, "query", query);
  },
  install(vue, opts = {}) {
    vue.prototype.$agelTableConfig = opts;
    vue.component(opts.name || this.name, this);
  },
};
</script>
 
<style lang="stylus" >
.agel-table {
  width: 100%;
  height: auto;
  overflow: hidden;
}

.agel-pagination {
  display: flex;
  align-items: center;
  padding: 0px 0px;
  justify-content: flex-end;
}

.agel-table .el-table__empty-text {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
