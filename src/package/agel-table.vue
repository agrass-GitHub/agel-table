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
      type: Object,
      defualt: () => new Object()
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
        // 事件拦截器，在提交event之前可以做点什么...
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
        ...this.attach
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
    getApi() {
      const extendApi = {
        $ref: undefined,
        loading: false,
        isPage: true,
        isResize: false,
        columns: [],
        order: '',
        orderColumn: '',
        page: {},
        on: {},
        queryProps: {
          page: 'page',
          pageSize: 'pageSize',
          order: 'order',
          orderColumn: 'orderColumn'
        },
        request: null,
        getQuery() {
          let { page, pageSize, order, orderColumn } = this.queryProps;
          return {
            [page]: this.page.currentPage,
            [pageSize]: this.page.pageSize,
            [order]: this.order,
            [orderColumn]: this.orderColumn
          };
        },
        getData() {
          if (!this.request) return;
          this.loading = true;
          new Promise(resolve => this.request(this.getQuery(), resolve))
            .then(({ data = this.data, total = this.page.total }) => {
              this.loading = false;
              this.data = data;
              this.page.total = total;
            })
            .catch(err => {
              this.loading = false;
              console.error('获取数据失败' + err);
            });
        },
        resize: e => {
          let table = this.value;
          let lightweightResize = () => {
            let { container } = this.$refs;
            let containerH = container ? container.parentNode.clientHeight : 0;
            if (containerH <= 0) return;
            table.height = containerH;
          };
          let heavylweightResize = () => {
            this.$nextTick(() => {
              lightweightResize();
              table.$ref && table.$ref.doLayout();
            });
          };
          // windowResize use lightweight
          e && e.type == 'resize' ? lightweightResize() : heavylweightResize();
        }
      };
      const defaultApi = {
        data: [],
        height: undefined
      };
      const pageApi = {
        pageSize: 20,
        pageSizes: [10, 20, 50, 100],
        currentPage: 1,
        layout: 'total, sizes, prev, pager, next, jumper',
        class: 'agel-pagination',
        total: 0
      };
      const eventsApi = {
        sortChange: ({ column, prop, order }) => {
          if (column.sortable !== 'custom') return;
          this.value.order = order;
          this.value.orderColumn = prop;
          this.value.getData();
        },
        sizeChange: size => {
          this.value.page.pageSize = size;
          this.value.getData();
        },
        // 重名事件 currentChange
        currentChange: (...params) => {
          if (isNaN(params[0])) {
            // emit table currentChange event
            return 'currentChange';
          } else {
            // emit page pageChange event
            this.value.page.currentPage = params[0];
            this.value.getData();
            return 'pageChange';
          }
        }
      };

      const config = this.$agelTableConfig || {};
      const globalApi = config.table || {};
      const globalPageApi = config.page || {};
      const globalColumnApi = config.column || {};
      const localApi = this.value || {};
      const localPageApi = localApi.page || {};
      const localEventsApi = localApi.on || {};
      return {
        // 默认配置
        extendApi,
        defaultApi,
        eventsApi,
        pageApi,
        // 全局配置
        globalApi,
        globalPageApi,
        globalColumnApi,
        // 局部配置
        localApi,
        localPageApi,
        localEventsApi
      };
    },
    getColumns(columns = [], globalColumnApi) {
      return columns.map(v => {
        let o = {
          ...globalColumnApi,
          ...v,
          key: v.key == undefined ? guid() : v.key,
          display: v.display === undefined ? true : v.display
        };
        if (v.children) {
          v.children = this.getColumns(v.children, globalColumnApi);
        }
        return o;
      });
    },
    renderColumns() {
      this.$slots.columns = getColumnsVnode(
        this.$createElement,
        this.$scopedSlots,
        this.value.columns
      );
      this.$nextTick(() => {
        this.value.$ref.doLayout();
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