# agel-table | 使 element-ui table 组件更简单

[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg)](https://opensource.org/licenses/mit-license.php)
[![npm](https://img.shields.io/npm/v/agel-table.svg)](https://www.npmjs.com/package/agel-table)
[![download](https://img.shields.io/npm/dt/agel-table)](https://npmcharts.com/compare/agel-table?minimal=true)

## 特性

该组件的思想就是以一个 table 对象来做所有的操作，哪怕页上多个列表也不用在 data 定义一堆 data1,data2,loading1,loading2 ... 等变量，更加简单明了。

- 保持灵活性，极简的思想，更少的代码，更多的功能，更快速的开发

- 支持 element-ui table 组件的所有 api, slot, event, method

- 添加额外的扩展功能

- 解决 element-ui table [一些潜在问题](/sum.md#element-ui-table-一些潜在问题)

# 使用

## 安装

`npm install agel-table --save`

## 全局注册

```js
import agelTable from 'agel-table';

const conigf = {
  name: 'agel-table', // component name,use() 生效
  table: {}, // table attrs
  column: {} // column attrs
  page: {}, // page attrs
}

Vue.use(agelTable, conigf);

// or

Vue.prototype.$agelTableConfig = config;
Vue.component('agel-table', agelTable);
```

## 局部注册

```html
<template>
  <agel-table v-model="table"> </agel-table>
</template>
<script>
  import agelTable from 'agel-table';
  export default {
    components: {
      agelTable
    },
    data() {
      return {
        table: {
          // ... All attrs
          data: [],
          columns: [{ label: '姓名', prop: 'name' }]
        }
      };
    }
  };
</script>
```
