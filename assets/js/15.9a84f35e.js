(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{372:function(e,t,a){"use strict";a.r(t);var l={data:function(){return{number:1e4,row:100,table:{border:!0,height:"50vh",virtual:{enable:!0,rowHeight:34},page:{enable:!0},columns:[{label:"序号",type:"index",width:100,align:"center"},{label:"日期",prop:"date",width:200},{label:"姓名",prop:"name",width:200},{label:"地址",prop:"address",minWidth:100}],data:[]}}},mounted:function(){this.setData()},methods:{setData:function(){for(var e=[],t=0;t<this.number;t++)e.push({date:"2016-05-02",name:"王小虎"+t+"1号",address:"上海市"});this.table.data=e},jump:function(){this.table.virtualScrollToRow(this.row)}}},n=a(27),o=Object(n.a)(l,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"demo"},[a("el-row",[a("el-input-number",{attrs:{min:1,max:1e5,step:100,placeholder:"数据条数"},model:{value:e.number,callback:function(t){e.number=t},expression:"number"}}),e._v(" "),a("el-button",{on:{click:e.setData}},[e._v("加载大数据")]),e._v(" "),a("el-input-number",{attrs:{min:1,max:e.table.data.length,placeholder:"指定跳转行数"},model:{value:e.row,callback:function(t){e.row=t},expression:"row"}}),e._v(" "),a("el-button",{on:{click:e.jump}},[e._v("跳转到指定行数")])],1),e._v(" "),a("agel-table",{model:{value:e.table,callback:function(t){e.table=t},expression:"table"}})],1)}),[],!1,null,null,null);t.default=o.exports}}]);