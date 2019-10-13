export default function() {
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
      new Promise((resolve) => this.request(this.getQuery(), resolve))
        .then((res) => {
          let { data, total } = Array.isArray(res) ? { data: res } : res;
          this.data = data || this.data;
          this.page.total = total || this.page.total;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.error('获取数据失败' + err);
        });
    },
    resize: (e) => {
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
    sizeChange: (size) => {
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
  const attachApi = this.attach || {};
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
    localEventsApi,
    attachApi
    // 覆盖顺序由下往上⬆
  };
}
