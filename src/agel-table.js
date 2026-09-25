import { tablePropKeys, agTableProps, pagProps, menuProps, queryProps } from "./utils/const.js"
import { getCustomProps, extend, getProp, guid } from "./utils/utils"
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
  // 请求序号不参与渲染，用于忽略迟到结果和组件销毁后的响应。
  created() {
    this._requestVersion = 0
  },
  // 组件退出后不再把异步请求结果写回业务配置。
  beforeDestroy() {
    this._requestVersion++
  },
  computed: {
    // 只追踪顶层引用；共享的行/列对象仍保留 Vue 响应式能力。
    attachedOptions() {
      return { ...this.attach }
    }
  },
  methods: {
    sortChange({ column, prop, order }) {
      if (column && typeof column.sortable == "string") {
        this.setQuery(queryProps.orderColumn, prop)
        this.setQuery(queryProps.order, order)
        if (column.sortable === "virtual-sortable") {
          this.refreshVirtualData()
        } else {
          this.getData()
        }
      }
      if (!column && this.isEnable("virtual")) this.refreshVirtualData()
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
      if (Object.prototype.hasOwnProperty.call(this.value.query, propsKey)) {
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
      
      // 仅最新请求拥有数据和 loading；保持 request(query, done, err) 协议。
      const table = this.value
      const version = ++this._requestVersion
      const isCurrent = () => !this._isDestroyed && !this._isBeingDestroyed && this.value === table && version === this._requestVersion
      table.loading = true
      return new Promise((done, err) => {
        this.$nextTick(() => {
          // 同一轮已被新请求或销毁取代的任务无需继续调用接口。
          if (!isCurrent()) return done()
          try {
            const pending = request(table.query, done, err)
            // 支持 async 回调抛错；成功结果仍由 done 回填，不改变既有协议。
            if (pending && typeof pending.catch === 'function') pending.catch(err)
          } catch (error) {
            err(error)
          }
        })
      })
        .then((res) => {
          if (!isCurrent()) return
          const { data, total } = Array.isArray(res)
            ? { data: res, total: res.length }
            : res
          table.loading = false
          table.data = data
          if (this.isEnable("page")) table.page.total = total
        })
        .catch(() => {
          if (isCurrent()) table.loading = false
        })
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
    attachedOptions: {
      immediate: true,
      handler: function () {
        extend(this.value, this.attachedOptions, this.$set, true)
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
  // 根节点、表格/分页层次、class 和 CSS 继续与原组件一致。
  render(h) {
    const config = this.$agelTableConfig || {}
    const events = {
      ...this.value.on,
      'current-change': this.currentChange,
      'sort-change': this.sortChange,
      'size-change': this.sizeChange
    }
    const attrs = {}
    // 不在 render 中读取全量 data，否则 Vue 2 会对整批数组收集依赖。
    tablePropKeys.forEach((key) => {
      if (key === 'data') return
      const value = getProp(this.value, key)
      const configured = value === undefined ? getProp(config.table || {}, key) : value
      if (configured !== undefined) attrs[key] = configured
    })
    attrs.data = this.isEnable('virtual') ? this.virtualScroll.renderData : this.value.data
    if (this.isEnable('merge')) attrs.spanMethod = this.spanMethod
    if (this.value.height) attrs.height = this.isEnable('page') ? `calc(100% - ${this.value.page.height}px)` : '100%'
    const children = this.getElTableColumns(this.columns)
    const empty = this.$slots.empty || (config.slotEmpty ? config.slotEmpty(h) : null)
    if (this.$slots.append) children.push(h('div', { slot: 'append' }, [this.$slots.append]))
    if (empty) children.push(h('div', { slot: 'empty' }, [empty]))
    const table = h('el-table', { attrs, on: events, style: { width: '100%' }, ref: 'table' }, children)
    let page = null
    if (this.isEnable('page')) {
      const options = { ...config.page, ...this.value.page }
      page = h('el-pagination', {
        attrs: options,
        on: events,
        style: { height: options.height + 'px', justifyContent: options.justify, display: 'flex', alignItems: 'center', padding: '0px 0px' },
        ref: 'page'
      })
    }
    return h(
      'div',
      {
        directives: [{ name: 'loading', value: this.value.loading }],
        class: 'agel-table',
        attrs: { id: this.tableId },
        style: { height: isNaN(this.value.height) ? this.value.height : this.value.height + 'px' },
        ref: 'container',
        key: this.tableId
      },
      [table, page]
    )
  }
}
