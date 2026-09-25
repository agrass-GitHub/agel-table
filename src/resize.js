/**
 * @description 随着窗口变化自适应高度 
 */

export default {
  // 普通表格同样合并窗口 resize 的动画帧。
  created() {
    this._resizeFrame = null
  },
  mounted() {
    if (this.isEnable("resize")) {
      this.resizeTable()
      window.addEventListener("resize", this.onWindowResize)
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onWindowResize)
    if (this._resizeFrame !== null) window.cancelAnimationFrame(this._resizeFrame)
    this._resizeFrame = null
  },
  methods: {
    onWindowResize() {
      // 虚拟表格复用滚动调度；普通表格只保留一个待执行尺寸任务。
      if (this.isEnable('virtual')) {
        this._virtual.resize = true
        this.scheduleVirtualFrame(true, true)
      } else if (this._resizeFrame === null) {
        this._resizeFrame = window.requestAnimationFrame(() => {
          this._resizeFrame = null
          this.resizeTable()
        })
      }
    },
    resizeTable() {
      const resize = this.value.resize
      const table = this.$refs.container
      const relative = resize.relative
        ? (typeof resize.relative === 'string' ? document.querySelector(resize.relative) : resize.relative)
        : table.offsetParent
      if (relative == null) return;
      const relativeReact = relative.getBoundingClientRect()
      const tableRect = table.getBoundingClientRect()
      const offset = resize.offset && typeof resize.offset === 'function' ? resize.offset() : resize.offset
      const height = relative.offsetHeight - (offset || 0) - (tableRect.top - relativeReact.top)
      this.$set(this.value, "height", height)
    },
  }
}
