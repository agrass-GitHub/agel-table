# agel-table | 使 element-ui table 组件更简单

[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg)](https://opensource.org/licenses/mit-license.php)
[![npm](https://img.shields.io/npm/v/agel-table.svg)](https://www.npmjs.com/package/agel-table)
[![download](https://img.shields.io/npm/dt/agel-table)](https://npmcharts.com/compare/agel-table?minimal=true)

## 文档

- [官网 - 使用文档](https://agrass-github.github.io/agel-table/)
- [更新日志](./CHANGELOG.md)

## 0.3.79 性能改进

虚拟滚动保留原有配置和 Element UI 样式。滚动事件按帧合并，窗口有上下各 6 行缓冲；缓冲尚够用时复用可见数据，不主动调用 `doLayout()`。全量数据不会在每次滚动时重新收集响应式依赖，选择状态使用 Set 查询。

在模拟 320px 视口、32px 行高、10 万行数据的测试中，同帧 100 次滚动只更新一次窗口，主表渲染不超过 23 行。这是操作计数测试，不是浏览器帧率或耗时提升比例。虚拟模式仍需配置固定 `rowHeight`，可变行高、树形展开、跨窗口合并不在支持范围内。

## 本地验证

使用 Node.js 18+ 运行测试，Vue 2.6.14 作为库内基线；消费项目另行验证 Vue 2.7.16。开发依赖使用 pnpm 锁定，运行时没有新增依赖。

```sh
npx pnpm@9.12.3 install --frozen-lockfile
npm run lint
npm test
# Vue CLI 3 / Webpack 4 在 Node.js 18+ 下需要此兼容选项
NODE_OPTIONS=--openssl-legacy-provider npm run build
NODE_OPTIONS=--openssl-legacy-provider npm run builddocs
npm pack --dry-run
```

发布前先运行上述检查，再执行 `npm publish --registry=https://registry.npmjs.org/`。`prepublishOnly` 会再次执行 lint 和测试；包内只包含源码、构建产物和公开说明。测试依赖中的 `agel-table-legacy` 固定为 0.3.78，用于新旧 DOM/CSS 对比，不进入发布包或运行时依赖。

该组件适用于 vue2.x ，vue3.x 请转自 [element-plus-crx](https://github.com/agrass-GitHub/element-plus-crx)。

## 特性

该组件的思想就是以一个 table 对象来做所有的操作，哪怕页上多个列表也不用在 data 定义一堆 data1,data2,loading1,loading2 ... 等变量，更加简单明了，适用于 vue2+elementUI。

- 保持灵活性，极简的思想，更少的代码，更多的功能，更快速的开发
- 支持 element-ui table 组件的所有 api, slot, event, method
- 纯数据配置
- 集成分页组件
- 菜单列
- 动态显隐列
- 数据代理
- 自动合并相同行
- 虚拟滚动支持大数据渲染 10w+
- 跟随容器大小自适应高度

## 安装使用

`npm install agel-table --save`

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
