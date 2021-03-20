
/**
 * @description columns  
 */

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

const guid = function () {
  return "xxxxxxxx".replace(/[x]/g, (c) => {
    let r = (Math.random() * 16) | 0;
    let v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};


export default {
  computed: {
    columns() {
      return this.getColumns(this.value.columns);
    },
  },
  methods: {
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
          // 针对虚拟滚动对某些列做特殊处理
          if (this.getProps("virtual")) {
            if (attrs.sortable === true) attrs.sortable = "custom-by-virtual";
            if (attrs.type === "selection") {
              const { slotHeader, slotColumn } = this.getVirtualSelectionSlot();
              attrs.slotHeader = slotHeader;
              attrs.slotColumn = slotColumn;
              attrs.type = undefined;
            }
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
  }
}