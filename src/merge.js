/**
 * @description 合并相同单元格
 */

// 绝大多数单元格的合并结果相同，共享只读数组以减少大数据量下的对象分配。
const SINGLE_CELL = Object.freeze([1, 1])
const MERGED_ROW = Object.freeze([0, 1])
const MERGED_COLUMN = Object.freeze([1, 0])

export default {
  computed: {
    mergeColumns() {
      return this.isEnable('merge') ? this.getMergeColumns() : []
    },
    MergeData() {
      return this.isEnable('merge') ? this.getMergeData() : {}
    }
  },
  methods: {
    spanMethod({ rowIndex, columnIndex }) {
      return this.MergeData[columnIndex + '_' + rowIndex]
    },
    getMergeColumns() {
      return this.flatColumns
        .map((v, i) => {
          return {
            merge: v.prop && !v.hasOwnProperty('type') && (this.value.merge.auto || v.merge),
            name: v.prop,
            index: i,
          }
        }).filter(v => v.merge)
    },
    getMergeData() {
      // 按连续相同值分段：每个单元格只读取一次响应式字段，结果与逐格比较一致。
      const mergeData = {}
      const tableData = this.value.data;
      const columns = this.mergeColumns
      const direction = this.value.merge.direction || 'vertical';
      if (direction === 'vertical') {
        columns.forEach(({ name, index }) => {
          let start = 0
          while (start < tableData.length) {
            const value = tableData[start][name]
            let end = start + 1
            while (end < tableData.length && tableData[end][name] === value) end++
            mergeData[index + '_' + start] = end - start === 1 ? SINGLE_CELL : [end - start, 1]
            for (let i = start + 1; i < end; i++) mergeData[index + '_' + i] = MERGED_ROW
            start = end
          }
        })
      } else {
        for (let i = 0; i < tableData.length; i++) {
          const row = tableData[i]
          if (direction !== 'horizontal') {
            columns.forEach(({ index }) => { mergeData[index + '_' + i] = SINGLE_CELL })
            continue
          }
          let start = 0
          while (start < columns.length) {
            const value = row[columns[start].name]
            let end = start + 1
            while (end < columns.length && row[columns[end].name] === value) end++
            mergeData[columns[start].index + '_' + i] = end - start === 1 ? SINGLE_CELL : [1, end - start]
            for (let j = start + 1; j < end; j++) mergeData[columns[j].index + '_' + i] = MERGED_COLUMN
            start = end
          }
        }
      }
      return mergeData
    },
    // 以下两个方法不再被 getMergeData 使用，保留以兼容通过组件实例调用的旧代码。
    calculateColumnIndex(data, index, nextIndex, count, maxLength) {
      // 长段合并使用迭代，避免递归深度随相同单元格数量增长。
      const columns = this.mergeColumns
      while (nextIndex < maxLength && data[columns[index].name] === data[columns[nextIndex].name]) {
        nextIndex++
        count++
      }
      return count
    },
    calculateRowIndex(data, index, nextIndex, count, name) {
      // 数万条相同值不再消耗数万层调用栈，合并结果与原来保持一致。
      while (nextIndex < data.length && data[index][name] === data[nextIndex][name]) {
        nextIndex++
        count++
      }
      return count
    }
  }
}
