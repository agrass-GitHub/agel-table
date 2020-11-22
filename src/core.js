const props = function () {
  return {
    $ref: undefined,
    loading: false,
    columns: [],
    data: [],
    on: {},
    request: undefined,
  }
}

const kebabcase = (v) => v.replace(/([A-Z])/g, "-$1").toLowerCase();

export default {
  created() {
    let extendObj = props();
    let api = Object.assign(props(), this.$agelTableConfig.table || {}, this.value);
    Object.keys(api).forEach(key => {
      this.extendApi(key, api[key], extendObj.hasOwnProperty(key))
    })
  },
  mounted() {
    this.value.$ref = this.$refs.table;
  },
  computed: {
    styles() {
      let { height, page = {} } = this.value;
      return {
        containerHeight: isNaN(height) ? height : height + "px",
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
}