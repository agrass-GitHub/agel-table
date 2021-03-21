/**
 * @description 随着窗口变化自适应高度 
 */

const resizeProps = function () {
  return {
    // 是否开启
    enable: false,
    // 偏移位置
    offset: 0,
  }
}

export default {
  created() {
    const resize = Object.assign(resizeProps(), this.value.resize || {});
    if (this.value.resize) {
      this.$set(this.value, 'resize', resize);
      this.$set(this.value, 'resizeTable', this.resizeTable);
    }
  },
  mounted() {
    let resize = this.getProps("resize");
    if (resize) {
      this.resizeTable();
      window.addEventListener("resize", this.resizeTable);
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeTable);
  },
  methods: {
    resizeTable() {
      let resize = this.getProps("resize");
      let container = this.$refs.container;
      let height = container.offsetParent.clientHeight - container.offsetTop - resize.offset;
      this.$set(this.value, "height", height);
    },
  }
}