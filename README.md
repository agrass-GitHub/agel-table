# agel-table | 使 element-ui table 组件更简单

[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg)](https://opensource.org/licenses/mit-license.php)
[![npm](https://img.shields.io/npm/v/agel-table.svg)](https://www.npmjs.com/package/agel-table)
[![download](https://img.shields.io/npm/dt/agel-table)](https://npmcharts.com/compare/agel-table?minimal=true)

## 文档

<!-- - [官网 - 使用文档 ](https://agrass-github.github.io/agel-table/)，github 提供服务 -->
<!-- - [官网 - 使用文档](https://agrass.gitee.io/agel-table/)，gitee 提供服务，国内访问速度较快 -->
等待中

## 特性

该组件的思想就是以一个 table 对象来做所有的操作，哪怕页上多个列表也不用在 data 定义一堆 data1,data2,loading1,loading2 ... 等变量，更加简单明了。

- 保持灵活性，极简的思想，更少的代码，更多的功能，更快速的开发
- 支持 element-ui table 组件的所有 api, slot, event, method
- 解决 element-ui table [一些潜在问题](https://agrass.gitee.io/agel-table/sum.html#element-ui-table-一些潜在问题)
- 添加额外的[扩展功能](https://agrass.gitee.io/agel-table/guide.html)
  - 纯数据配置
  - 动态显隐列
  - 集成分页组件
  - 自适应容器高度
  - 数据代理
  - 自动合并相同行

# 使用

## 安装

`npm install agel-table --save`

## 简单使用

```html
<template>
  <agel-table v-model="table"> </agel-table>
</template>
<script>
  export default {
    data() {
      return {
        table: {
          // ... All attrs
          data: [],
          columns: [{ label: "姓名", prop: "name" }],
          page: {enable:true},
          on: {}
        }
      };
    }
  };
</script>
```

## 全局配置

```js
import agelTable from 'agel-table';

const config = {
  name: 'agel-table', // component name,use() 生效
  table: {}, // table attrs
  column: {} // column attrs
  page: {}, // page attrs
}

Vue.use(agelTable, config);

// or

Vue.prototype.$agelTableConfig = config;
Vue.component('agel-table', agelTable);
```

## 覆盖策略

::: tip

- 请按需配置进行覆盖，谨慎覆盖内置属性
- 可在全局灵活的为 table 自定义配置你需要的属性或者方