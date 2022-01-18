/**
 * @description 合并相同单元格
 */

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
    getFlatColumns(columns) {
      return columns.reduce((result, v) => {
        return result.concat(Array.isArray(v.children) && v.children.length > 0 ? this.getFlatColumns(v.children) : v);
      }, []);
    },
    getMergeColumns() {
      return this.getFlatColumns(this.columns || [])
        .map((v, i) => {
          return {
            merge: v.prop && !v.hasOwnProperty('type') && (this.value.merge.auto || v.merge),
            name: v.prop,
            index: i,
          }
        }).filter(v => v.merge)
    },
    getMergeData() {
      // 遍历表格中需要合并的所有单元格
      const mergeData = {}
      const tableData = this.value.data;
      const direction = this.value.merge.direction || 'vertical';
      for (let i = 0; i < tableData.length; i++) {
        for (let j = 0; j < this.mergeColumns.length; j++) {
          // 初始化行、列坐标信息
          let rowIndex = 1
          let columnIndex = 1

          if (direction === 'vertical') {
            // 比较纵坐标上方的第一个元素
            if (i > 0 && tableData[i][this.mergeColumns[j]['name']] === tableData[i - 1][this.mergeColumns[j]['name']]) {
              rowIndex = 0
            }
            // 比较纵坐标下方元素
            if (rowIndex > 0) {
              rowIndex = this.calculateRowIndex(tableData, i, i + 1, 1, this.mergeColumns[j]['name'])
            }
          }

          if (direction === 'horizontal') {
            // 比较横坐标左方的第一个元素
            if (j > 0 && tableData[i][this.mergeColumns[j]['name']] === tableData[i][this.mergeColumns[j - 1]['name']]) {
              columnIndex = 0
            }
            // 比较横坐标右方元素
            if (columnIndex > 0) {
              columnIndex = this.calculateColumnIndex(tableData[i], j, j + 1, 1, this.mergeColumns.length)
            }
          }

          const key = this.mergeColumns[j]['index'] + '_' + i
          mergeData[key] = [rowIndex, columnIndex]
        }
      }
      return mergeData
    },
    /**
     * 计算列坐标信息
     * @param data 单元格所在行数据
     * @param index 当前下标
     * @param nextIndex 下一个元素坐标
     * @param count 相同内容的数量
     * @param maxLength 当前行的列总数
     */
    calculateColumnIndex(data, index, nextIndex, count, maxLength) {
      // 比较当前单元格中的数据与同一行之后的单元格是否相同
      if (nextIndex < maxLength && data[this.mergeColumns[index]['name']] === data[this.mergeColumns[nextIndex]['name']]) {
        return this.calculateColumnIndex(data, index, ++nextIndex, ++count, maxLength)
      }
      return count
    },
    /**
     * 计算行坐标信息
     * @param data 单元格所在行数据
     * @param index 当前下标
     * @param nextIndex 下一个元素坐标
     * @param count 相同内容的数量
     * @param name 数据的key
     */
    calculateRowIndex(data, index, nextIndex, count, name) {
      // 比较当前单元格中的数据与同一列之后的单元格是否相同
      if (nextIndex < data.length && data[index][name] === data[nextIndex][name]) {
        return this.calculateRowIndex(data, index, ++nextIndex, ++count, name)
      }
      return count
    }
  }
}