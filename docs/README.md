---
home: true
actionText: 起步 →
actionLink: /example/
features:
  - title: 极简的思想
    details: 面向对象, 参数集中处理, 以一个 table 对象来完成所有的操作
  - title: 高度的灵活
    details: 支持 element-ui table 组件的所有 api, slot, event
  - title: 扩展功能
    details: 虚拟滚动，自适应，集成分页，自动合并单元格等等
footer: MIT Licensed | Copyright ©agrss 
---



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




