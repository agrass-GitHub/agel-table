---
home: true
actionText: 起步 →
actionLink: /example/
features:
  - title: 极简的思想
    details: 面向对象, 参数集中处理, 以一个 table 对象来完成所有的操作
  - title: 高度的灵活
    details: 支持 element-ui table 组件的所有 api, slot, event，且不用担心版本升级问题
  - title: 快捷的使用
    details: 解决了 element-ui table 的潜在 bug, 集成了更方便好用的扩展功能
footer: MIT Licensed | Copyright ©agrss 
---


<!-- <ClientOnly><test-table/></ClientOnly> -->



### 如此简单

```html
<template>
  <agel-table v-model="table"></agel-table>
</template>
 
<script>
export default {
  data() {
    return {
      table: {},
    };
  },
};
</script>
```




