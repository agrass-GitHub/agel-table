(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{333:function(e,t,n){},359:function(e,t,n){"use strict";n(333)},367:function(e,t,n){"use strict";n.r(t);var a={data:function(){for(var e=this,t=[],n=0;n<10;n++)t.push({date:"2016-05-01 10:20",name:"王小虎"+n,sex:n%2==0?"男":"女",address:"上海市普陀区金沙江路 1518 弄",hasChildren:0==n});return{table:{data:t,border:!0,stripe:!0,height:300,lazy:!0,"highlight-current-row":!0,"show-summary":!0,"sum-text":"合计","row-key":"name","default-sort":{prop:"name",order:"ascending"},"tree-props":{children:"children",hasChildren:"hasChildren"},"summary-method":function(){return["合","计","也","还","可","以"]},"row-class-name":function(e){return 0==e.rowIndex?"success-row":""},load:function(e,t,n){setTimeout((function(){n([{date:"2016-05-01 10:20",name:"王小虎",sex:"男",address:"上海市普陀区金沙江路 1517 弄"}])}),1e3)},columns:[{type:"selection",width:50,align:"center",fixed:!0},{label:"#",type:"index",align:"center",width:50,index:function(e){return"#"+(e+1)}},{label:"日期",prop:"date",width:200},{label:"配送信息",children:[{label:"姓名",prop:"name",width:80,sortable:!0},{label:"性别",prop:"sex",width:80,filters:[{text:"男",value:"男"},{text:"女",value:"女"}],"filter-method":function(e,t){return t.sex===e}},{label:"地址",prop:"address",width:400}]}],on:{"selection-change":function(){e.$message.success("选择项发送变化")}}}}},methods:{clearSelection:function(){this.table.$ref.clearSelection()}}},l=(n(359),n(28)),r=Object(l.a)(a,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"demo"},[n("el-button",{on:{click:e.clearSelection}},[e._v("清空选中")]),e._v(" "),n("agel-table",{model:{value:e.table,callback:function(t){e.table=t},expression:"table"}})],1)}),[],!1,null,null,null);t.default=r.exports}}]);