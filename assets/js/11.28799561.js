(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{443:function(e,t,a){"use strict";a.r(t);a(37),a(130),a(7),a(48);var n={data:function(){var e=this;return{table:{border:!0,data:[],height:300,query:{name:"小虎"},defaultSort:{prop:"date",order:"descending"},page:{enable:!0,currentPage:1,pageSize:5,pageSizes:[5,10,15,20]},menu:{enable:!0,fixed:"right",onEdit:function(t){var a=t.row;e.$message.info("编辑",a.date)},onDel:function(t){var a=t.row;e.$message.info("删除",a.date)}},columns:[{label:"日期",prop:"date",width:200,sortable:"custom"},{label:"姓名",prop:"name",width:200},{label:"地址",prop:"address",minWidth:300}],request:function(t,a,n){e.getHttpData(t).then((function(e){return a({data:e.data,total:e.total})})).catch(n)}}}},computed:{queryString:function(){return JSON.stringify(this.table.query)}},mounted:function(){this.table.getData()},methods:{onSearch:function(){this.table.getData({currentPage:1})},getHttpData:function(e){return new Promise((function(t){setTimeout((function(){for(var a=[],n=0;n<e.pageSize;n++){var r=(e.currentPage-1)*e.pageSize+(n+1);a.push({date:"2016-05-02",name:"王小虎"+r,address:"上海市"+r})}t({data:a,total:100})}),1e3)}))}}},r=a(74),i=Object(r.a)(n,(function(){var e=this,t=e._self._c;return t("div",{staticClass:"demo"},[t("p",[t("code",{directives:[{name:"show",rawName:"v-show",value:e.queryString,expression:"queryString"}]},[e._v(e._s(e.queryString))])]),e._v(" "),t("p",[t("el-input",{staticStyle:{width:"100px","margin-right":"10px"},model:{value:e.table.query.name,callback:function(t){e.$set(e.table.query,"name",t)},expression:"table.query.name"}}),e._v(" "),t("el-button",{attrs:{icon:"el-icon-search"},on:{click:e.onSearch}},[e._v("查询")])],1),e._v(" "),t("agel-table",{model:{value:e.table,callback:function(t){e.table=t},expression:"table"}})],1)}),[],!1,null,null,null);t.default=i.exports}}]);