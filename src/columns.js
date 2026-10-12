/**
* @description ElTableColumns  
*/

import { tableColumnPropKeys, agColumnProps, } from "./utils/const.js"
import { getCustomProps, getIncludeAttrs, guid } from "./utils/utils"

// 子列支持数组和对象两种写法。
function getColumnCount(columns) {
  if (!columns) return 0
  return Array.isArray(columns) ? columns.length : Object.keys(columns).length
}

// 在列对象上记录上次计算时的可见子列；不可枚举，不影响业务层序列化列配置，也无需 WeakMap polyfill。
function swapVisibleChildren(column, signature) {
  const previous = column._visible_
  if (previous !== signature && Object.isExtensible(column)) Object.defineProperty(column, '_visible_', { value: signature, configurable: true, writable: true })
  return previous
}

export default {
  watch: {
    // 列配置变化才重新布局；虚拟表格由统一的动画帧调度器处理。
    columns() {
      if (this.isEnable('virtual')) return
      this.$nextTick(() => {
        if (!this._isDestroyed && !this._isBeingDestroyed) this.$refs.table.doLayout()
      })
    }
  },
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
      const isArray = Array.isArray(tableColumns)
      const props = isArray ? null : Object.keys(tableColumns)
      // 对象形式的列每次都会生成临时对象，key 需要记在业务层的原始列对象上。
      const sources = isArray ? tableColumns : props.map((prop) => tableColumns[prop])
      return sources.map((source, i) => {
        const column = isArray ? source : Object.assign({ prop: props[i] }, source)
        const holder = isArray || !source || typeof source !== 'object' || !Object.isExtensible(source) ? column : source
        const agColumn = Object.assign(getCustomProps(agColumnProps), config, column)
        agColumn.display = typeof column.display === 'function' ? column.display() : column.display
        agColumn.children = this.getColumns(agColumn.children)
        // 子列被隐藏时沿用旧版的整组重建（规避 Element UI 多级表头显隐问题），但只在可见子列变化的那一次重建。
        const childCount = getColumnCount(column.children)
        const signature = agColumn.children.map((child) => child._key_).join(',')
        const previous = childCount ? swapVisibleChildren(holder, signature) : undefined
        if (!holder['_key_'] || childCount != agColumn.children.length && previous !== signature) {
          holder['_key_'] = guid();
        }
        // 首次渲染也使用稳定 key，避免下一次改列时把整列当作新节点重建。
        agColumn._key_ = holder._key_
        if (this.isEnable("virtual")) {
          this.handleVirtualScrollColumn(agColumn)
        }
        return agColumn
      }).filter((column) => column.display !== false)
    },
    getFlatColumns(columns) {
      // 累积到同一个数组，避免每次 concat 复制此前的全部列。
      const result = []
      const visit = (items) => {
        const columns = Array.isArray(items) ? items : Object.keys(items || {}).map((prop) => Object.assign({ prop }, items[prop]))
        columns.forEach((column) => {
          if (Array.isArray(column.children) && column.children.length) visit(column.children)
          else result.push(column)
        })
      }
      visit(columns)
      return result
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
