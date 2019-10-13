<template>
  <div
    v-if="LOAD"
    v-loading="value.loading"
    :style="{'height':value.height?value.height+'px':'auto'}"
    ref="container"
    class="agel-table"
  >
    <!-- el-table -->
    <el-table v-bind="attrs" v-on="events" ref="table" style="width:100%">
      <!-- append  -->
      <template v-slot:append>
        <slot name="append"></slot>
      </template>

      <!-- empty  -->
      <template v-slot:empty>
        <slot name="empty"></slot>
      </template>

      <!-- columns  -->
      <template v-slot:default>
        {{renderColumns()}}
        <slot name="columns"></slot>
      </template>
    </el-table>

    <!-- el-pagination -->
    <el-pagination ref="page" v-if="value.isPage" v-bind="value.page" v-on="events"></el-pagination>
  </div>
</template>
 
<script>
import { guid, kebabcase } from './tool';
import getApi from './api';
import getColumnsVnode from './columns-vnode';
export default {
  name: 'agel-table',
  install(vue, opts = {}) {
    vue.prototype.$agelTableConfig = opts;
    vue.component(opts.name || this.name, this);
  },
  provide() {
    return {
      table: this
    };
  },
  components: {},
  props: {
    value: {
      required: true,
      type: Object
    },
    attach: {
      type: Object
    }
  },
  data() {
    return {
      pageHeight: 0,
      LOAD: false
    };
  },
  computed: {
    attrs() {
      if (!this.LOAD) return {};
      let attrs = {};
      let extend = this.getApi().extendApi;
      for (const key in this.value) {
        if (!extend.hasOwnProperty(key)) attrs[key] = this.value[key];
      }
      if (attrs.height && this.value.isPage) {
        let proxyH = Number(attrs.height) - this.pageHeight;
        attrs.height = proxyH < 0 ? 0 : proxyH;
      }
      return attrs;
    },
    events() {
      if (!this.LOAD) return {};
      let events = {};
      let { eventsApi: a, localEventsApi: b } = this.getApi();
      for (let key in { ...a, ...b }) {
        // 事件拦截，在提交event之前可以做点什么...
        events[kebabcase(key)] = (...params) => {
          let customKey = key;
          if (a[key]) customKey = a[key](...params);
          if (b[customKey]) b[customKey](...params);
        };
      }
      return events;
    }
  },
  watch: {
    attach: {
      deep: true,
      handler(v) {
        this.$emit('input', { ...this.value, ...v });
      }
    },
    'value.isResize': 'registerResize'
  },
  created() {
    this.value && this.initApi();
  },
  beforeDestroy() {
    this.registerResize(false);
  },
  methods: {
    getApi: getApi,
    initApi() {
      let api = this.getApi();
      let table = {
        ...api.defaultApi,
        ...api.extendApi,
        ...api.globalApi,
        ...api.localApi,
        columns: this.getColumns(api.localApi.columns, api.globalColumnApi),
        page: {
          ...api.pageApi,
          ...api.globalPageApi,
          ...api.localPageApi
        },
        ...api.attachApi
      };
      this.$emit('input', table);
      this.$nextTick(() => {
        this.LOAD = true;
        this.$nextTick(() => {
          this.value.$ref = this.$refs.table;
          this.pageHeight = this.$refs.page.$el.clientHeight;
          this.registerResize();
        });
      });
    },
    getColumns(columns = [], globalColumnApi) {
      return columns.map(v => {
        const o = {
          ...globalColumnApi,
          ...v,
          key: v.key == undefined ? guid() : v.key,
          display: v.display === undefined ? true : v.display
        };
        if (v.children && v.children.length > 0) {
          v.children = this.getColumns(v.children, globalColumnApi);
        }
        return o;
      });
    },
    renderColumns() {
      if (this.value.columns.length == 0) return;
      this.$slots.columns = getColumnsVnode(
        this.$createElement,
        this.$scopedSlots,
        this.value.columns
      );
      this.$nextTick(() => {
        this.$refs.table.doLayout();
      });
    },
    registerResize(isResize = this.value.isResize) {
      if (isResize) {
        this.value.resize();
        window.addEventListener('resize', this.value.resize);
      } else {
        window.removeEventListener('resize', this.value.resize);
      }
    }
  }
};
</script>
 
<style >
.agel-table {
  width: 100%;
  height: auto;
  overflow: hidden;
}
.agel-table .agel-pagination {
  overflow: hidden;
  padding: 10px;
}
.agel-table .el-table__empty-text {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>