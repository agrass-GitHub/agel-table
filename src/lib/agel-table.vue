<template>
  <div ref="container" class="agel-table" v-loading="value.loading" v-if="LOAD">
    <!-- el-table -->
    <el-table ref="table" v-bind="attrs" v-on="events" style="width:100%">
      <!-- append  -->
      <template v-slot:append>
        <slot name="append"></slot>
      </template>

      <!-- empty  -->
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
    },
    attach: {
      type: Object,
      defualt: () => new Object()
    }
  },
  data() {
    return {
      LOAD: false
    };
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
    },
    isMultistep() {
      return this.value.columns.some(v => v.children && v.children.length > 0);
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
        },
        ...this.attach
      };
      this.$emit('input', table);
      this.$nextTick(() => {
        this.LOAD = true;
        this.$nextTick(() => {
          this.value.$ref = this.$refs.table;
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
            let { container, page } = this.$refs;
            let containerH = container ? container.parentNode.clientHeight : 0;
            let pageH = page ? page.$el.clientHeight : 0;
            let resizeH = containerH - pageH;
            if (resizeH <= 0) return;
            table.height = resizeH;
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
      if (!this.LOAD) return {};
      let attrs = {};
      let ignore = this.getApi().extendApi;
      for (const key in this.value) {
        if (!ignore.hasOwnProperty(key)) attrs[key] = this.value[key];
      }
      return attrs;
    },
    getValidColumns(columns) {
      if (!this.LOAD) return {};
      let { globalColumnApi } = this.getApi();
      return columns
        .map(v => {
          if (v.key == undefined || this.isMultistep) v.key = guid();
          let display = v.display == undefined ? true : v.display;
          let o = { ...v, ...globalColumnApi, display };
          if (o.children) o.children = this.getValidColumns(o.children);
          return o;
        })
        .filter(v => v.display);
    },
    getValidEvents() {
      if (!this.LOAD) return {};
      let events = {};
      let { eventsApi: a, localEventsApi: b } = this.getApi();
      for (let key in { ...a, ...b }) {
        // 事件拦截器，在提交event之前可以做点什么...
        events[kebabcase(key)] = (...params) => {
          if (a[key]) key = a[key](...params) || key;
          if (b[key]) b[key](...params);
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
  height: auto;
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