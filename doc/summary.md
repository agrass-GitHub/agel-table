# 总结思考

## 为什么要写这个组件?

自己在写项目的过程中，经常因为项目需求二次封装一些 ui 组件或者方法，这些二次封装都拥有较强的针对性，在写新项目的时候，移植这些组件的时候，往往又会针对新项目又修修改改，如此一来，一个组件最后修改成了 n 个版本，一旦发现某个 bug，很难每个项目去修改维护。

解决办法就是在 npm 发布一个共通性，包容度较强的 el-table 组件，在提高效率的情况下要达到两个基本需求：

- 支持 element-ui table 的所有 api
- 额外添加扩展功能。

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

> 在使用一个 table 组件时，通常会在 data 函数中定义 table 状态的变量 data，loading，order，orderColumn，currentPage，pageSize，pageSizes，pagetotal，同时还需要在 mehotd 中定义一个 getData 的函数，里面的过程也是重复的，加载 loading->获取分页排序参数->获取数据->回填数据分页->关闭 loading

data 变量定义过多会显得杂乱不好维护，如果页面上有一个 table 尚且如此，如果有三四个 table，那岂不是 data1，data2，data3...

为了解决这个问题，我选择了只定义一个对象参树 `value`，由`v-model` 传递，用户只需要传递自己要覆盖的的配置，其他额外参数由组件内部初始化之后自动添加在`value`中。

用户不需要定义通用分页排序加载等参数，也可直接通过 `this.table.xxxx` 来进行使用。

## 遇到哪些比较难的问题？

### 多级表头 slot 无法穿透

因为 el-table 的多级表头，是在 column 中嵌套 column，这里就只有写个递归组件，但是 slot 就卡在这里，无法在进行向下传递。自定义 slot -> agel-table slot -> agel-column slot -> 递归循环自身（x）。

探索 N 久之后，利用`provide,inject` 和 `$slots,$scopedSlots` 解决了这个问题，算是很冷门的解决方案。

### element-ui table 在特定情况下显示合计异常

[演示](https://codepen.io/agrass-github/pen/ExxjXVO)，版本 2.12，触发条件：固定高度，异步加载数据，因为高度不够原因，合计行会被盖住不会显示出来。

重新调用 resize 解决。

### element-ui table 在特定情况下列无法对齐

[演示](https://codepen.io/agrass-github/pen/BaaNRae)，版本 2.12，触发条件:固定高度同时出现横向滚动条 -> 异步加载数据 -> 数据超出，出现竖向滚动条 -> 拉横向滚动条至最右侧。

重新调用 resize 解决。

### 多级表头情况下，动态显隐列显示异常

在做动态显隐列功能的时候，为 column 添加了 display 属性，在计算属性中进行过滤，同时也为 column 添加唯一的 key 值。但在修改多级表头列的 display 属性，页面列的渲染会出现递减，递减数量为多级表头的 children 的长度。为了解决这个问题只有判断有多级表头的情况下 columns 发生变化重新渲染所有列，

```js
// if (key == undefined) v.key = guid();  修改之前
if (v.key == undefined || this.isMultistep) v.key = guid();
```

### 参数无法定义在计算属性上

由于在 api 的设计上，table 参数是由 v-model 传递，再由组件内部向上传递其他内置参数，就导致了 table 参数无法设置为计算属性。那要如何解决 table 属性是动态变化的场景呢？解决办法有两个

1. 在发生变化时手动赋值覆盖

```js
this.table.columns = this.getColumns();
```

2. 使用 `attach` 参数,可以为计算属性，最终会合并到 table 对象里

```html
<template>
  <agel-table v-model="table" :attach="attach"> </agel-table>
</template>
<script>
  export default {
     data(){
      return{
        num:100,
        table:{}
      }
    },
    computed:{
      attach(){
        retunr {
          height:this.num + 100
        }
      }
    }
  };
</script>
```
