import { tablePropKeys, agTableProps, pagProps, menuProps, queryProps } from "./utils/const.js"
import { getCustomProps, extend, getIncludeAttrs, getProp, guid } from "./utils/utils"
import mergeMixin from "./merge.js"
import columnsMixin from "./columns.js"
import resizeMixin from "./resize.js"
import virtualScrollMixin from "./virtual-scroll"

export default {
  name: "agel-table",
  inheritAttrs: false,
  mixins: [columnsMixin, mergeMixin, resizeMixin, virtualScrollMixin],
  props: {
    value: {
      required: true,
      type: Object,
      default: () => new Object(),
    },
    attach: {
      type: Object,
      default: () => new Object(),
    },
  },
  methods: {
    sortChange({ column, prop, order }) {
      if (typeof column.sortable == "string") {
        this.setQuery(queryProps.orderColumn, prop)
        this.setQuery(queryProps.order, order)
        if (column.sortable === "virtual-sortable") {
          this.refreshVirtualData()
        } else {
          this.getData()
        }
      }
      if (this.value.on && this.value.on["sort-change"]) {
        this.value.on["sort-change"]({ column, prop, order })
      }
    },
    pageChange(page) {
      this.value.page.currentPage = page
      this.getData()
      if (this.value.on && this.value.on["page-change"]) {
        this.value.on["page-change"](page)
      }
    },
    sizeChange(size) {
      this.value.page.currentPage = 1
      this.value.page.pageSize = size
      this.getData()
      if (this.value.on && this.value.on["size-change"]) {
        this.value.on["size-change"](size)
      }
    },
    currentChange(...params) {
      // emit page pageChange event
      if (params.length === 1) this.pageChange(params[0])
      // emit table currentChange event
      if (params.length === 2) {
        if (this.value.on && this.value.on["current-change"]) {
          this.value.on["current-change"](...params)
        }
      }
    },
    setQuery(key, value) {
      const props = this.value.queryProps || ((this.$agelTableConfig || {}).queryProps) || queryProps
      let propsKey = props[key];
      if (!propsKey) return
      if (typeof propsKey === "function") {
        const [newkey, newValue] = propsKey(value)
        propsKey = newkey;
        value = newValue;
      }
      if (this.value.query.hasOwnProperty(key)) {
        this.value.query[propsKey] = value
      } else {
        this.$set(this.value.query, propsKey, value)
      }
    },
    isEnable(name) {
      return this.value[name] && this.value[name].enable
    },
    getRef(name = "table") {
      return this.$refs[name]
    },
    getCol(prop) {
      const columns = this.getFlatColumns(this.value.columns)
      return columns.find(v => v.prop && v.prop == prop)
    },
    getData(option = {}) {
      // 对 page 和 pageSize 进行重置
      const props = this.value.queryProps || ((this.$agelTableConfig || {}).queryProps) || queryProps
      if (option[props.currentPage] != undefined || option.currentPage != undefined) {
        this.value.page.currentPage = option[props.currentPage] || option.currentPage
      }
      if (option[props.pageSize] != undefined || option.pageSize != undefined) {
        this.value.page.pageSize = option[props.pageSize] || option.pageSize
      }

      // 若没有接收 query done err 参数，直接触发 request
      const request = this.value.request
      if (!request || typeof request != "function") return
      if (request.length <= 1) {
        return request()
      }
      
      // 代理接口，开启loading，回填数据
      this.value.loading = true
      return new Promise((done, err) => {
        try {
          this.$nextTick(() => request(this.value.query, done, err))
        } catch (error) {
          this.value.loading = false
          console.error(error)
        }
      })
        .then((res) => {
          const { data, total } = Array.isArray(res)
            ? { data: res, total: res.length }
            : res
          this.value.loading = false
          this.value.data = data
          if (this.isEnable("page")) this.value.page.total = total
        })
        .catch(() => this.value.loading = false)
    },
    initTable() {
      const config = this.$agelTableConfig || {}
      const tableOption = Object.assign(getCustomProps(agTableProps), config.table || {})
      const defaultSort = getProp(this.value, 'defaultSort')
      extend(this.value, tableOption, this.$set)

      if (this.value.menu || config.menu && config.menu.enable) {
        const menuOption = Object.assign(getCustomProps(menuProps), config.menu || {}, this.value.menu || {})
        this.$set(this.value, "menu", menuOption)
      }
      if (this.value.page || (config.page && config.page.enable)) {
        const pageOption = Object.assign(getCustomProps(pagProps), config.page || {}, this.value.page || {})
        this.$set(this.value, "page", pageOption)
        this.setQuery(queryProps.currentPage, this.value.page.currentPage)
        this.setQuery(queryProps.pageSize, this.value.page.pageSize)
      }
      if (defaultSort) {
        this.setQuery(queryProps.orderColumn, defaultSort.prop)
        this.setQuery(queryProps.order, defaultSort.order)
      }
      if (this.value.request && this.value.request.length > 1) {
        this.value.getData = this.getData
      }
      if (this.value.resize) {
        this.value.resizeTable = this.resizeTable
      }
      if (this.value.virtual) {
        this.value.virtualScrollToRow = this.virtualScrollToRow
        this.value.getVirtualRowIndex = this.getVirtualRowIndex
      }
      this.value.getRef = this.getRef;
      this.value.getCol = this.getCol;
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newv, oldv) {
        if (newv === oldv) return
        this.initTable()
      }
    },
    attach: {
      deep: true,
      immediate: true,
      handler: function () {
        extend(this.value, this.attach, this.$set, true)
      },
    },
    'value.page.currentPage'(v) {
      v != undefined && this.setQuery(queryProps.currentPage, v)
    },
    'value.page.pageSize'(v) {
      v != undefined && this.setQuery(queryProps.pageSize, v)
    }
  },
  data() {
    return {
      tableId: 'agel-table-' + guid(),
    }
  },
  render(h) {
    const events = Object.assign({}, this.value.on, {
      "current-change": this.currentChange,
      "sort-change": this.sortChange,
      "size-change": this.sizeChange,
    })

    const ElPage = () => {
      if (!this.value.page || !this.value.page.enable) return null
      const config = (this.$agelTableConfig || {})['page'] || {}
      const attrs = Object.assign({}, config, this.value.page)
      const style = {
        'height': attrs.height + 'px',
        'justify-content': attrs.justify,
        'display': 'flex',
        'align-items': 'center',
        'padding': '0px 0px',
      }
      return h("el-pagination", {
        style: style,
        attrs: attrs,
        on: events,
        ref: "page",
      })
    }

    const ElTable = () => {
      const C = this.$agelTableConfig || {};
      const attrs = getIncludeAttrs(tablePropKeys, Object.assign({}, C.table || {}, this.value))
      if (this.isEnable('merge')) attrs.spanMethod = this.spanMethod
      if (this.isEnable('virtual')) attrs.data = this.virtualScroll.renderData
      if (this.value.height) {
        attrs.height = this.isEnable('page') ? `calc(100% - ${this.value.page.height}px)` : '100%'
      }

      const emptyVnode = this.$slots.empty || (C.slotEmpty ? C.slotEmpty(h) : null)
      const appendVnode = this.$slots.append
      const columnsVnodes = this.getElTableColumns(this.columns)

      return h(
        "el-table",
        {
          attrs: attrs,
          on: events,
          style: { width: '100%' },
          directives: [{ name: "loading", value: this.value.loading }],
          ref: "table",
        },
        [
          columnsVnodes,
          appendVnode ? h('div', { slot: 'append' }, [appendVnode]) : null,
          emptyVnode ? h('div', { slot: 'empty' }, [emptyVnode]) : null
        ]
      )
    }

    return h(
      "div",
      {
        attrs: { class: "agel-table", id: this.tableId },
        style: { height: isNaN(this.value.height) ? this.value.height : this.value.height + 'px' },
        ref: "container",
      },
      [ElTable(), ElPage()]
    )
  },
}