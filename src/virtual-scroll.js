/**
 * @description 创建虚拟滚动，维持大数据 table 渲染 
 */
import { orderBy } from 'element-ui/packages/table/src/util.js'
import { dynamicStyleRule } from "./utils/utils"

export default {
  data() {
    return {
      virtualScroll: {
        virtualData: [],
        renderData: [],
        checkData: [],
        selection: [],
        startIndex: 0,
        endIndex: 0,
        offsetNum: 3,
        resizeState: null,
      }
    }
  },
  mounted() {
    if (this.isEnable('virtual')) {
      this.virtualScroll.resizeState = this.$refs.table.resizeState
      this.getScrollWarppers().warpper.addEventListener("scroll", this.onVirtualScroll)
      dynamicStyleRule(this.tableId, this.getVirtualStyleRule())
    }
  },
  beforeDestroy() {
    dynamicStyleRule(this.tableId)
  },
  watch: {
    'value.data'(oldv, newv) {
      if (!this.isEnable("virtual")) return
      if (oldv !== newv) this.virtualScroll.selection = []
      this.refreshVirtualData()
    },
    "virtualScroll.resizeState.height"(v) {
      v && this.updateRenderData()
    },
  },
  methods: {
    updateRenderData() {
      const virtual = this.virtualScroll
      // 计算开始结束渲染位置
      const { offsetNum, virtualData } = virtual
      const { warpper, warppers } = this.getScrollWarppers()
      const rowHeight = this.value.virtual.rowHeight
      const scrollTop = warppers[0].scrollTop || 0
      const offsetHeight = offsetNum * rowHeight
      const viewportHeight = warpper.clientHeight
      let startIndex = Math.floor((scrollTop - offsetHeight) / rowHeight)
      let endIndex = Math.ceil((scrollTop + offsetHeight + viewportHeight) / rowHeight)
      if (startIndex < 0) startIndex = 0
      if (endIndex > virtualData.length) endIndex = virtualData.length
      const renderData = virtualData.slice(startIndex, endIndex)
      const placeholderHeight = virtualData.length * rowHeight - renderData.length * rowHeight
      warppers.forEach(el => {
        let placeholder = el.querySelector('.virtual-scroll-placeholder')
        if (placeholder) {
          placeholder.style.height = placeholderHeight + "px"
        } else {
          placeholder = document.createElement("div")
          placeholder.setAttribute('class', 'virtual-scroll-placeholder')
          placeholder.style.height = placeholderHeight + "px"
          el.appendChild(placeholder)
        }
        el.querySelector('.el-table__body').style.transform = `translateY(${startIndex * rowHeight}px)`
      })
      virtual.startIndex = startIndex
      virtual.endIndex = endIndex
      virtual.renderData = renderData
    },
    refreshVirtualData() {
      const sortColumn = this.flatColumns.find(v => v.sortable == 'virtual-sortable')
      const selectionColumn = this.flatColumns.find(v => v.type == 'virtual-selection')

      const sortingColumn = this.$refs.table.store._data.states.sortingColumn
      if (sortColumn && sortingColumn) {
        this.virtualScroll.virtualData = orderBy(
          this.value.data,
          sortingColumn.property,
          sortingColumn.order,
          sortingColumn.sortMethod,
          sortingColumn.sortBy
        )
      } else {
        this.virtualScroll.virtualData = this.value.data
      }
      if (selectionColumn) {
        this.virtualScroll.checkData = selectionColumn.selectable
          ? this.virtualScroll.virtualData.filter((row, index) => selectionColumn.selectable(row, index))
          : this.virtualScroll.virtualData
      }
      this.updateRenderData()
    },
    onVirtualScroll() {
      window.requestAnimationFrame(this.updateRenderData)
    },
    virtualScrollToRow(rowOrIndex) {
      const { warppers } = this.getScrollWarppers()
      let index = typeof rowOrIndex === 'number' ? rowOrIndex : this.virtualScroll.virtualData.findIndex(row => row === rowOrIndex)
      index = index - 1 < 0 ? 0 : index - 1
      warppers.forEach(el => {
        el.scrollTop = index * this.value.virtual.rowHeight
      })
    },
    handleVirtualScrollColumn(column) {
      // column['show-overflow-tooltip'] = true;
      if (column.sortable === true) {
        column.sortable = "virtual-sortable"
      }
      if (column.type === "selection") {
        const { selectionHeader, selectionColumn } = this.getVirtualSelectionColumn(column)
        column.slotHeader = selectionHeader
        column.slotColumn = selectionColumn
        column.type = "virtual-selection"
      }
      if (column.type === "index") {
        const indexMethod = column.index
        column.index = (v) => {
          const index = this.getVirtualRowIndex(v)
          return indexMethod ? indexMethod(index) : index + 1
        }
      }
    },
    getVirtualRowIndex(index) {
      return this.virtualScroll.startIndex + index
    },
    getVirtualSelectionColumn(column) {
      const virtual = this.virtualScroll
      const selectionHeader = (h) => {
        const isSelected = virtual.checkData.length > 0 && virtual.selection.length === virtual.checkData.length
        const isDisabled = virtual.checkData.length === 0
        const isIndeterminate = virtual.selection.length > 0 && !isSelected
        return h("el-checkbox", {
          class: "virtual-scroll-checkbox",
          props: {
            value: isSelected,
            disabled: isDisabled,
            indeterminate: isIndeterminate,
          },
          on: {
            input: (v) => {
              virtual.selection = v ? [].concat(virtual.checkData) : []
              if (this.value.on && this.value.on["select-all"]) {
                this.value.on["select-all"](virtual.selection)
              }
              if (this.value.on && this.value.on["selection-change"]) {
                this.value.on["selection-change"](virtual.selection)
              }
            }
          }
        })
      }
      const selectionColumn = (h, { row, $index }) => {
        const isSelected = virtual.selection.indexOf(row) > -1
        const isDisabled = column.selectable ? !column.selectable(row, this.getVirtualRowIndex($index)) : false
        return h("el-checkbox", {
          class: "virtual-scroll-checkbox",
          props: {
            value: isSelected,
            disabled: isDisabled
          },
          on: {
            input: () => {
              let index = virtual.selection.indexOf(row)
              if (index == -1) {
                virtual.selection.push(row)
              } else {
                virtual.selection.splice(index, 1)
              }
              if (this.value.on && this.value.on["select"]) {
                this.value.on["select"](virtual.selection, row)
              }
              if (this.value.on && this.value.on["selection-change"]) {
                this.value.on["selection-change"](virtual.selection)
              }
            }
          },
          nativeOn: { click: (event) => event.stopPropagation() }
        })
      }
      return { selectionHeader, selectionColumn }
    },
    getVirtualStyleRule() {
      const tdBorderHeight = 1
      const rowHeight = this.value.virtual.rowHeight - tdBorderHeight;
      const styleRule = `
      #${this.tableId} .el-table__cell {
        padding: 0px !important;
      }
      #${this.tableId} .el-table__cell .cell {
        height: ${rowHeight}px !important;
        line-height: ${rowHeight}px;
      }
      #${this.tableId} .virtual-scroll-checkbox .el-checkbox__inner, 
      #${this.tableId} .virtual-scroll-checkbox .el-checkbox__inner::after {
        transition: none;
      } `
      return styleRule
    },
    getScrollWarppers() {
      const el = this.$refs.table.$el
      const warpper = el.querySelector('.el-table__body-wrapper')
      const fixedWrapper = el.querySelector(".el-table__fixed .el-table__fixed-body-wrapper")
      const rightFixedWrapper = el.querySelector(".el-table__fixed-right .el-table__fixed-body-wrapper")
      const warppers = [warpper, fixedWrapper, rightFixedWrapper].filter(v => v)
      return {
        warpper,
        warppers,
      }
    },
  }
}