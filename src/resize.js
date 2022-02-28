/**
 * @description 随着窗口变化自适应高度 
 */

export default {
  mounted() {
    if (this.isEnable("resize")) {
      this.resizeTable()
      window.addEventListener("resize", this.onWindowResize)
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onWindowResize)
  },
  methods: {
    onWindowResize() {
      window.requestAnimationFrame(this.resizeTable)
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