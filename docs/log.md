---
title: 更新日志
sidebar: auto
---


# 更新日志

## v.0.3.77 （ #2023-03-03 ）
- `new` table loading 时禁用分页

## v.0.3.76 （ #2022-10-27 ）
- `bug` 修复修改 page.currentPage 后调用 getData，query 没有及时更新的问题
- `new` getData 函数新增 currentPage/pageSize ，用于查询重置分页


## v.0.3.74 （ #2022-09-18 ）
- `new` 新增支持 empty 插槽
- `new` 新增 slotEmpty 全局配置，可设置全局默认 empty 插槽


## v.0.3.73
- `bug` 修复 resize.relative 获取为 null 时报错
- `bug` 修复 menu.onDel 绑定事件错误的问题


## v.0.3.71
- `bug` 修复虚拟滚动当 data.length 相同刷新列表失败的问题 

## v.0.3.7

- `bug` 修复嵌套table中无法自定义父级的头 [issues[3]](https://github.com/agrass-GitHub/agel-table/issues/3)
- `bug` 修复使用 render 函数在横向滚动时会重复调用的问题
- `bug` 修复虚拟滚动 data 变化时 selection列 全选状态异常的问题
- `bug` 修复虚拟滚动在多级表头下，selection 和 排序 异常的问题
- `new` 新增 element-loading 配置
- `new` 新增 table.getCol 方法
- `new` 新增 table.menu 菜单列功能
- `new` 新增 column.display 支持函数类型配置
- `new` 新增 merge.direction horizontal 支持横向合并单元格
- `new` 新增 table.request 可单独使用，不再依赖 getData 函数
- `new` 新增 resize.relative 参照物，新增 resize.offset 支持函数配置
- `new` 优化了表格在自定义插槽时的渲染性能
- `new` 优化了虚拟滚动性能，强制设置虚拟滚动行高，新增 getVirtualRowIndex 方法
- `change` 移除了 selection 属性
- `change` 重写了文档

## v.0.3.6

- `bug` 虚拟滚动数据刷新时重置滚动条
- `new` 新增虚拟滚动开启时，兼容 sortable:true 排序功能
- `new` 新增虚拟滚动开启时，兼容 type:selection 多选功能

## v.0.3.5

- `bug` query 的 currentPage 默认回填为空

## v.0.3.4
- `bug` query 默认 orderColumn,order 被覆盖为空
- `bug` table 隐藏时 resize 获取高度报错
- `bug` table request 函数报错没有 error 提示
- `新增` defaultSort 属性将默认回填到 query 中
- `新增` table request 支持异步函数写法


## v.0.3.3
- `bug` 修复因未安装 stylus-loader 导致引入报错的问题

## v.0.3.2
- `bug` 修复虚拟滚动情况下，高度变化显示错误的问题

## v.0.3.1
- `bug` 修复分页变化调用 getData ，参数错误的问题
- `新增` 取消打包为 lib.umd.js，包直接指向 src

## v.0.3.0
- `bug` 大数据虚拟滚动的情况下，排序不支持的问题
- `bug` 大数据虚拟滚动的情况下，type selection 不支持的问题
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
- `bug` 修复部分 Bug
- `优化` 重构了代码逻辑

## v.0.1.1

- `新增` slotExpand,slotColumn,slotHeader 属性可配置为 render 函数渲染

## v.0.1.0

- `bug` column api 全局配置后无法响应式更新
- `新增` columns 属性支持数组结构，同时也支持对象结构配置
- `新增` column 新增属性 mergeRow，可自动合并相同行

## v.0.0.9

- `新增` 为了更好的计算高度，page 参数添加 height 属性
- `新增` table 参数添加 immediate 属性，初始化完成自动调用 getData
- `bug` 优化 renderColumns getColumns 逻辑，修复多级表头 children 为空时显隐列的 bug
- `新增` 完善在线文档，用 vuepress 展示 api 和 例子

## v.0.0.8

- `bug` attach 参数对属性 columns page 合并失败

## v.0.0.7

- `bug` currentChange 判断不严谨误触发 pageChange

## v.0.0.1 - v.0.0.6

- `新增` 可配置全局属性
- `新增` 添加 isReisze，riseze ，自适应父容器功能
- `新增` 集成分页组件
- `新增` 可配置列，可配置多级表头
- `新增` 保证灵活性，添加 props 参数 attach,
- `优化` 优化 resize 事件逻辑，分页高度也包含在 heigth 里
- `优化` 用 jsx 重构 agel-column 组件，优化列渲染性能，完美解决多级表头下的 bug
- `bug` 解决在切换显示隐藏同时固定高度情况，resize 事件不正常工作
- `bug` `补丁` 解决 elemet-ui table 显示合计异常
- `bug` `补丁` 解决 elemet-ui table 列无法对齐的问题
- `bug` 解决 \$scopedSlots 没有获取到槽插而导致函数调用报错的问题
- `bug` 解决初始化获取 attrs 导致 table load 属性失效的问题
- `bug` 局部引用组件报错
- `bug` 解决 el-table 和 el-pagination 组件拥有同名事件 current-change 的冲突问题
- `bug` 多级表头自定义 slotColum，SlotHeader 失败问题
- `bug` 多级表头列添加添加属性 display 为 false，渲染异常
- `bug` 添加 request，getData 属性 api，方便和接口对接


