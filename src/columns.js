
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
    getColumns(columnsObj) {
      let columns = columnsObj;
      if (!Array.isArray(columnsObj)) {
        columns = Object.keys(columnsObj).map((k) => {
          let v = columnsObj[k];
          if (v.prop == undefined) this.$set(v, "prop", k);
          return v;
        });
      }
      return columns
        .map((v) => {
          let config = this.$agelTableConfig;
          let attrs = Object.assign(columnProps(), config.column || {}, v);
          this.handleVirtualScrollColumn(attrs);
          if (attrs.children) {
            attrs.children = this.getColumns(attrs.children);
            if (attrs.children.length == 0) attrs.key = guid();
          }
          return attrs;
        })
        .filter((v) => v.display);
    },
    getColumnScopedSlots(slots) {
      const scopedSlots = {};
      slots.forEach((v) => {
        let { 0: name, 1: slot, 2: condition } = v;
        if (slot && condition) {
          if (typeof slot === "function") {
            scopedSlots[name] = (scoped) => slot(this.$createElement, scoped);
          } else if (typeof slot === "string") {
            scopedSlots[name] = (scoped) => this.$scopedSlots[slot]({ ...scoped });
          }
        }
      });
      return scopedSlots;
    },
    getColumnsSlot(columns) {
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
            this.getColumnsSlot(v.children)
          );
        }
        return h("el-table-column", {
          props: attrs,
          key: v.key,
          scopedSlots: this.getColumnScopedSlots([
            ["header", v.slotHeader, true],
            ["default", v.slotColumn, true],
            ["default", v.slotExpand || "expand", v.type == "expand"],
          ]),
        });
      });
    },
    renderColumns() {
      this.$slots.columns = this.getColumnsSlot(this.columns || []);
      this.$nextTick(() => {
        this.$refs.table && this.$refs.table.doLayout();
      });
    },
  }
}