/**
 * @description 创建虚拟滚动，维持大数据 table 渲染 
 */

import { orderBy } from 'element-ui/packages/table/src/util.js';

export const virtualProps = function () {
  return {
    // 是否开启
    enable: false,
    // 行高度
    rowHeight: 0,
    // 总高度
    totalHeight: 0,
    // 渲染区域高度
    renderHeight: 0,
    // 开始渲染位置
    indexStart: 0,
    // 结束渲染位置
    indexEnd: 0,
    // 可视区域渲染数量
    renderNum: 0,
    // 渲染数量偏移量
    offsetNum: 10,
    // 是否全选
    selectAll: false,
    // 容器
    warppers: [],
    // 动态渲染数据      
    data: [],
    // 排序数据
    sortData: [],
  }
}

export default {
  created() {
    const virtual = Object.assign(virtualProps(), this.value.virtual || {});
    if (this.value.virtual) {
      this.$set(this.value, 'virtual', virtual);
      this.$set(this.value, 'virtualScrollToRow', this.virtualScrollToRow);
    }
  },
  watch: {
    'value.$ref.layout.bodyHeight'(v) {
      v != null && this.createVirtualScroll();
    },
    'value.data'() {
      this.createVirtualScroll();
    }
  },
  methods: {
    // 创建虚拟滚动
    createVirtualScroll() {
      const virtual = this.getProps("virtual");
      if (!virtual || !this.$refs.table) return;

      setTimeout(() => {
        let data = this.value.data;
        let el = this.$refs.table.$el;
        let warpper = el.querySelector('.el-table__body-wrapper');
        let fixedWrapper = el.querySelector(".el-table__fixed .el-table__fixed-body-wrapper");
        let rightFixedWrapper = el.querySelector(".el-table__fixed-right .el-table__fixed-body-wrapper")
        let warppers = [warpper, fixedWrapper, rightFixedWrapper].filter(v => v);
        let rowHeight = virtual.rowHeight;
        let renderHeight = warpper.clientHeight;
        let totalHeight = data.length * rowHeight;
        let renderNum = Math.ceil(renderHeight / rowHeight) + virtual.offsetNum;
        renderNum = data.length < renderNum ? data.length : renderNum;

        if (rowHeight == 0 || !rowHeight) throw "rowHeight 不可为空";

        // 记录虚拟滚动参数
        virtual.renderHeight = renderHeight;
        virtual.rowHeight = rowHeight;
        virtual.totalHeight = totalHeight;
        virtual.renderNum = renderNum;
        virtual.indexEnd = virtual.indexStart + renderNum;
        virtual.warppers = warppers;

        // 设置 index 列函数 indexMethod
        let indexColumn = this.columns.find(v => v.type == 'index');
        if (indexColumn && indexColumn.index == undefined) {
          this.$set(indexColumn, 'index', this.getVirtualScrollIndex);
        }

        // 创建容器
        warpper.removeEventListener("scroll", this.onVirtualScroll);
        warpper.addEventListener("scroll", this.onVirtualScroll);
        warppers.forEach(el => {
          let placeholder = el.querySelector('.virtual-scroll-placeholder');
          if (placeholder) {
            placeholder.style.height = totalHeight - renderNum * rowHeight + "px";
          } else {
            placeholder = document.createElement("div");
            placeholder.setAttribute('class', 'virtual-scroll-placeholder');
            placeholder.style.height = totalHeight - renderNum * rowHeight + "px";
            el.appendChild(placeholder);
          }
        })
        // 设置数据
        this.setVirtualScrollData();
      }, 0)
    },
    // scroll event
    onVirtualScroll(e) {
      const virtual = this.getProps("virtual");
      if (!virtual) return;

      // 计算开始结束渲染位置
      let { rowHeight, renderNum, offsetNum, warppers } = virtual;
      let scrollTop = e.target.scrollTop;
      let indexStart = Math.floor((scrollTop / rowHeight) - offsetNum || 0);
      let indexEnd = indexStart + renderNum + offsetNum;
      if (indexStart < 0) indexStart = 0;
      if (indexEnd > this.value.data.length) indexEnd = this.value.data.length;
      virtual.indexStart = indexStart;
      virtual.indexEnd = indexEnd;

      // 计算容器偏移
      warppers.forEach(el => {
        let warppersBody = el.querySelector('.el-table__body');
        warppersBody.style.transform = `translateY(${indexStart * rowHeight}px)`;
      });

      this.setVirtualScrollData()
    },
    // 计算当前渲染的数据
    setVirtualScrollData() {
      const virtual = this.getProps("virtual");
      if (!virtual) return;
      let data = virtual.sortData.length > 0 ? virtual.sortData : this.value.data;
      virtual.data = data.slice(
        virtual.indexStart,
        virtual.indexEnd
      )
    },
    // 滚动到指定行
    virtualScrollToRow(indexStart) {
      const virtual = this.getProps("virtual");
      indexStart = indexStart - 1 < 0 ? 0 : indexStart - 1;
      virtual.warppers.forEach(el => {
        el.scrollTop = indexStart * virtual.rowHeight;
      });
    },
    // 获取当前 index 位置
    getVirtualScrollIndex(index) {
      const virtual = this.getProps("virtual");
      return virtual ? index + virtual.indexStart + 1 : index + 1;
    },
    // 获取排序后的数据
    getVirtualSortData() {
      const virtual = this.getProps("virtual");
      let sortingColumn = this.getRef().store._data.states.sortingColumn || {};
      virtual.sortData = orderBy(this.value.data, sortingColumn.property, sortingColumn.order, sortingColumn.sortMethod, sortingColumn.sortBy);
      this.setVirtualScrollData();
    },
    // 获取自定义 selection checkbox Slot
    getVirtualSelectionSlot() {
      const virtual = this.getProps("virtual");
      const isSelected = (row) => this.value.selection.indexOf(row) > -1;
      const isDisabled = (column, row, index) => column.selectable ? !column.selectable.call(null, row, index) : false
      const slotHeader = (h, { column }) => {
        return h("el-checkbox", {
          class: "virtual-scroll-checkbox",
          props: {
            value: virtual.selectAll,
            disabled: this.value.data && this.value.data.length === 0,
            indeterminate: this.value.selection.length > 0 && !virtual.selectAll,
          },
          on: {
            input: () => {
              virtual.selectAll = !virtual.selectAll;
              this.value.selection = virtual.selectAll
                ? this.value.data.filter((row, index) => !isDisabled(column, row, index))
                : [];
              this.selectionChange(this.value.selection);
              if (this.value.on && this.value.on["select-all"]) {
                this.value.on["select-all"](this.value.selection);
              }
            }
          }
        })
      };
      const slotColumn = (h, { row, column, $index }) => {
        return h("el-checkbox", {
          class: "virtual-scroll-checkbox",
          props: {
            value: isSelected(row),
            disabled: isDisabled(column, row, $index),
          },
          on: {
            input: () => {
              let index = this.value.selection.indexOf(row);
              if (index == -1) {
                this.value.selection.push(row);
              } else {
                this.value.selection.splice(index, 1)
              }
              this.selectionChange(this.value.selection);
              if (this.value.on && this.value.on["select"]) {
                this.value.on["select"](this.value.selection, row);
              }
            }
          },
          nativeOn: { click: (event) => event.stopPropagation() }
        })

        // return <el-checkbox
        //   class="virtual-scroll-checkbox"
        //   value={isSelected(row)}
        //   disabled={isDisabled(column, row, $index)}
        //   nativeOn-click={(event) => event.stopPropagation()}
        //   on-input={() => {
        //     let index = this.value.selection.indexOf(row);
        //     if (index == -1) {
        //       this.value.selection.push(row);
        //     } else {
        //       this.value.selection.splice(index, 1)
        //     }
        //     this.selectionChange(this.value.selection);
        //     if (this.value.on && this.value.on["select"]) {
        //       this.value.on["select"](this.value.selection, row);
        //     }
        //   }} />;
      };
      return { slotHeader, slotColumn }
    }
  }
}