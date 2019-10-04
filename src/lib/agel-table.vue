<template>
  <div ref="container" class="agel-table" v-loading="value.loading">
    <!-- el-table -->
    <el-table ref="table" v-bind="attrs" v-on="events">
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
    <el-pagination ref="page" v-if="value.isPage" v-bind="pageAttrs" v-on="events"></el-pagination>
  </div>
</template>
 
<script>
import { guid, kebabcase } from './tool';
import agelColumn from './agel-column';
export default {
  name: 'agel-table',
  install(vue, opts = {}) {
    let config = Object.assign(
      {
        name: this.name,
        table: {},
        cloumn: {},
        page: {}
      },
      opts
    );
    vue.prototype.$agelTableConfig = config;
    vue.component(config.name, this);
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
      return this.getValidAttrs(this.value, 'table');
    },
    pageAttrs() {
      return this.getValidAttrs(this.value.page, 'page');
    },
    columns() {
      return this.getValidColumns(this.value.columns);
    },
    events() {
      return this.getValidEvents();
    }
  },
  watch: {
    'value.showSummary'() {
      let { height, resize } = this.value;
      height && resize();
    },
    'value.data'() {
      // 在有合计的时候和固定高度的情况下，获取数据需要重新自适应容器
      let { showSummary, height, resize } = this.value;
      showSummary && height && resize();
    },
    'value.isPage'() {
      // 在开启了自适应的情况下，切换分页组件的显示隐藏，需要重新自适应容器
      let { isResize, resize } = this.value;
      isResize && resize();
    },
    'value.isResize'() {
      this.registerResize();
    }
  },
  beforeMount() {
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
      const table = this.value;
      const defaultApi = {
        $ref: undefined,
        loading: false,
        isPage: true,
        isResize: false,
        data: [],
        height: '',
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
            let containerH = container ? container.parentNode.clientHeight : 0;
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
          table.order = order;
          table.orderColumn = prop;
          table.getData();
        },
        sizeChange: size => {
          table.page.pageSize = size;
          table.getData();
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
      const globalApi = this.$agelTableConfig.table;
      const globalPageApi = this.$agelTableConfig.page;
      const globalColumnApi = this.$agelTableConfig.column;
      const localApi = this.value;
      const localPageApi = this.value.page;
      const localEventsApi = this.value.on;
      return {
        // 默认配置
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
    getValidAttrs(data, name) {
      let attrs = {};
      let props = this.$refs[name] ? this.$refs[name].$props : {};
      let vaildAttrs = { ...props, class: '' };
      for (const key in data) {
        if (vaildAttrs.hasOwnProperty(key)) attrs[key] = data[key];
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
      this.value.height = '';
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
  height: auto !important;
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