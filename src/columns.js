/**
* @description ElTableColumns  
*/

import { tableColumnPropKeys, agColumnProps, } from "./utils/const.js"
import { getCustomProps, getIncludeAttrs, guid } from "./utils/utils"

export default {
  computed: {
    columns() {
      return this.getColumns(this.value.columns)
    },
    flatColumns() {
      return this.getFlatColumns(this.columns || []);
    }
  },
  methods: {
    getColumns(tableColumns = []) {
      const config = (this.$agelTableConfig || {})['column'] || {}
      const columns = !Array.isArray(tableColumns)
        ? Object.keys(tableColumns).map((prop) => Object.assign({ prop }, tableColumns[prop]))
        : tableColumns
      return columns.map((column) => {
        const agColumn = Object.assign(getCustomProps(agColumnProps), config, column)
        agColumn.display = typeof column.display === 'function' ? column.display() : column.display
        agColumn.children = this.getColumns(agColumn.children)
        if (!column['_key_'] || column.children && column.children.length != agColumn.children.length) {
          column['_key_'] = guid();
        }
        if (this.isEnable("virtual")) {
          this.handleVirtualScrollColumn(agColumn)
        }
        return agColumn
      }).filter((column) => column.display !== false)
    },
    getFlatColumns(columns) {
      return columns.reduce((result, v) => {
        return result.concat(Array.isArray(v.children) && v.children.length > 0 ? this.getFlatColumns(v.children) : v);
      }, []);
    },
    getMenuColumn() {
      const h = this.$createElement
      const menu = this.value.menu;
      const { onEdit, onDel, editRender, delRender, menuRender } = menu
      return h("el-table-column", {
        attrs: getIncludeAttrs(tableColumnPropKeys, menu),
        key: "agel-table-menu-column",
        scopedSlots: {
          default: (scope) => {
            const editButton = ({ h, clickEvent }) => {
              return editRender ? editRender({ h, clickEvent }) : h('el-button', { attrs: { type: 'text' }, on: { click: clickEvent } }, '编辑')
            }
            const delButton = ({ h, clickEvent }) => {
              return delRender ? delRender({ h, clickEvent }) : h('el-button', { attrs: { type: 'text' }, on: { click: clickEvent } }, '删除')
            }
            return h('div', {}, [
              onEdit ? editButton({ h, clickEvent: () => onEdit(scope) }) : null,
              onDel ? delButton({ h, clickEvent: () => onDel(scope) }) : null,
              menuRender && menuRender({ h, menu, scope }),
            ])
          }
        }
      })
    },
    getElTableColumns(columns, root = true) {
      this.$nextTick(() => {
        root && this.$refs.table && this.$refs.table.doLayout()
      })
      const columnVnodes = columns.map((column) => {
        const h = this.$createElement
        const attrs = getIncludeAttrs(tableColumnPropKeys, column)
        const scopedSlots = {}
        const slotColumn = column.slotColumn || column.slotExpand
        const slotHeader = column.slotHeader

        if (typeof slotColumn === 'string') {
          scopedSlots.default = this.$scopedSlots[slotColumn] || null
        } else if (typeof slotColumn === 'function') {
          scopedSlots.default = (scope) => slotColumn(h, scope)
        }

        if (typeof slotHeader === 'string') {
          scopedSlots.header = this.$scopedSlots[slotHeader] || null
        } else if (typeof slotHeader === 'function') {
          scopedSlots.header = (scope) => slotHeader(h, scope)
        }

        return h("el-table-column", { attrs, scopedSlots, key: column['_key_'] }, this.getElTableColumns(column.children, false))
      })

      if (root && this.isEnable('menu')) {
        const insertIndex = this.value.menu.insertIndex
        const menuColumnVnode = this.getMenuColumn();
        if (typeof insertIndex === 'number') {
          columnVnodes.splice(insertIndex, 0, menuColumnVnode)
        } else {
          columnVnodes.push(menuColumnVnode)
        }
      }
      return columnVnodes
    }
  }
}