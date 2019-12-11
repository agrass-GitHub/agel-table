const getColumnSlots = function(slots) {
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
};

const getColumnsVnode = function(columns) {
  // eslint-disable-next-line no-unused-vars
  const h = this.$createElement;
  return columns.map((v) => {
    if (v.children && v.children.length > 0) {
      return (
        <el-table-column {...{ attrs: v }} key={v.key}>
          {getColumnsVnode.call(this, v.children)}
        </el-table-column>
      );
    }
    const slots = getColumnSlots.call(this, [
      ['header', v.slotHeader],
      ['default', v.slotColumn],
      ['default', v.slotExpand || 'expand', v.type == 'expand']
    ]);
    return (
      <el-table-column {...{ attrs: v }} key={v.key} scopedSlots={slots} />
    );
  });
};

export default getColumnsVnode;
