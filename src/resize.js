/**
 * @description 随着窗口变化自适应高度 
 */


 function getUnderEleHeight(ele, relative) {
  let height = 0;
  while (ele !== relative) {
    if (ele.nextSibling) {
      const style = getComputedStyle(ele.nextSibling);
      if (style.position == 'absolute') return
      height += ele.nextSibling.offsetHeight
    }
    ele = ele.nextSibling || ele.parentNode
  }
  return height
}

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
      const relative = resize.relative ? document.querySelector(resize.relative) : document.documentElement
      const relativeReact = relative.getBoundingClientRect()
      const tableRect = this.$refs.container.getBoundingClientRect()
      const offset = resize.offset || 0
      // const calcOffset = getUnderEleHeight(this.$refs.container, relative)
      const height = relative.offsetHeight - offset - (tableRect.top - relativeReact.top)
      this.$set(this.value, "height", height)
    },
  }
}