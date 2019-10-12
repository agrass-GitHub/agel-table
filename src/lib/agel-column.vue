<template>
  <el-table-column v-bind="column">
    <!-- slotHeader -->
    <template v-if="isSlot(column.slotHeader)" v-slot:header="scope">
      {{renderSlot(column.slotHeader,scope)}}
      <slot :name="column.slotHeader"></slot>
    </template>

    <!-- slotColumn -->
    <template v-if="isSlot(column.slotColumn)" v-slot="scope">
      {{renderSlot(column.slotColumn,scope)}}
      <slot :name="column.slotColumn"></slot>
    </template>

    <!-- expand need v-else -->
    <template v-else-if="isSlot(column.type)&&column.type=='expand'" v-slot="scope">
      {{renderSlot('expand',scope)}}
      <slot name="expand"></slot>
    </template>

    <!-- children -->
    <template v-if="column.children&&column.children.length>0">
      <agel-column v-for="item in column.children" :key="item.key" :column="item"></agel-column>
    </template>
  </el-table-column>
</template>
 
<script>
/**
 * 该组件被 agel-column-vnode jsx 代替, 不再使用
 * 解决多级表头在动态显隐列功能下的显示异常的问题
 */
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
    isSlot(slotName) {
      return slotName && this.table.$scopedSlots[slotName];
    },
    renderSlot(slotName, scope) {
      this.$slots[slotName] = this.table.$scopedSlots[slotName]({ ...scope });
    }
  }
};
</script>
 
<style >
</style>