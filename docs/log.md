---
title: 更新日志
sidebar: auto
---

# 更新日志

## v.0.3.1
- `修复` 修复分页变化调用 getData ，参数错误的问题
- `新增` 取消打包为 lib.umd.js，包直接指向 src

## v.0.3.0
- `修复` 大数据虚拟滚动的情况下，排序不支持的问题
- `修复` 大数据虚拟滚动的情况下，type selection 不支持的问题
- `优化` 插件功需配置基础对象，相关属性才会注入到 table 对象
- `新增` selectionChange 事件拦截，自动回填到 table.selection
- `新增` 组件实例由自动挂载到 table 对象转通过为 getRef 函数获取
- `优化` query 相关逻辑重做,更加纯粹
- `优化` 虚拟滚轮逻辑优化
- `新增` 添加 reisze 扩展，随着窗口变化自适应高度

## v.0.2.1
- `优化` 提交到 npm 的包忽略了 docs 文档

## v.0.2.0

- `新增` 添加了虚拟滚动，
- `修复` 修复部分 Bug
- `优化` 优化了高度设置逻辑，去掉了 resize 功能
- `优化` 重构了代码逻辑

## v.0.1.1

- `新增` slotExpand,slotColumn,slotHeader 属性可配置为 render 函数渲染

## v.0.1.0

- `修复` column api 全局配置后无法响应式更新
- `新增` columns 属性支持数组结构，同时也支持对象结构配置
- `新增` column 新增属性 mergeRow，可自动合并相同行

## v.0.0.9

- `新增` 为了更好的计算高度，page 参数添加 height 属性
- `新增` table 参数添加 immediate 属性，初始化完成自动调用 getData
- `修复` 优化 renderColumns getColumns 逻辑，修复多级表头 children 为空时显隐列的 bug
- `新增` 完善在线文档，用 vuepress 展示 api 和 例子

## v.0.0.8

- `修复` attach 参数对属性 columns page 合并失败

## v.0.0.7

- `修复` currentChange 判断不严谨误触发 pageChange

## v.0.0.1 - v.0.0.6

- `新增` 保证灵活性，添加 props 参数 attach,
- `优化` 优化 resize 事件逻辑，分页高度也包含在 heigth 里
- `优化` 用 jsx 重构 agel-column 组件，优化列渲染性能，完美解决多级表头下的 bug
- `修复` 解决在切换显示隐藏同时固定高度情况，resize 事件不正常工作
- `修复` `补丁` 解决 elemet-ui table 显示合计异常
- `修复` `补丁` 解决 elemet-ui table 列无法对齐的问题
- `修复` 解决 \$scopedSlots 没有获取到槽插而导致函数调用报错的问题
- `修复` 解决初始化获取 attrs 导致 table load 属性失效的问题
- `修复` 局部引用组件报错
- `修复` 解决 el-table 和 el-pagination 组件拥有同名事件 current-change 的冲突问题
- `新增` 可配置全局属性
- `修复` 多级表头自定义 slotColum，SlotHeader 失败问题
- `修复` 多级表头列添加添加属性 display 为 false，渲染异常
- `修复` 添加 request，getData 属性 api，方便和接口对接
- `新增` 添加 isReisze，riseze ，自适应父容器功能
- `新增` 集成分页组件
- `新增` 可配置列，可配置多级表头
