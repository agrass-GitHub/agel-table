# agel-table | 使 element-ui table 组件更简单

[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg)](https://opensource.org/licenses/mit-license.php)
[![npm](https://img.shields.io/npm/v/agel-table.svg)](https://www.npmjs.com/package/agel-table)
[![download](https://img.shields.io/npm/dt/agel-table)](https://npmcharts.com/compare/agel-table?minimal=true)

## 文档

- [官网 - 使用文档 ](https://agrass-github.github.io/agel-table/)（github 提供服务）
- [官网 - 使用文档](https://agrass.gitee.io/agel-table/) （gitee 提供服务，国内较快）


## 特性

该组件的思想就是以一个 table 对象来做所有的操作，哪怕页上多个列表也不用在 data 定义一堆 data1,data2,loading1,loading2 ... 等变量，更加简单明了。

- 保持灵活性，极简的思想，更少的代码，更多的功能，更快速的开发
- 支持 element-ui table 组件的所有 api, slot, event, method
- 解决 element-ui table [一些潜在问题](https://agrass.gitee.io/agel-table/sum.html#element-ui-table-一些潜在问题)
- 添加额外的[扩展功能](https://agrass.gitee.io/agel-table/guide.html)
  - 纯数据配置
  - 动态显隐列
  - 集成分页组件
  - 数据代理
  - 自动合并相同行
  - 虚拟滚动支持大数据渲染 10w+


## 安装使用

`cnpm install agel-table --save`


### 如此简单

```html
<template>
  <agel-table v-model="table"></agel-table>
</template>
 
<script>
export default {
  data() {
    return {
      table: {
        // ...
      },
    };
  },
};
</script>
```
