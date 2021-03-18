---
title: 演示教程
sidebar: auto
---

# agel-table | 使 element-ui table 组件更简单

## 特性

该组件的思想就是以一个 table 对象来做所有的操作，哪怕页上多个列表也不用在 data 定义一堆 data1,data2,loading1,loading2 ... 等变量，更加简单明了。

- 保持灵活性，极简的思想，更少的代码，更多的功能，更快速的开发
- 支持 element-ui table 组件的所有 api, slot, event, method
- 解决 element-ui table [一些潜在问题](https://agrass.gitee.io/agel-table/sum.html#element-ui-table-一些潜在问题)
- 添加额外的[扩展功能](https://agrass.gitee.io/agel-table/guide.html)
  - 纯数据配置
  - 动态显隐列
  - 集成分页组件
  - 数据代理
  - 自动合并相同行
  - 虚拟滚动支持大数据渲染 10w+


## 安装使用

`cnpm install agel-table --save`


## 简单的 Table 

<ClientOnly><basics-table/></ClientOnly>

::: details 点击查看代码
```html
<template>
  <agel-table v-model="table"></agel-table>
</template>
 
<script>
export default {
  data() {
    return {
      table: {
        border: true,
        columns: [
          { label: "日期", prop: "date", width: 200 },
          { label: "姓名", prop: "name", width: 200 },
          { label: "地址", prop: "address", minWidth: 300 },
        ],
        data: [
          { date: "2016-05-02", name: "王小虎", address: "上海市" },
          { date: "2016-05-04", name: "王小虎", address: "上海市" },
        ],
      },
    };
  },
};
</script>
```
:::

## 复杂的 Table

:::tip
1. 支持所有的 Table Event，相关事件函数都写在 `table.on` 对象里
2. 支持所有的 Table Method，table 实例会自动挂载到 `table.$ref` 上
:::

下面的 Demo 展示了 element-ui 官网 el-table 的[大多数例子](https://element.eleme.cn/#/zh-CN/component/table)

<el-tag style="margin:0px 5px 5px 0px" type="success" v-for="text in ['基础表格','带斑马纹表格','带边框表格','带状态表格','固定列','固定表头','单选','多选','排序','表尾合计行','自定义索引','树形数据与懒加载']" :key="text">{{text}}</el-tag>

<ClientOnly><complex-table/></ClientOnly>

::: details 点击查看代码
```html
<template>
  <div class="demo">
    <el-button @click="clearSelection">清空选中</el-button>
    <agel-table v-model="table"></agel-table>
  </div>
</template>
 
<script>
export default {
  data() {
    let data = [];
    for (let i = 0; i < 10; i++) {
      data.push({
        date: "2016-05-01 10:20",
        name: "王小虎" + i,
        sex: i % 2 == 0 ? "男" : "女",
        address: "上海市普陀区金沙江路 1518 弄",
        hasChildren: i == 0,
      });
    }
    return {
      table: {
        data,
        border: true,
        stripe: true,
        height: 300,
        lazy: true,
        "highlight-current-row": true,
        "show-summary": true,
        "sum-text": "合计",
        "row-key": "name",
        "default-sort": { prop: "name", order: "ascending" },
        "tree-props": { children: "children", hasChildren: "hasChildren" },
        "summary-method": () => ["合", "计", "也", "还", "可", "以"],
        "row-class-name": ({ rowIndex }) => {
          return rowIndex == 0 ? "success-row" : "";
        },
        load: (tree, treeNode, resolve) => {
          setTimeout(() => {
            resolve([
              {
                date: "2016-05-01 10:20",
                name: "王小虎",
                sex: "男",
                address: "上海市普陀区金沙江路 1517 弄",
              },
            ]);
          }, 1000);
        },
        columns: [
          { type: "selection", width: 50, align: "center", fixed: true },
          {
            label: "#",
            type: "index",
            align: "center",
            width: 50,
            index: (index) => "#" + (index + 1),
          },
          { label: "日期", prop: "date", width: 200 },
          {
            label: "配送信息",
            children: [
              { label: "姓名", prop: "name", width: 80, sortable: true },
              {
                label: "性别",
                prop: "sex",
                width: 80,
                filters: [
                  { text: "男", value: "男" },
                  { text: "女", value: "女" },
                ],
                "filter-method": (value, row) => {
                  return row.sex === value;
                },
              },
              { label: "地址", prop: "address", width: 400 },
            ],
          },
        ],
        on: {
          "selection-change": () => {
            this.$message.success("选择项发生变化");
          },
        },
      },
    };
  },
  methods: {
    clearSelection() {
      this.table.$ref.clearSelection();
    },
  },
};
</script>
<style>
.el-table .success-row {
  background: #f0f9eb;
}
</style>
```
:::

## 显隐的 Table

<ClientOnly><display-table/></ClientOnly>

::: details 点击查看代码
```html
<template>
  <div class="demo">
    <el-checkbox v-for="item in table.columns" v-model="item.display" :key="item.label">{{item.label}}</el-checkbox>
    <agel-table v-model="table"></agel-table>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      table: {
        border: true,
        height: 100,
        columns: [
          { label: "日期", prop: "date", width: 200, display: true },
          { label: "姓名", prop: "name", width: 200, display: true },
          { label: "地址", prop: "address", minWidth: 300, display: true },
        ],
        data: [],
      },
    };
  },
};
</script>
```
:::

## 分页的 Table

:::tip
el-pagination 与 el-table 拥有重名事件 `currentChange`，故此重定义为 `page-change`
:::

<ClientOnly><page-table/></ClientOnly>

::: details 点击查看代码
```html {11-18}
<template>
  <agel-table v-model="table"></agel-table>
</template>
 
<script>
export default {
  data() {
    return {
      table: {
        border: true,
        page: {
          enable: true,
          height: 50,
          currentPage: 2,
          total: 1000,
          pageSize: 1,
          pageSizes: [1, 2, 3, 4, 5, 6],
        },
        columns: [{ label: "自定义分页配置，支持所有分页属性和事件" }],
        on: {
          "page-change": () => {
            // el-pagination 与 el-table 拥有重名事件 currentChange，故此重定义为 page-change
            // currentPage 将自动变化 不需要手动赋值
            this.$message.success(
              `page-change,当前页码:${this.table.page.currentPage}页`
            );
          },
          "size-change": () => {
            // pageSize 将自动变化 不需要手动赋值
            this.$message.success(
              `page-change,每页展示:${this.table.page.pageSize}条`
            );
          },
          "prev-click": () => {
            this.$message.success("prev-click");
          },
          "next-click": () => {
            this.$message.success("next-click");
          },
        },
      },
    };
  },
};
</script>
```
:::
 
## 数据代理的 Table

::: tip
1. getData 流程： 开启 loading -> getQuery -> request -> 回填数据和分页 -> 关闭 loading
2. 分页或者排序发生变化，会自动触发 getData 函数
:::
  
<ClientOnly><get-data-table/></ClientOnly>

::: details 点击查看代码
```html {21,27-32,38}
<template>
  <div class="demo">
    <el-input v-model="table.query.name" style="width:100px;margin-right:10px;"></el-input>
    <el-button icon="el-icon-search" @click="load">查询</el-button>
    <el-button @click="()=>table.loading=!table.loading">{{table.loading?'关闭':'开启'}}loading</el-button>
    <p><code v-show="queryString">{{queryString}}</code></p>
    <agel-table v-model="table"></agel-table>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      queryString: "",
      table: {
        border: true,
        height: "200px",
        data: [],
        page: { enable: true },
        query: { name: "小虎" },
        columns: [
          { label: "日期", prop: "date", width: 200, sortable: "custom" },
          { label: "姓名", prop: "name", width: 200 },
          { label: "地址", prop: "address", minWidth: 300 },
        ],
        request: (query, reslove, rejcet) => {
          this.queryString = JSON.stringify(query);
          this.http(query)
            .then((res) => reslove({ data: res.data, total: res.total }))
            .catch(rejcet);
        },
      },
    };
  },
  methods: {
    load() {
      this.table.getData();
    },
    http(quey) {
      // 模拟一个 http 请求
      return new Promise((reslove) => {
        setTimeout(() => {
          let data = [];
          for (let i = 0; i < quey.pageSize; i++) {
            let index = (quey.currentPage - 1) * quey.pageSize + (i + 1);
            data.push({
              date: "2016-05-02",
              name: "王小虎" + index,
              address: "上海市" + index,
            });
          }
          //  reslove(data); 如果没有分页，可直接 reslove 一个 data 数组
          reslove({ data: data, total: 100 });
        }, 1000);
      });
    },
  },
};
</script>
```
:::

## 自动合并列的 Table

:::tip
暂且只支持纵向自动合并，横向自动合并等待后续更新
:::

<ClientOnly> <merge-cell-table/></ClientOnly>

::: details 点击查看代码
```html {21,33}
<template>
  <div>
    <p>设置 <code>table.merge.auto</code> 将自动合并所有相同列</p>
    <agel-table v-model="table"></agel-table>
    <p>也可设置指定列 <code>merge</code> 进行合并 </p>
    <agel-table v-model="table2"></agel-table>
  </div>
</template>
 
<script>
export default {
  data() {
    const data = [
      { date: "2016-05-02", name: "王小虎", address: "上海市1" },
      { date: "2016-05-02", name: "王小虎", address: "上海市2" },
      { date: "2016-05-02", name: "王小虎", address: "上海市3" },
    ];
    return {
      table: {
        border: true,
        merge: { enable: true, auto: true },
        columns: [
          { label: "日期", prop: "date", width: 200 },
          { label: "姓名", prop: "name", width: 200 },
          { label: "地址", prop: "address", minWidth: 300 },
        ],
        data,
      },
      table2: {
        border: true,
        merge: { enable: true },
        columns: [
          { label: "日期", prop: "date", width: 200, merge: true },
          { label: "姓名", prop: "name", width: 200 },
          { label: "地址", prop: "address", minWidth: 300 },
        ],
        data,
      },
    };
  },
};
</script>
```
:::

## 虚拟滚动的 Table
:::tip
1. 虚拟滚动，渲染 10w+ 的数据量也可以轻轻松松 :smile:
2. 可惜目前暂不支持 type `selection` 列
:::

<ClientOnly> <virtual-scroll-table/></ClientOnly>

::: details 点击查看代码
```html {22}
<template>
  <div class="demo">
    <el-row>
      <el-input-number v-model="number" :min="1" :max="100000" :step="100" placeholder="数据条数"></el-input-number>
      <el-button @click="setData">加载大数据</el-button>
      <el-input-number v-model="row" :min="1" :max="table.data.length" placeholder="指定跳转行数"></el-input-number>
      <el-button @click="jump">跳转到指定行数</el-button>
    </el-row>
    <agel-table v-model="table"></agel-table>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      number: 10000,
      row: 100,
      table: {
        border: true,
        height: 300,
        virtual: { enable: true, rowHeight: 34 },
        columns: [
          { label: "序号", type: "index", width: 100, align: "center" },
          { label: "日期", prop: "date", width: 200 },
          { label: "姓名", prop: "name", width: 200 },
          { label: "地址", prop: "address",minWidth: 100 },
        ],
        data: [],
      },
    };
  },
  mounted() {
    this.setData();
  },
  methods: {
    setData() {
      let data = [];
      for (let i = 0; i < this.number; i++) {
        // 冻结对象可获得更好的性能
        data.push({
          date: "2016-05-02",
          name: "王小虎" + i + 1 + "号",
          address: "上海市",
        });
      }
      this.table.data = data;
    },
    jump() {
      this.table.virtualScrollToRow(this.row);
    },
  },
};
</script>
```
:::

## 自定义模板的 Table

<ClientOnly><slot-table/></ClientOnly>

::: details 点击查看代码
```html
<template>
  <agel-table v-model="table">
    <template v-slot:expand="props">
      <div style="text-align:center">{{props.row.date}}=>template展开行内容</div>
    </template>
    <template v-slot:date="props">
      <el-tag>{{props.row.date}}</el-tag>
    </template>
    <template v-slot:dateHeader>
      <el-tag>模板自定义列-表头</el-tag>
    </template>
    <template v-slot:append>
      <p style="text-align:center">最后一行 slot append...</p>
    </template>
  </agel-table>
</template>
 
<script>
export default {
  data() {
    return {
      table: {
        border: true,
        columns: [
          {
            label: "展开行",
            type: "expand",
            width: 80,
            // 也支持 render 函数写法
            // slotExpand: (h, { row }) => {
            //   return <p style="text-align:center">{row.date}=>render展开行内容</p>;
            // },
          },
          {
            width: 200,
            slotColumn: "date",
            slotHeader: "dateHeader",
          },
          {
            minWidth: 200,
            slotColumn: (h, { row }) => {
              return <el-tag>{row.name}</el-tag>;
            },
            slotHeader: () => {
              return <el-tag>render函数自定义列-表头</el-tag>;
            },
          },
        ],
        data: [
          { date: "2016-05-02", name: "王小虎", address: "上海市" },
          { date: "2016-05-04", name: "王小虎", address: "上海市" },
        ],
      },
    };
  },
};
</script>
```
:::

## attach 属性的用法

:::tip
在设计上，主张的是聚拢所有的参数为一个 table 对象，在组件初始化完成后会为 table 参数添加额外的内置属性和方法，因此该参数必须使用 `v-model`，且不可设为计算属性

为了保持其灵活性，添加了 `attach` 参数，配置项与 table 一致，不仅可聚拢也可打散，也可为计算属性，当其发生变化时候，会同步合并到 table 对象中

另外值得一提的是，`columns` 属性也可以设置成对象
:::

<ClientOnly><attach-table/></ClientOnly>

::: details 点击查看代码
```html
<template>
  <div class="demo">
    <el-button @click="add">修改高度</el-button>
    <agel-table v-model="table" :attach="{border,height,data,columns}"></agel-table>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      table: {},
      border: true,
      height: 150,
    };
  },
  computed: {
    data() {
      return [
        { date: "2016-05-02", name: "王小虎", address: "上海市" },
        { date: "2016-05-04", name: "王小虎", address: "上海市" },
      ];
    },
    columns() {
      // columns 属性也可以设置成对象
      return {
        date: { label: "日期", width: 200 },
        name: { label: "姓名", width: 200 },
        address: { label: "地址", minWidth: 300 },
      };
    },
  },
  methods: {
    add() {
      this.height += 10;
      this.$message("高度发生变化，同步：" + this.table.height);
    },
  },
};
</script>
```
:::

## query 配置的用法

:::tip
你可以设置成你项目中所需要的 table `query.props`，也可以使用 `formatter` 再进行格式化，建议这一步放在全局配置里面
:::

<ClientOnly><query-table/></ClientOnly>

::: details 点击查看代码
```html {18-29}
<template>
  <div class="demo">
    <code v-show="queryString">{{queryString}}</code>
    <agel-table v-model="table"></agel-table>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      queryString: "",
      table: {
        border: true,
        height: 200,
        page: { enable: true, total: 1000 },
        columns: [{ label: "日期", prop: "date", sortable: "custom" }],
        query: {
          userId: "admin",
          props: {
            currentPage: "page",
            pageSize: "size",
            order: "order",
            orderColumn: "orderName",
          },
          formatter: (query) => {
            query.order = query.order == "descending" ? 1 : 0;
            return query;
          },
        },
        on: {
          "sort-change": this.getQuery,
          "page-change": this.getQuery,
          "size-change": this.getQuery,
        },
      },
    };
  },
  mounted() {
    this.getQuery();
  },
  methods: {
    getQuery() {
      this.queryString = JSON.stringify(this.table.getQuery());
    },
  },
};
</script>
```
:::

## 全局配置的用法

:::tip
以下配置将应用到每个表格上，支持所有属性配置，注意的是某些内置属性和方法，请勿覆盖
:::

```js
import agelTable from 'agel-table';

const config = {
  // component name,use() 生效
  name: 'agel-table', 
  // 设置每个表格的配置
  table: {
    border:true,
    "highlight-current-row":true,
  },
  // 设置每个表格列的配置
  column: {
    algin:"center",
    "show-overflow-tooltip":true,
  },
  // 设置每个表格的分页配置
  page: {
    enable:true,
    height: 45,
    pageSize: 10,
    pageSizes: [10, 20, 30, 40],
    layout: "total, sizes, prev, pager, next, jumper",
  }, 
  // 设置每个表格的 query 配置
  query:{
    props:{
      currentPage: "page",
      pageSize: "size",
      order: "order",
      orderColumn: "orderName"
    }
    formatter: (query) => {
      query.order = query.order == "descending" ? 1 : 0;
      return query;
    },
  }
}

Vue.use(agelTable, config);

// or

Vue.prototype.$agelTableConfig = config;
Vue.component('agel-table', agelTable);
```

以上所有例子都有源码 [链接](https://github.com/agrass-GitHub/agel-table/tree/master/docs/.vuepress/components)