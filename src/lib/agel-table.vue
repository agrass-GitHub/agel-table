<template>
  <div ref="container" class="agel-table" v-loading="value.loading">
    <!-- el-table -->
    <el-table ref="table" v-bind="attrs" v-on="events">
      <!-- append  -->
      <template v-slot:append>
        <slot name="append"></slot>
      </template>

      <!-- column -->
      <agel-column v-for="(item, index) in columns" :key="getId(index)" :column="item">
        <!-- slot header -->
        <template v-slot:[item.prop+header]="{scope}">
          <slot :name="item.prop+header" :column="scope.column" :index="scope.$index"></slot>
        </template>

        <!-- slot -->
        <template v-slot:[item.prop]="{scope}">
          <slot :name="item.prop" :index="scope.$index" :row="scope.row" :column="scope.column"></slot>
        </template>

        <!-- slot expand -->
        <template v-slot:expand="{scope}">
          <slot name="expand" :index="scope.$index" :row="scope.row"></slot>
        </template>
      </agel-column>
    </el-table>

    <!-- el-pagination -->
    <el-pagination ref="page" v-if="value.isPage" v-bind="value.page"></el-pagination>
  </div>
</template>
 
<script>
import agelColumn from './agel-column';

export default {
  name: 'agel-table',
  components: {
    agelColumn
  },
  props: {
    value: Object
  },
  install(vue, ops = {}) {
    vue.component(ops.componentName || this.name, this);
  },
  data() {
    return {
      header: 'Header'
    };
  },
  computed: {
    attrs() {
      let attrs = {};
      let ignore = Object.keys(this.getTableApi().extendApi);
      for (const key in this.value) {
        if (!ignore.includes(key)) attrs[key] = this.value[key];
      }
      return attrs;
    },
    events() {
      let events = {};
      for (const key in this.value.on) {
        // 把驼峰命名转为 kebab-case
        let regx = /([A-Z])/g;
        let name = regx.test(key)
          ? key.replace(regx, '-$1').toLowerCase()
          : key;
        events[name] = this.value.on[key];
      }
      return events;
    },
    columns() {
      return this.value.columns.filter(v => {
        let display = v.display == undefined ? true : v.display;
        return display;
      });
    }
  },
  watch: {
    'value.showSummary'() {
      let { height, resize } = this.value;
      if (height) resize();
    },
    'value.data'() {
      // 在有合计的时候和固定高度的情况下，获取数据需要重新自适应容器
      let { showSummary, height, resize } = this.value;
      if (showSummary && height) resize();
    },
    'value.isPage'() {
      // 在开启了自适应的情况下，切换分页组件的显示隐藏，需要重新自适应容器
      let { isResize, resize } = this.value;
      if (isResize) resize();
    },
    'value.isResize'() {
      this.registrationResize();
    }
  },
  created() {
    this.initTabel();
  },
  beforeDestroy() {
    this.registrationResize(false);
  },
  methods: {
    getId(index) {
      return `${index}-${Number(
        Math.random()
          .toString()
          .substr(3, 3) + Date.now()
      ).toString(36)}`;
    },
    getTableApi() {
      const extendApi = {
        $ref: undefined,
        loading: false,
        isPage: true,
        isResize: false,
        columns: [],
        page: {
          pageSize: 10,
          pageSizes: [10, 50, 100, 200],
          currentPage: 1,
          layout: 'total, sizes, prev, pager, next, jumper',
          class: 'agel-pagination',
          total: 100
        },
        on: {},
        resize: e => {
          let table = this.value;
          // 轻量级自适应
          let lightweightResize = () => {
            let { container, page } = this.$refs;
            let containerH = container ? container.clientHeight : 0;
            let pageH = page ? page.$el.clientHeight : 0;
            table.height = containerH - pageH;
          };
          // 强制性自适应
          let heavylweightResize = () => {
            this.$nextTick(() => {
              lightweightResize();
              table.$ref && table.$ref.doLayout();
            });
          };

          e && e.type == 'resize' ? lightweightResize() : heavylweightResize();
        },
        async getList() {
          this.loading = true;
          let params = {
            page: this.page,
            pageSize: this.size,
            order: 0,
            orderColumn: ''
          };
          let data = await this.api(params);
          this.data = data.list;
          this.total = data.total;
          this.loading = false;
        }
      };
      const defaultApi = {
        data: [],
        height: undefined
      };
      return { defaultApi, extendApi };
    },
    initTabel() {
      console.log('重新生成table');
      let { defaultApi, extendApi } = this.getTableApi();
      let page = Object.assign(extendApi.page, this.value.page || {});
      let table = Object.assign(defaultApi, extendApi, this.value, { page });
      this.$emit('input', table);
      this.$nextTick(() => {
        this.value.$ref = this.$refs.table;
        this.registrationResize();
      });
    },
    registrationResize(isResize = this.value.isResize) {
      this.value.height = '';
      if (isResize) {
        this.value.resize();
        console.log('注册自适应');
        window.addEventListener('resize', this.value.resize);
      } else {
        console.log('移除自适应');
        window.removeEventListener('resize', this.value.resize);
      }
    }
  }
};
</script>
 
<style >
.agel-table {
  height: 100%;
  width: 100%;
  overflow: auto;
}
.agel-table .el-table {
  width: 100%;
}

.agel-table .agel-pagination {
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 10px;
}

.agel-table .el-table__empty-text {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>