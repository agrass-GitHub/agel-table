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
import virtualScroll from "./virtual-scroll";
import mergeCell from "./merge-cell";
import page from "./page";
import base from "./base";
import columns from "./columns";

export const kebabcase = (v) => v.replace(/([A-Z])/g, "-$1").toLowerCase();

export default {
  install(vue, opts = {}) {
    vue.prototype.$agelTableConfig = opts;
    vue.component(opts.name || this.name, this);
  },
  name: "agel-table",
  mixins: [base, columns, page, virtualScroll, mergeCell],
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
  data() {
    return {
      interceptEvent: {},
      extendKeys: new Set([]),
    };
  },
  computed: {
    styles() {
      let { height, page = {} } = this.value;
      return {
        containerHeight: height,
        pageHeight: page.height + "px",
        tableHeight: height
          ? page.enable
            ? `calc(100% - ${page.height}px)`
            : "100%"
          : height,
      };
    },
    // 过滤出扩展 api 以外的属性
    attrs() {
      let attrs = {};
      let extendKeys = Array.from(this.extendKeys);
      for (const key in this.value) {
        if (!extendKeys.includes(key)) attrs[key] = this.value[key];
      }
      return attrs;
    },
    // 事件代理层
    events() {
      let events = {};
      let a = this.interceptEvent;
      let b = this.value.on;
      for (let key in { ...a, ...b }) {
        // 事件拦截，在提交event之前可以做点什么...
        events[kebabcase(key)] = (...p) => {
          let cusotmKey = key;
          if (a[key]) cusotmKey = a[key](...p) || key;
          if (b[cusotmKey]) b[cusotmKey](...p);
        };
      }
      return events;
    },
    data() {
      return this.value.virtual.enable
        ? this.value.virtual.data
        : this.value.data;
    },
  },
  watch: {
    // 实时同步到 value，解决 value 不能为计算属性的弊端
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
