# 更新日志

## v.x.x.x

- 列查询功能
- 相同行或者相同列自动合并配置
- 单元格编辑
- 列拖动功能

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
- `修复` `补丁` 多级表头自定义 slotColum，SlotHeader 失败问题
- `修复` `补丁` 多级表头列添加添加属性 display 为 false，渲染异常
- `修复` 添加 request，getData 属性 api，方便和接口对接
- `新增` 添加 isReisze，riseze ，自适应父容器功能
- `新增` 集成分页组件
- `新增` 可配置列，可配置多级表头