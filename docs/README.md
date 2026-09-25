---
home: true
heroText: agel-table
tagline: 面向 Vue 2 与 Element UI 2 的声明式表格组件
actionText: 开始使用
actionLink: /example.html
features:
  - title: 配置集中
    details: 用一个响应式 table 对象管理数据、列、查询和分页状态。
  - title: 保留 Element UI 体验
    details: 使用原生表格与列组件，扩展插槽、操作列和常用实例方法。
  - title: 面向大数据列表
    details: 固定行高虚拟滚动只渲染视口附近的行，并同步滚动和尺寸变化。
footer: MIT Licensed | Copyright © agrass
---

## 快速开始

安装并注册组件：

```sh
npm install agel-table
```

```js
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import agelTable from 'agel-table'

Vue.use(ElementUI)
Vue.use(agelTable)
```

用一个对象声明列和数据：

```vue
<template>
  <agel-table v-model="table" />
</template>

<script>
export default {
  data() {
    return {
      table: {
        border: true,
        columns: [{ prop: 'name', label: '姓名' }],
        data: [{ name: '张三' }, { name: '李四' }]
      }
    }
  }
}
</script>
```

[阅读使用指南 →](/example.html)
