/**
* @description ElTableColumns  
*/

import { tableColumnPropKeys, agColumnProps, } from "./utils/const.js"
import { getCustomProps, getIncludeAttrs, } from "./utils/utils"
import renderComponent from "./render-component.js"


// @description 对 v.0.3.6 之前版本 API 兼容补丁
const patch = {
  slotHeader: function (column, scopedSlots) {
    if (column.slotHeader) {
      if (typeof column.slotHeader === 'boolean') {
        scopedSlots.header = this.$scopedSlots[column.slotHeader] || null
      } else if (typeof column.slotHeader === 'function') {
        scopedSlots.header = (scope) => column.slotHeader(this.$createElement, scope)
      }
    }
  },
  slotColumn: function (column, scopedSlots) {
    if (column.slotColumn) {
      if (typeof column.slotColumn === 'boolean') {
        scopedSlots.default = this.$scopedSlots[column.slotColumn] || null
      } else if (typeof column.slotColumn === 'function') {
        scopedSlots.default = (scope) => column.slotColumn(this.$createElement, scope)
      }
    }
  },
  slotExpand: function (column, scopedSlots) {
    if (column.slotExpand) {
      if (typeof column.slotExpand === 'boolean') {
        scopedSlots.header = this.$scopedSlots['expand'] || null
      } else if (typeof column.slotExpand === 'function') {
        scopedSlots.default = (scope) => column.slotExpand(this.$createElement, scope)
      }
    }
  },
}

export default {
  computed: {
    columns() {
      return this.getColumns(this.value.columns)
    },
  },
  methods: {
    getColumns(tableColumns = []) {
      const config = (this.$agelTableConfig || {})['column'] || {}
      const columns = !Array.isArray(tableColumns)
        ? Object.keys(tableColumns).map((prop) => Object.assign({ prop }, tableColumns[prop]))
        : tableColumns
      return columns.map((column) => {
        const agColumn = Object.assign(getCustomProps(agColumnProps), config, column)
        agColumn.children = this.getColumns(agColumn.children)
        if (this.isEnable("virtual")) {
          this.handleVirtualScrollColumn(agColumn)
        }
        return agColumn
      }).filter((v) => v.display)
    },
    getElTableColumns(columns) {
      this.$nextTick(() => {
        this.$refs.table && this.$refs.table.doLayout()
      })
      return columns.map((column) => {
        const h = this.$createElement
        const attrs = getIncludeAttrs(tableColumnPropKeys, column)
        const scopedSlots = {}
        if (column.label && typeof column.label !== "string") {
          scopedSlots.header = (scope) => h(renderComponent, { attrs: { render: column.label, ...scope } })
        }
        if (column.slot) {
          if (typeof column.slot === 'boolean') {
            scopedSlots.default = this.$scopedSlots[column.prop] || null
          } else {
            scopedSlots.default = (scope) => h(renderComponent, { attrs: { render: column.slot, ...scope } })
          }
        }
        patch.slotColumn.call(this, column, scopedSlots)
        patch.slotHeader.call(this, column, scopedSlots)
        patch.slotExpand.call(this, column, scopedSlots)

        if (scopedSlots.header) attrs.label = ""

        return h("el-table-column", { attrs, scopedSlots }, this.getElTableColumns(column.children))
      })
    }
  }
}