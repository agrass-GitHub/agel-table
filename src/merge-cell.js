/**
 * @description 合并相同单元格
 */

const props = function () {
  return {
    // 是否开启
    enable: false,
    // 是否自动合并相同单元格
    auto: false,
    // 合并方向  horizontal  vertical 暂支持纵向
    direction: "vertical",
  }
}

export default {
  created() {
    let merge = Object.assign(props(), this.value.merge || {})
    this.extendApi('merge', merge)
    if (this.value.spanMethod === undefined && merge.enable) {
      this.$set(this.value, 'spanMethod', this.spanMethod);
    }
  },
  computed: {
    flatColumns() {
      return this.getFlatColumns(this.columns || []);
    },
    mergeSpans() {
      return this.getMergeSpans();
    },
  },
  methods: {
    // 合并函数
    spanMethod({ rowIndex, columnIndex }) {
      if (!this.value.merge.enable) return;
      if (this.mergeSpans.length == 0) return;
      return this.mergeSpans[rowIndex][this.flatColumns[columnIndex].prop];
    },
    // 把数组扩展成一维数组
    getFlatColumns(columns) {
      if (!this.value.merge.enable) return [];
      return columns.reduce((result, v) => {
        return result.concat(
          Array.isArray(v.children) && v.children.length > 0
            ? this.getFlatColumns(v.children)
            : v
        );
      }, []);
    },
    // 拿到要合并的列 key
    getMergeKeys() {
      if (!this.value.merge.enable) return [];
      // 树形数据不支持合并
      if (this.value.rowKey) return [];
      return this.flatColumns
        .filter((v) => {
          let ismerge = v.merge === undefined ? this.value.merge.auto : v.merge;
          return v.prop && ismerge && !v.type;
        })
        .map((v) => v.prop);
    },
    // 拿到要合并列 colspan rowspan
    getMergeSpans() {
      if (!this.value.merge.enable) return [];
      let spanArr = [];
      let spanIndex = -1;
      let mergeKeys = this.getMergeKeys();
      mergeKeys.forEach((k) => {
        this.value.data.forEach((cur, i) => {
          let next = this.value.data[i + 1];
          let prev = this.value.data[i - 1];
          if (spanArr[i] == undefined) spanArr[i] = {};
          spanArr[i][k] = { rowspan: 1, colspan: 1 };
          if (next && cur[k] == next[k]) {
            if (spanIndex == -1) {
              spanIndex = i;
              spanArr[spanIndex][k].rowspan++;
            } else {
              spanArr[spanIndex][k].rowspan++;
              spanArr[i][k].rowspan = 0;
            }
          } else {
            spanIndex = -1;
            spanArr[i][k].rowspan = prev && prev[k] == cur[k] ? 0 : 1;
          }
        });
      });
      return spanArr;
    },
  }
}