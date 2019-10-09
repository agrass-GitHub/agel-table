<template>
  <div ref="container" class="agel-table" v-loading="value.loading">
    <!-- el-table -->
    <el-table ref="table" v-bind="attrs" v-on="events" style="width:100%">
      <!-- append  -->
      <template v-slot:append>
        <slot name="append"></slot>
      </template>

      <!-- append  -->
      <template v-slot:empty>
        <slot name="empty"></slot>
      </template>

      <!-- columns  -->
      <agel-column v-for="column in columns" :key="column.key" :column="column"></agel-column>
    </el-table>

    <!-- el-pagination -->
    <el-pagination ref="page" v-if="value.isPage" v-bind="value.page" v-on="events"></el-pagination>
  </div>
</template>
 
<script>
import { guid, kebabcase } from './tool';
import agelColumn from './agel-column';
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
  components: {
    agelColumn
  },
  props: {
    value: {
      type: Object,
      defualt: () => new Object()
    }
  },
  data() {
    return {};
  },
  computed: {
    attrs() {
      return this.getValidAttrs();
    },
    events() {
      return this.getValidEvents();
    },
    columns() {
      return this.getValidColumns(this.value.columns);
    }
  },
  watch: {
    'value.data'() {
      // 解决 element-ui table 特定情况下的bug，显示合计异常，列无法对齐的问题
      let { showSummary, height, resize } = this.value;
      if (showSummary || height) resize();
    },
    'value.showSummary'() {
      let { height, resize } = this.value;
      height && resize();
    },
    'value.isPage'() {
      let { isResize, resize } = this.value;
      isResize && resize();
    },
    'value.isResize'() {
      this.registerResize();
    }
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    this.registerResize(false);
  },
  methods: {
    init() {
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
      this.$nextTick(() => {
        this.value.$ref = this.$refs.table;
        this.registerResize();
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
        async getData() {
          if (!this.request) return;
          this.loading = true;
          let { page, pageSize, order, orderColumn } = this.queryProps;
          let params = {
            [page]: this.page.currentPage,
            [pageSize]: this.page.pageSize,
            [order]: this.order,
            [orderColumn]: this.orderColumn
          };
          new Promise(resolve => this.request(params, resolve)).then(
            ({ data = this.data, total = this.page.total }) => {
              this.loading = false;
              this.data = data;
              this.page.total = total;
            }
          );
        },
        resize: e => {
          let table = this.value;
          let lightweightResize = () => {
            let { container, page } = this.$refs;
            let containerH = container ? container.clientHeight : 0;
            let pageH = page ? page.$el.clientHeight : 0;
            table.height = containerH - pageH;
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
        height: ''
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
      const localApi = this.value;
      const localPageApi = this.value.page;
      const localEventsApi = this.value.on;
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
    getValidAttrs() {
      let attrs = {};
      let ignore = this.getApi().extendApi;
      for (const key in this.value) {
        if (!ignore.hasOwnProperty(key)) attrs[key] = this.value[key];
      }
      return attrs;
    },
    getValidColumns(columns) {
      let { globalColumnApi } = this.getApi();
      return columns
        .map(v => {
          let o = { ...v, ...globalColumnApi, key: guid() };
          if (o.display == undefined) v.display = true;
          if (o.children) o.children = this.getValidColumns(o.children);
          return o;
        })
        .filter(v => v.display);
    },
    getValidEvents() {
      let events = {};
      let { eventsApi: a, localEventsApi: b } = this.getApi();
      for (const key in { ...a, ...b }) {
        events[kebabcase(key)] = (...params) => {
          let cusotmKey = ''; // 自定义向上触发的方法名称
          if (a[key]) cusotmKey = a[key](...params);
          if (b[cusotmKey || key]) b[cusotmKey || key](...params);
        };
      }
      return events;
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
  height: 100% !important;
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