# agel-table

[![npm version](https://img.shields.io/npm/v/agel-table)](https://www.npmjs.com/package/agel-table)
[![npm downloads](https://img.shields.io/npm/dm/agel-table)](https://www.npmjs.com/package/agel-table)
[![license](https://img.shields.io/npm/l/agel-table)](./LICENSE)

基于 Vue 2 和 Element UI 2 的表格封装。将表格数据、列、查询、分页和扩展行为集中在一个配置对象中，同时保留 Element UI 表格的常用属性、事件和实例方法。

适合已有 Vue 2 + Element UI 项目，需要复用表格配置、服务端分页、操作列、单元格合并、容器高度适配或固定行高虚拟滚动的场景。

## 主要能力

- 使用一个响应式对象声明表格数据和列配置。
- 通过 `request(query, done, fail)` 接入服务端数据、排序和分页。
- 支持嵌套列、自定义单元格/表头插槽、动态列显隐和操作列。
- 可配置纵向或横向相同值合并，以及随容器尺寸变化的表格高度。
- 固定行高虚拟滚动支持大数据列表，并保留 Element UI 的表格、列和复选框渲染。

虚拟模式需要固定行高；树形数据、表格筛选、行展开、单元格合并和可变行高不属于虚拟滚动支持范围。完整说明见[使用指南](https://agrass-github.github.io/agel-table/example.html)和 [API 参考](https://agrass-github.github.io/agel-table/api.html)。

## 环境要求

- Vue 2
- Element UI 2

本库使用宿主项目已安装的 Vue 与 Element UI，不会替项目注册 Element UI 样式。Vue 3 项目请使用 [element-plus-crx](https://github.com/agrass-GitHub/element-plus-crx)。

## 安装

```sh
npm install agel-table
```

## 快速开始

在应用入口注册 Element UI 和 agel-table：

```js
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import agelTable from 'agel-table'

Vue.use(ElementUI)
Vue.use(agelTable, {
  table: {
    border: true
  }
})
```

在页面中通过一个对象配置表格：

```vue
<template>
  <agel-table v-model="table" />
</template>

<script>
export default {
  data() {
    return {
      table: {
        height: 320,
        columns: [
          { prop: 'name', label: '姓名', minWidth: 120 },
          { prop: 'status', label: '状态', width: 100 }
        ],
        data: [
          { name: '张三', status: '正常' },
          { name: '李四', status: '待处理' }
        ]
      }
    }
  }
}
</script>
```

配置说明、服务端分页和虚拟滚动示例见[使用指南](https://agrass-github.github.io/agel-table/example.html)；选项、事件与方法见 [API 参考](https://agrass-github.github.io/agel-table/api.html)。

## 文档与变更

- [在线文档](https://agrass-github.github.io/agel-table/)
- [更新日志](./CHANGELOG.md)
- [GitHub 仓库](https://github.com/agrass-GitHub/agel-table)

## 许可证

[MIT](./LICENSE)
