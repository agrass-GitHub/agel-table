/**
 * @description 创建虚拟滚动，维持大数据 table 渲染 
 */
import { orderBy } from 'element-ui/packages/table/src/util.js'

export default {
  data() {
    return {
      virtualScroll: {
        virtualData: [],
        renderData: [],
        startIndex: 0,
        endIndex: 0,
        offsetNum: 3,
        resizeState: null,
        selection: [],
      }
    }
  },
  mounted() {
    if (this.isEnable('virtual')) {
      this.virtualScroll.resizeState = this.$refs.table.resizeState
      const { warpper } = this.getScrollWarppers();
      warpper.addEventListener("scroll", this.onVirtualScroll);
      this.refreshVirtualData()
    }
  },
  watch: {
    "virtualScroll.resizeState.height"(v) {
      v && this.updateRenderData()
    },
    'value.data'(oldv, newv) {
      if (!this.isEnable("virtual")) return
      if (oldv && newv && oldv.length === newv.length) return
      this.virtualScroll.selection = []
      this.refreshVirtualData();
    }
  },
  methods: {
    updateRenderData() {
      const virtual = this.virtualScroll
      // 计算开始结束渲染位置
      const { offsetNum, virtualData } = virtual
      const { warpper, warppers } = this.getScrollWarppers();
      const rowHeight = this.value.virtual.rowHeight;
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
      const isSort = this.columns.findIndex(v => v.sortable == 'custom-by-virtual') !== -1
      const sortingColumn = this.$refs.table.store._data.states.sortingColumn
      if (isSort && sortingColumn) {
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
      this.updateRenderData()
    },
    onVirtualScroll() {
      window.requestAnimationFrame(this.updateRenderData)
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
    // 滚动到指定行
    virtualScrollToRow(index) {
      const { warppers } = this.getScrollWarppers()
      index = index - 1 < 0 ? 0 : index - 1
      warppers.forEach(el => {
        el.scrollTop = index * this.value.virtual.rowHeight
      })
    },
    // 对列特殊处理
    handleVirtualScrollColumn(column) {
      column['show-overflow-tooltip'] = true;
      if (column.sortable === true) {
        column.sortable = "custom-by-virtual"
      }
      if (column.type === "selection") {
        const { selectionHeader, selectionColumn } = this.getVirtualSelectionSlot(column)
        column.label = selectionHeader
        column.slot = selectionColumn
        column.type = undefined
      }
      if (column.type === "index") {
        const indexMethod = column.index
        column.index = (v) => {
          const index = this.getVirtualScrollIndex(v);
          return indexMethod ? indexMethod(index) : index + 1
        }
      }
    },
    // 获取虚拟滚动中正确的 rowIndex
    getVirtualScrollIndex(index) {
      return this.virtualScroll.startIndex + index
    },
    // 获取自定义 selection checkbox Slot
    getVirtualSelectionSlot(column) {
      const virtual = this.virtualScroll
      const h = this.$createElement
      const isSelected = (row) => virtual.selection.indexOf(row) > -1
      const isDisabled = (row, index) => column.selectable ? !column.selectable.call(null, row, index) : false

      const selectionHeader = () => {
        const checkData = virtual.virtualData.filter((row, index) => !isDisabled(row, index))
        const isSelectAll = checkData.length > 0 && virtual.selection.length === checkData.length
        return h("el-checkbox", {
          class: "virtual-scroll-checkbox",
          props: {
            value: isSelectAll,
            disabled: checkData.length === 0,
            indeterminate: virtual.selection.length > 0 && !isSelectAll,
          },
          on: {
            input: (v) => {
              virtual.selection = v ? checkData : []
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
      const selectionColumn = ({ row, $index }) => {
        return h("el-checkbox", {
          class: "virtual-scroll-checkbox",
          props: {
            value: isSelected(row),
            disabled: isDisabled(row, $index),
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
    }
  }
}