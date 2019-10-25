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
      API: {},
      LOAD: false
    };
  },
  computed: {
    styles() {
      return this.getStyles();
    },
    attrs() {
      return this.getAttrs();
    },
    events() {
      return this.getEvents();
    },
    columns() {
      return this.getColumns(this.value.columns);
    },
    flatColumns() {
      return this.getFlatColumns(this.columns);
    },
    mergeKeys() {
      return this.getMergeKeys(this.flatColumns);
    },
    mergeSpans() {
      return this.getMergeSpans();
    }
  },
  watch: {
    attach: {
      deep: true,
      handler: 'initApi'
    },
    'value.isResize': 'registerResize'
  },
  created() {
    this.initApi();
  },
  beforeDestroy() {
    this.registerResize(false);
  },
  methods: {
    initApi() {
      let api = getApi.call(this);
      this.$emit('input', {
        ...api.defaultApi,
        ...api.extendApi,
        ...api.globalApi,
        ...api.localApi,
        page: {
          ...api.pageApi,
          ...api.globalPageApi,
          ...api.localPageApi
        }
      });
      this.API = api;
      if (this.LOAD) return;
      this.$nextTick()
        .then(() => (this.LOAD = true))
        .then(() => {
          this.value.$ref = this.$refs.table;
          this.value.immediate && this.value.getData();
          this.registerResize();
        });
    },
    getAttrs() {
      let attrs = {};
      for (const key in this.value) {
        if (!this.API.extendApi.hasOwnProperty(key)) {
          attrs[key] = this.value[key];
        }
      }
      if (attrs.height && this.value.isPage) {
        let proxyH = Number(attrs.height) - this.value.page.height;
        attrs.height = proxyH < 0 ? 0 : proxyH;
      }
      return attrs;
    },
    getEvents() {
      let events = {};
      let { eventsApi: a, localEventsApi: b } = this.API;
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
    getStyles() {
      let { height, page } = this.value;
      return {
        container: { height: height ? height + 'px' : 'auto' },
        page: { height: page.height ? page.height + 'px' : 'auto' }
      };
    },
    getColumns(columns) {
      let config = columns;
      if (!Array.isArray(config)) {
        config = Object.keys(columns).map(k => {
          let v = columns[k];
          if (v.prop == undefined) this.$set(v, 'prop', k);
          return v;
        });
      }
      return config
        .map(v => {
          let o = {};
          let attrs = { ...this.API.globalColumnApi, key: guid() };
          for (const key in attrs) {
            if (v[key] == undefined) this.$set(v, key, attrs[key]);
          }
          if (v.children) {
            o.children = this.getColumns(v.children);
            if (o.children.length == 0) v.key = guid();
          }
          return { ...v, ...o };
        })
        .filter(v => v.display);
    },
    getFlatColumns(columns) {
      return columns.reduce((result, v) => {
        return result.concat(
          Array.isArray(v.children) && v.children.length > 0
            ? this.getFlatColumns(v.children)
            : v
        );
      }, []);
    },
    getMergeKeys() {
      let { isMerge, rowKey } = this.value;
      if (rowKey) return [];
      return this.flatColumns
        .filter(v => {
          let merge = v.merge === undefined ? isMerge : v.merge;
          return v.prop && merge && !v.type;
        })
        .map(v => v.key);
    },
    getMergeSpans() {
      let spanArr = [];
      let spanIndex = -1;
      this.mergeKeys.forEach(k => {
        this.value.data.forEach((cur, i) => {
          let next = this.value.data[i + 1];
          let prev = this.value.data[i - 1];
          if (spanArr[i] == undefined) spanArr[i] = {};
          spanArr[i][k] = { rowspan: 1, colspan: 1 };
          if (next && cur[k] == next[k]) {
            if (spanIndex == -1) {
              spanIndex = i;
              spanArr[spanIndex][k].rowspan++;
            } else {
              spanArr[spanIndex][k].rowspan++;
              spanArr[i][k].rowspan = 0;
            }
          } else {
            spanIndex = -1;
            spanArr[i][k].rowspan = prev && prev[k] == cur[k] ? 0 : 1;
          }
        });
      });
      return spanArr;
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
  padding: 0px 25px;
  justify-content: flex-end;
}

.agel-table .el-table__empty-text {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
