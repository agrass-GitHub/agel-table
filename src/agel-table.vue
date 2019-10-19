<template>
  <div
    ref="container"
    v-if="LOAD"
    v-loading="value.loading"
    :style="styles.container"
    class="agel-table"
  >
    <!-- el-table -->
    <el-table ref="table" v-bind="attrs" v-on="events" style="width:100%">
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
    <el-pagination
      ref="page"
      v-if="value.isPage"
      v-bind="value.page"
      v-on="events"
      :style="styles.page"
    ></el-pagination>
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
  props: {
    value: {
      required: true,
      type: Object,
      default: () => new Object()
    },
    attach: {
      type: Object,
      default: () => new Object()
    }
  },
  data() {
    return {
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
        let proxyH = Number(attrs.height) - this.value.page.height;
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
          let customKey;
          if (a[key]) customKey = a[key](...params) || key;
          if (b[customKey]) b[customKey](...params);
        };
      }
      return events;
    },
    columns() {
      let api = this.getApi();
      return this.getColumns(api.localApi.columns, api.globalColumnApi);
    },
    styles() {
      let { height, page } = this.value;
      return {
        container: { height: height ? height + 'px' : 'auto' },
        page: { height: page.height ? page.height + 'px' : 'auto' }
      };
    }
  },
  watch: {
    attach: {
      deep: true,
      handler: 'initApi'
    },
    'value.isResize': 'registerResize'
  },
  mounted() {
    this.initApi();
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
        page: {
          ...api.pageApi,
          ...api.globalPageApi,
          ...api.localPageApi
        }
      };
      this.$emit('input', table);
      if (this.LOAD) return;
      this.$nextTick(() => {
        this.LOAD = true;
        table.immediate && table.getData();
        this.$nextTick(() => {
          this.value.$ref = this.$refs.table;
          this.registerResize();
        });
      });
    },
    getColumns(columns = [], globalColumnApi) {
      return columns
        .map(v => {
          let o = {};
          if (v.children && v.children.length > 0) {
            o.children = this.getColumns(v.children, globalColumnApi);
            if (o.children.length == 0) v.key = guid();
          }
          v.key = v.key == undefined ? guid() : v.key;
          v.display = v.display === undefined ? true : v.display;
          return { ...globalColumnApi, ...v, ...o };
        })
        .filter(v => v.display);
    },
    renderColumns() {
      let columns = this.columns;
      if (!columns || columns.length === 0) return;
      this.$slots.columns = getColumnsVnode.call(this, columns);
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
 
<style lang="stylus" >
.agel-table {
  width: 100%;
  height: auto;
  overflow: hidden;
}

.agel-pagination {
  display: flex;
  align-items: center;
  padding: 0px 10px;
}

.agel-table .el-table__empty-text {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
