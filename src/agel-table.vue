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
    <el-pagination v-if="value.page && value.page.enable" ref="page" v-bind="value.page" :style="{height:styles.pageHeight}" v-on="events">
    </el-pagination>

  </div>
</template>
 
<script>
import mergeCell from "./merge-cell";
import virtualScroll from "./virtual-scroll";
import resizeTable from "./resize-table";

import {
  kebabcase,
  guid,
  defaultProps,
  tableProps,
  columnProps,
  queryProps,
  pageProps,
} from "./props";

export default {
  name: "agel-table",
  inheritAttrs: false,
  mixins: [resizeTable, mergeCell, virtualScroll],
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
    data() {
      return this.getProps("virtual")
        ? this.value.virtual.data
        : this.value.data;
    },
    columns() {
      return this.getColumns(this.value.columns);
    },
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
        this.value.query.order = order;
        this.value.query.orderColumn = prop;
        this.setQuery("orderColumn", prop);
        this.setQuery("order", order);
        if (column.sortable == "custom-by-virtual") {
          this.getVirtualSortData();
        } else {
          this.value.getData();
        }
      }
      if (this.value.on && this.value.on["sort-change"]) {
        this.value.on["sort-change"]({ column, prop, order });
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
    pageChange(page) {
      this.value.page.currentPage = page;
      this.setQuery("currentPage", this.value.page.currentPage);
      this.value.getData();
      if (this.value.on && this.value.on["page-change"]) {
        this.value.on["page-change"](page);
      }
    },
    sizeChange(size) {
      this.value.page.currentPage = 1;
      this.value.page.pageSize = size;
      this.setQuery("currentPage", this.value.page.currentPage);
      this.setQuery("pageSize", this.value.page.pageSize);
      this.value.getData();
      if (this.value.on && this.value.on["size-change"]) {
        this.value.on["size-change"](size);
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
          let config = this.$agelTableConfig.column || {};
          let attrs = Object.assign(columnProps(), config, v);
          if (this.getProps("virtual") && attrs.sortable === true) {
            attrs.sortable = "custom-by-virtual";
          }
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
        return h("el-table-column", {
          props: attrs,
          key: v.key,
          scopedSlots: this.getColumnSlots([
            ["header", v.slotHeader, true],
            ["default", v.slotColumn, true],
            ["default", v.slotExpand || "expand", v.type == "expand"],
          ]),
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
    // table
    const table = Object.assign(
      tableProps.call(this),
      this.$agelTableConfig.table || {},
      this.value
    );
    Object.keys(table).forEach((key) => {
      table[key] != undefined && this.$set(this.value, key, table[key]);
    });

    // queryProps
    const queryPropsFormat = Object.assign(
      queryProps(),
      this.$agelTableConfig.queryProps || {},
      this.value.queryProps || {}
    );
    this.$set(this.value, "queryProps", queryPropsFormat);
    this.setQuery("orderColumn", "");
    this.setQuery("order", "");

    // page
    const page = Object.assign(
      pageProps(),
      this.$agelTableConfig.page || {},
      this.value.page || {}
    );
    if (this.value.page || this.$agelTableConfig.page) {
      this.$set(this.value, "page", page);
      this.setQuery("currentPage", this.value.page.currentPage);
      this.setQuery("pageSize", this.value.page.pageSize);
    }
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
