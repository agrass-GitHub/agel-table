<template>
  <el-table-column v-bind="column" :key="column._key">
    <template v-if="column.children&&column.children.length>0">
      <agel-column v-for="item in column.children" :key="item.key" :column="item"></agel-column>
    </template>

    <template v-if="column.slotHeader" v-slot:header="scope">
      {{renderSlot(column.slotHeader,scope)}}
      <slot :name="column.slotHeader"></slot>
    </template>

    <template v-if="column.slotColumn" v-slot="scope">
      {{renderSlot(column.slotColumn,scope)}}
      <slot :name="column.slotColumn"></slot>
    </template>

    <template v-else-if="column.type=='expand'" v-slot="scope">
      {{renderSlot('expand',scope)}}
      <slot name="expand"></slot>
    </template>
  </el-table-column>
</template>
 
<script>
export default {
  name: 'agel-column',
  inject: ['table'],
  props: {
    column: {
      type: Object,
      default: () => new Object()
    }
  },
  methods: {
    renderSlot(key, scope) {
      this.$slots[key] = this.table.$scopedSlots[key]({ ...scope });
    }
  }
};
</script>
 
<style >
</style>