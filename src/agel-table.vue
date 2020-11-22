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
    <el-pagination v-if="value.page.enable" ref="page" v-bind="value.page" v-on="events" :style="{height:styles.pageHeight}"></el-pagination>
  </div>
</template>
 
<script>
import core from "./core";
import columns from "./columns";
import query from "./query";
import mergeCell from "./merge-cell";
import virtualScroll from "./virtual-scroll";

export default {
  name: "agel-table",
  mixins: [core, columns, query, mergeCell, virtualScroll],
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
  install(vue, opts = {}) {
    vue.prototype.$agelTableConfig = opts;
    vue.component(opts.name || this.name, this);
  },
  data() {
    return {
      interceptEvent: {},
      extendKeys: new Set([]),
    };
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
  methods: {
    extendApi(key, value, add = true) {
      add && this.extendKeys.add(key);
      this.$set(this.value, key, value);
    },
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
