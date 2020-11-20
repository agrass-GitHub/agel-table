
const props = function () {
  return {
    // 是否显示
    display: true,
    // 唯一id
    key: guid(),
  }
}

function guid() {
  return 'xxxxxxxx'.replace(/[x]/g, (c) => {
    let r = (Math.random() * 16) | 0;
    let v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

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
          let attrs = Object.assign(props(), this.$agelTableConfig.column || {}, v);
          if (attrs.children) {
            attrs.children = this.getColumns(attrs.children);
            if (attrs.children.length == 0) attrs.key = guid();
          }
          return attrs
        })
        .filter((v) => v.display);
    },
    getColumnSlots(slots) {
      const o = {};
      const table = this.$scopedSlots;
      slots.forEach((v) => {
        let { 0: name, 1: slot, 2: condition } = v;
        if (condition === false) return;
        if (typeof slot === 'function') {
          o[name] = (scoped) => slot(this.$createElement, scoped);
        } else if (typeof slot === 'string' && table[slot] !== undefined) {
          o[name] = (scoped) => table[slot]({ ...scoped });
        }
      });
      return o;
    },
    getColumnsVnode(columns) {
      return columns.map((v) => {
        if (v.children && v.children.length > 0) {
          return (
            <el-table-column {...{ attrs: v }} key={v.key}>
              {this.getColumnsVnode(v.children)}
            </el-table-column>
          );
        }
        const slots = this.getColumnSlots([
          ['header', v.slotHeader],
          ['default', v.slotColumn],
          ['default', v.slotExpand || 'expand', v.type == 'expand']
        ]);
        return (
          <el-table-column {...{ attrs: v }} key={v.key} scopedSlots={slots} />
        );
      });
    },
    renderColumns() {
      let columns = this.columns;
      if (!columns || columns.length === 0) return;
      this.$slots.columns = this.getColumnsVnode(columns);
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    },
  }
}