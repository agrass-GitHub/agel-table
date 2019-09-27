<template>
  <el-table-column v-bind="column">
    <!-- slot  children  -->
    <template v-if="column.children&&column.children.length>0">
      <agel-column v-for="(item, index) in column.children" :key="index" :column="item"></agel-column>
    </template>

    <!-- slot header -->
    <template v-slot:header="scope">
      <slot v-if="column.slotHeader" :name="column.prop+'Header'" :scope="scope"></slot>
      <span v-else>{{column.label}}</span>
    </template>

    <!-- slot  column  -->
    <template v-if="column.type===undefined" v-slot="scope">
      <slot v-if="column.slot" :name="column.prop" :scope="scope"></slot>
      <template v-else>{{scope.row[column.prop]}}</template>
    </template>

    <!-- slot expand need v-eles-if -->
    <template v-else-if="column.type==='expand'" v-slot="scope">
      <slot name="expand" :scope="scope"></slot>
    </template>
  </el-table-column>
</template>
 
<script>
export default {
  name: 'agel-column',
  props: {
    column: {
      type: Object,
      default: () => new Object()
    }
  },
  data() {
    return {};
  },
  watch: {},
  mounted() {}
};
</script>
 
<style >
</style>