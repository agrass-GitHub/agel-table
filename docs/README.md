---
home: true
actionText: 起步 →
actionLink: /guide/
features:
  - title: 极简的思想
    details: 面向对象, 参数集中处理, 以一个 table 对象来完成所有的操作
  - title: 高度的灵活
    details: 支持 element-ui table 组件的所有 api, slot, event
  - title: 快捷的使用
    details: 解决了 element-ui table 的潜在 bug, 集成了更方便好用的扩展
footer: MIT Licensed | Copyright © 2019-present
---

### 如此简单

```html
<template>
  <agel-table v-model="table"> </agel-table>
</template>
<script>
  export default {
    data() {
      return {
        table: {}
      };
    }
  };
</script>
```


::: run {title: '基础 table'}
```html
<template>
  <div style="height:500px">
  <agel-table v-model="table"></agel-table>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        table: {
          border:true,
          columns:[
            {label:"基础表格",prop:"base",width:100},
            {label:"简单使用",prop:"use",minWidth:100},
          ],
          data:[
            {base:"基础表格",use:"简单使用"},
            {base:"基础表格",use:"简单使用"},
          ]
        }
      };
    }
  };
</script>
` ` `