---
title: Element UI 兼容说明
sidebar: auto
---

# Element UI 兼容说明

agel-table 复用 Element UI 2 的表格、列和分页组件。本页记录封装过程中遇到的历史兼容问题，便于排查旧版 Element UI 项目中的表格布局异常。

以下问题来自 Element UI 2.12 的历史版本，部分已在 Element UI 后续版本修复。升级或使用补丁前，请先确认项目中实际安装的 Element UI 版本，并通过页面回归验证：

- [合计行显示异常](https://codepen.io/agrass-github/pen/ExxjXVO)：历史版本中重新布局可用于排查。
- [多级表头显隐列异常](https://codepen.io/agrass-github/pen/eYYBBPX)：动态列变化后需检查表头布局。
- [列宽无法对齐](https://codepen.io/agrass-github/pen/BaaNRae)：该问题已由 Element UI 官方修复。
- [隐藏表头时报错](https://codepen.io/agrass-github/pen/zYYowvm)：该问题已由 Element UI 官方修复。

这些记录不代表当前 Element UI 版本仍存在相同问题；不要在未复现的情况下套用历史补丁。
