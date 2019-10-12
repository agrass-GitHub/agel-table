const getColumnsVnode = function(createElement, scopedSlots, columns) {
  // eslint-disable-next-line no-unused-vars
  const h = createElement;
  return columns
    .filter((v) => v.display)
    .map((v) => {
      if (v.children && v.children.length > 0) {
        return (
          <el-table-column {...{ attrs: v }} key={v.key}>
            {getColumnsVnode(createElement, scopedSlots, v.children)}
          </el-table-column>
        );
      }
      const slots = {};
      const isSlot = (name) => name && scopedSlots[name] !== undefined;
      if (isSlot(v.slotHeader)) {
        slots.header = (scoped) => scopedSlots[v.slotHeader]({ ...scoped });
      }
      if (isSlot(v.slotColumn)) {
        slots.default = (scoped) => scopedSlots[v.slotColumn]({ ...scoped });
      } else if (v.type == 'expand' && isSlot('expand')) {
        slots.default = (scoped) => scopedSlots.expand({ ...scoped });
      }
      return (
        <el-table-column {...{ attrs: v }} key={v.key} scopedSlots={slots} />
      );
    });
};

export default getColumnsVnode;
