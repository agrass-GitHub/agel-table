---
title: 随便总结
sidebar: auto
---

### element-ui table 一些潜在问题

自己在封装的过程中，发现了不少 element table 自身存在的 bug

- [v.2.12 显示合计异常 bug 重现](https://codepen.io/agrass-github/pen/ExxjXVO), 调用 doLayot 可解决
- [v.2.12 多级表头显隐列 bug 重现](https://codepen.io/agrass-github/pen/eYYBBPX), 强制重新渲染当前列可解决
- [v.2.12 列无法对齐 bug 重现](https://codepen.io/agrass-github/pen/BaaNRae), 调用 doLayot 可解决（官方已修复）
- [v.2.12 隐藏表头控制台报错 bug 重现](https://codepen.io/agrass-github/pen/zYYowvm)（官方已修复）