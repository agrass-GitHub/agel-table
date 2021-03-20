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
import basis from "./basis";
import columns from "./columns";
import page from "./page";
import virtualScroll from "./virtual-scroll";
import mergeCell from "./merge-cell";
import resizeTable from "./resize-table";

export default {
  name: "agel-table",
  inheritAttrs: false,
  mixins: [basis, columns, page, virtualScroll, mergeCell, resizeTable],
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

.agel-table .el-table__empty-text {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.agel-table .virtual-scroll-checkbox {
  .el-checkbox__inner {
    transition: none;
  }

  .el-checkbox__inner::after {
    transition: none;
  }
}

.agel-pagination {
  display: flex;
  align-items: center;
  padding: 0px 0px;
  justify-content: flex-end;
}
</style>
