# 总结思考

## 为什么要写这个组件?

自己在写项目的过程中，经常因为项目需求二次封装一些 ui 组件或者方法，这些二次封装都拥有较强的针对性，在写新项目的时候，移植这些组件的时候，往往又会针对新项目又修修改改，如此一来，一个组件最后修改成了 n 个版本，一旦发现某个 bug，很难每个项目去修改维护。

解决办法就是在 npm 发布一个共通性，包容度较强的 el-table 组件，在提高效率的情况下要达到两个基本需求：

- 支持 element-ui table 的所有 api
- 额外添加扩展功能

## 为什么这么设计?

在常见的组件 api 设计中，都是把参数分散定义在 `props`中，如

```js
props: {
  page: {},
  data: {},
  columns:{},
  // ....
}
```

但这样会导致一个问题，父组件参数过于分散，参考如下场景：

> 在使用一个 table 组件时，通常会在 data 函数中定义 table 状态的变量 data，loading，order，orderColumn，currentPage，pageSize，pageSizes，pagetotal，同时还需要在 mehotd 中定义一个 getData 的函数，里面的过程也是重复的，加载 loading->获取分页排序参数->获取数据->回填数据分页->关闭 loading，变量定义过多会显得杂乱不好维护，如果页面上有一个 table 尚且如此，如果有三四个 table，那岂不是 data1，data2，data3...

所以选择了只定义一个对象参数 table，由`v-model` 传递，用户只需要传递自己要覆盖的的配置，其他额外参数由组件内部初始化之后自动添加在 table 中。

用户不需要手动定义通用分页排序加载等参数，也可直接通过 `this.table.xxxx` 来进行使用。

## 遇到哪些比较难的问题？

### 多级表头 slot 无法穿透 , 多级表头显隐列展示异常

这是漫长的踩坑之路，有以下几个阶段。

1. 因为 el-table 的多级表头，是在 column 中嵌套 column，这里就只有写个递归组件，但是 slot 就卡在这里，无法在进行向下传递。slot 穿透流程变成：自定义 slot -> agel-table slot -> agel-column slot -> 递归循环自身（x）。

2. 探索 N 久之后，利用`provide,inject`直接向下传递 table `$scopedSlots`,不用层层传递，使用 `$slots,$scopedSlots`生成 vnode，直接渲染在模板上, 解决了这个问题，算是很冷门的解决方案。slot 穿透流程变成：自定义 slot -> agel-column slot -> 递归循环自身（√）。

3. 此时组件结构：el-table -> agel-column(v-for)-> el-table-column，在做动态显隐列功能时，修改多级表头列的 display 属性，页面列的渲染会出现递减，递减数量为多级表头的 children 的长度，把结构改成 el-table -> el-table-column(v-for)，则不会出现这个问题，可是这样写又无法递归循环 el-table-column，成了死循环。

4. 再次尝试修改组件嵌套结构：el-table-> agel-columns -> el-table-column(v-for)，使用 vue-Fragment 组件解决组件无法返回多个元素的问题，但仍然没有解决问题，反而列的顺序会发生异常，第一列会变成最后一列。

5. 无奈只有判断当前列中是否存在多级表头，如果存在，当列属性发生变化，更新列 key，重新渲染所有的列，这倒是可以解决问题，只不过性能上不太合理，而且重新渲染会出现列表闪烁的情况。

6. 把 agel-column 用 jsx 改写成函数，直接递归生成 el-table-column vnode，直接渲染在 el-table 下，就不存在嵌套，解决问题。

7. 又发现多级表头在显示隐藏子列时，当 children 为空时候，显示列异常。

8. 把过滤数组逻辑从 jsx getColumnsVnode 函数抽离出来，由 getColumns 函数执行，把 value.columns 抽离到计算属独立维护，解决。

### element-ui table 一些潜在问题

- [显示合计异常 bug 重现](https://codepen.io/agrass-github/pen/ExxjXVO)

- [列无法对齐 bug 重现](https://codepen.io/agrass-github/pen/BaaNRae)

在渲染列时候自动调用 table doLayout 解决。

### 参数无法定义在计算属性上

由于在 api 的设计上，table 参数是由 v-model 传递，再由组件内部向上传递其他内置参数，就导致了 table 参数无法设置为计算属性。如何解决 table 属性是动态变化的场景呢？解决办法有两个:

1. 在发生变化时手动赋值覆盖
2. 添加了 `attach` 参数,可以为计算属性，attach 发生变化，会同步合并到 table 对象里