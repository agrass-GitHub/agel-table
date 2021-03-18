/**
 * @description 创建虚拟滚动，维持大数据 table 渲染
 * todo  1.checkbox  列 
 */


const props = function () {
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
    // 容器
    warppers: [],
    // 动态渲染数据      
    data: [],
  }
}


export default {
  created() {
    const virtual = Object.assign(props(), this.value.virtual || {});
    this.$set(this.value, 'virtual', virtual);
    this.$set(this.value, 'virtualScrollToRow', this.virtualScrollToRow);
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
      if (!this.value.virtual.enable || !this.$refs.table) return;
      setTimeout(() => {
        let data = this.value.data;
        let el = this.$refs.table.$el;
        let warpper = el.querySelector('.el-table__body-wrapper');
        let fixedWrapper = el.querySelector(".el-table__fixed .el-table__fixed-body-wrapper");
        let rightFixedWrapper = el.querySelector(".el-table__fixed-right .el-table__fixed-body-wrapper")
        let warppers = [warpper, fixedWrapper, rightFixedWrapper].filter(v => v);
        let rowHeight = this.value.virtual.rowHeight;
        let renderHeight = warpper.clientHeight;
        let totalHeight = data.length * rowHeight;
        let renderNum = Math.ceil(renderHeight / rowHeight) + this.value.virtual.offsetNum;
        renderNum = data.length < renderNum ? data.length : renderNum;

        if (rowHeight == 0 || !rowHeight) throw "rowHeight 不可为空";

        // 记录虚拟滚动参数
        this.value.virtual.renderHeight = renderHeight;
        this.value.virtual.rowHeight = rowHeight;
        this.value.virtual.totalHeight = totalHeight;
        this.value.virtual.renderNum = renderNum;
        this.value.virtual.indexEnd = this.value.virtual.indexStart + renderNum;
        this.value.virtual.warppers = warppers;

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
      if (!this.value.virtual.enable) return;
      let { rowHeight, renderNum, warppers } = this.value.virtual;
      let scrollTop = e.target.scrollTop;

      // 计算开始结束渲染位置
      let max = this.value.data.length;
      let indexStart = Math.floor((scrollTop / rowHeight) - 2 || 0);
      if (indexStart < 0) indexStart = 0;
      if (indexStart > max - renderNum) indexStart = max - renderNum;
      this.value.virtual.indexStart = indexStart;
      this.value.virtual.indexEnd = indexStart + renderNum;

      // 计算容器偏移
      warppers.forEach(el => {
        let warppersBody = el.querySelector('.el-table__body');
        warppersBody.style.transform = `translateY(${indexStart * rowHeight}px)`;
      });

      this.setVirtualScrollData()
    },
    // 计算当前渲染的数据
    setVirtualScrollData() {
      if (!this.value.virtual.enable) return;
      this.value.virtual.data = this.value.data.slice(
        this.value.virtual.indexStart,
        this.value.virtual.indexEnd
      )
    },
    // 滚动到指定行
    virtualScrollToRow(indexStart) {
      let { rowHeight } = this.value.virtual;
      indexStart = indexStart - 1 < 0 ? 0 : indexStart - 1;
      this.value.virtual.warppers.forEach(el => {
        el.scrollTop = indexStart * rowHeight;
      });
    },
    // 获取当前 index 位置
    getVirtualScrollIndex(index) {
      return this.value.virtual.enable ? index + this.value.virtual.indexStart + 1 : index + 1;
    },
  }
}