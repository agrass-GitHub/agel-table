import { tablePropKeys, tableColumnPropKeys, agTableProps, agColumnProps, pagProps, queryProps } from "./utils/const.js"
import { getCustomProps, extend, getIncludeAttrs, guid, getProp, isObject } from "./utils/utils"
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
    async getData() {
      const request = this.value.request
      if (!request || typeof request != "function") return
      this.value.loading = true
      const thenRes = (res) => {
        const { data, total } = Array.isArray(res)
          ? { data: res, total: res.length }
          : res
        this.value.loading = false
        this.value.data = data
        if (this.isEnable("page")) this.value.page.total = total
      }
      if (request.length >= 2) {
        return new Promise((resolve, reject) => {
          try {
            return request(this.value.query, resolve, reject)
          } catch (error) {
            this.value.loading = false
            console.error(error)
          }
        })
          .then((res) => thenRes(res))
          .catch(() => this.value.loading = false)
      } else {
        try {
          return thenRes(await request(this.value.query))
        } catch (error) {
          this.value.loading = false
          console.error(error)
        }
      }
    },
    selectionChange(selection) {
      if (this.value.hasOwnProperty('selection')) {
        this.value.selection = selection
      }
      if (this.value.on && this.value.on["selection-change"]) {
        this.value.on["selection-change"](selection)
      }
    },
    sortChange({ column, prop, order }) {
      if (typeof column.sortable == "string") {
        this.setQuery("sortProp", prop)
        this.setQuery("sortOrder", order)
        if (column.sortable == "custom-by-virtual") {
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
      this.$nextTick(this.getData)
      if (this.value.on && this.value.on["page-change"]) {
        this.value.on["page-change"](page)
      }
    },
    sizeChange(size) {
      this.value.page.currentPage = 1
      this.value.page.pageSize = size
      this.$nextTick(this.getData)
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
      const props = ((this.$agelTableConfig || {}).queryProps) || queryProps
      if (!props[key]) return
      if (typeof key === "string") {
        this.value.query[props[key]] = value
      }
      if (typeof props[key] === "function") {
        const [newkey, newValue] = props[key](value)
        this.value.query[newkey] = newValue
      }
    },
    getRef(name = "table") {
      return this.$refs[name]
    },
    isEnable(name) {
      return this.value[name] && this.value[name].enable
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(newv, oldv) {
        if (newv === oldv) return
        const config = this.$agelTableConfig || {}
        const tableOption = Object.assign(getCustomProps(agTableProps), config.table || {})
        extend(this.value, tableOption, this.$set)

        if (this.value.page || (config.page && config.page.enable)) {
          const pageOption = Object.assign(getCustomProps(pagProps), config.page || {}, this.value.page || {})
          this.$set(this.value, "page", pageOption)
          this.setQuery("currentPage", this.value.page.currentPage)
          this.setQuery("pageSize", this.value.page.pageSize)
        }
        const defaultSort = getProp(this.value, 'defaultSort')
        if (defaultSort) {
          this.setQuery("sortProp", defaultSort.prop)
          this.setQuery("sortOrder", defaultSort.order)
        }
        this.value.getRef = this.getRef;

        if (this.value.request) {
          this.value.getData = this.getData
        }
        if (this.value.resize) {
          this.value.resizeTable = this.resizeTable
        }
        if (this.value.virtual) {
          this.value.virtualScrollToRow = this.virtualScrollToRow
          this.value.getVirtualScrollIndex = this.getVirtualScrollIndex
        }
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
      v != undefined && this.setQuery("currentPage", v)
    },
    'value.page.pageSize'(v) {
      v != undefined && this.setQuery("pageSize", v)
    }
  },
  render(h) {
    const events = Object.assign({}, this.value.on, {
      "current-change": this.currentChange,
      "sort-change": this.sortChange,
      "size-change": this.sizeChange,
      "selection-change": this.selectionChange,
    })

    const ElPage = () => {
      if (!this.value.page || !this.value.page.enable) return null
      const config = (this.$agelTableConfig || {})['page'] || {}
      const attrs = Object.assign({}, config, this.value.page)
      const style = {
        'height': attrs.height + 'px',
        'display': 'flex',
        'align-items': 'center',
        'padding': '0px 0px',
        'justify-content': 'flex-end',
      }
      return h("el-pagination", {
        style: style,
        attrs: attrs,
        on: events,
        ref: "page",
      })
    }

    const ElTable = () => {
      const config = (this.$agelTableConfig || {})['table'] || {}
      const attrs = getIncludeAttrs(tablePropKeys, Object.assign({}, config, this.value))
      if (this.isEnable('page')) attrs.height = `calc(100% - ${this.value.page.height}px)`
      if (this.isEnable('merge')) attrs.spanMethod = this.spanMethod
      if (this.isEnable('virtual')) attrs.data = this.virtualScroll.renderData
      return h(
        "el-table",
        {
          attrs: attrs,
          on: events,
          directives: [{ name: "loading", value: this.value.loading }],
          ref: "table",
        },
        this.getElTableColumns(this.columns)
      )
    }

    return h(
      "div",
      {
        attrs: { calss: "agel-table" },
        style: { height: isNaN(this.value.height) ? this.value.height : this.value.height + 'px' },
        ref: "container",
      },
      [ElTable(), ElPage()]
    )
  },
}