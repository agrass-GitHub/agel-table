# agel-table | 使 element-ui table 组件更简单、好用

### 功能

- 支持 element-ui table 组件的所有 api 和 slot
- 更少的代码量，更简单的思想，更快的开发速度
- 扩展功能

### 简单用法

```html
<template>
  <agel-table v-model="table">
    <template v-slot:nameHeader>
      <span>自定义表头</span>
    </template>
    <template v-slot:name>
      <el-button size="mini">自定义列</el-button>
    </template>
  </agel-table>
</template>
<script>
  export default {
    data() {
      return {
        table: {
          isResize: true,
          isPage: true,
          showSummary: true,
          data: [],
          columns: [
            { label: '姓名', prop: 'name' },
            { label: '手机', prop: 'phone' },
            {
              label: '简介',
              prop: 'name',
              minWidth: 300,
              display: true,
              sortable: true,
              slot: true,
              slotHeader: true
              // .... other element-ui column attrs
            }
          ],
          on: {
            sortChange({ column, prop, order }) {
              console.log({ column, prop, order });
            }
            // .... other element-ui table events
          }
          // .... other element-ui table attrs
        }
      };
    }
  };
</script>
```

## 相关链接

- [element-ui table 组件](https://element.eleme.cn/#/zh-CN/component/table)
