(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{368:function(e,t,n){},394:function(e,t,n){"use strict";n(368)},404:function(e,t,n){"use strict";n.r(t);var a={data:function(){for(var e=this,t=[],n=0;n<10;n++)t.push({date:"2016-05-01 10:20",name:"王小虎"+n,sex:n%2==0?"男":"女",address:"上海市",hasChildren:0==n});return{table:{data:t,border:!0,stripe:!0,height:400,lazy:!0,highlightCurrentRow:!0,defaultSort:{prop:"name",order:"ascending"},rowKey:"name",treeProps:{children:"children",hasChildren:"hasChildren"},showSummary:!0,summaryMethod:function(){return["这","是","一","个","合","计"]},rowClassName:function(e){return 0==e.rowIndex?"success-row":""},load:function(e,t,n){setTimeout((function(){n([{date:"2016-05-01 10:20",name:"王小虎",sex:"男",address:"上海市普陀区金沙江路 1517 弄"}])}),1e3)},columns:[{type:"selection",width:50,align:"center",fixed:!0},{label:"#",type:"index",align:"center",width:50,index:function(e){return"#"+(e+1)}},{label:"日期",prop:"date",width:200},{label:"配送信息",children:[{label:"姓名",prop:"name",width:80,sortable:!0},{label:"性别",prop:"sex",width:80,filters:[{text:"男",value:"男"},{text:"女",value:"女"}],filterMethod:function(e,t){return t.sex===e}},{label:"地址",minWidth:300,prop:"address"}]}],page:{enable:!0,height:50,currentPage:2,total:1e3,pageSize:1,pageSizes:[1,2,3,4,5,6]},menu:{enable:!0,fixed:"right",onEdit:function(t){var n=t.row;e.$message.info(n.date)},onDel:function(t){var n=t.row;e.$message.info(n.date)}},on:{"selection-change":function(){e.$message.success("选择项发生变化")},"page-change":function(){e.$message.success("page-change,当前页码:".concat(e.table.page.currentPage,"页"))},"size-change":function(){e.$message.success("page-change,每页展示:".concat(e.table.page.pageSize,"条"))}}}}},methods:{clearSelection:function(){this.table.getRef().clearSelection()},updateLabel:function(){this.table.getCol("address").label="地址"+Math.random()}}},l=(n(394),n(57)),i=Object(l.a)(a,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"demo"},[n("div",{staticStyle:{"margin-bottom":"10px"}},[n("el-button",{on:{click:e.clearSelection}},[e._v("清空选中")]),e._v(" "),n("el-button",{on:{click:e.updateLabel}},[e._v("修改列信息")])],1),e._v(" "),n("agel-table",{model:{value:e.table,callback:function(t){e.table=t},expression:"table"}})],1)}),[],!1,null,null,null);t.default=i.exports}}]);