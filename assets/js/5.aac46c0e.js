(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{116:function(e,t,n){"use strict";var r=n(31);n.n(r).a},117:function(e,t,n){},120:function(e,t,n){"use strict";n(38),n(16),n(20),n(159);var r=n(39),a=(n(115),n(160),n(52),function(){return"xxxxxxxx".replace(/[x]/g,(function(e){var t=16*Math.random()|0;return("x"==e?t:3&t|8).toString(16)}))});function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(n,!0).forEach((function(t){Object(r.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var l=function(){var e=this,t={$ref:void 0,loading:!1,immediate:!1,isPage:!0,isResize:!1,isMerge:!1,columns:[],order:"",orderColumn:"",page:{},on:{},queryProps:{page:"page",pageSize:"pageSize",order:"order",orderColumn:"orderColumn"},request:null,getQuery:function(){var e,t=this.queryProps,n=t.page,a=t.pageSize,i=t.order,o=t.orderColumn;return e={},Object(r.a)(e,n,this.page.currentPage),Object(r.a)(e,a,this.page.pageSize),Object(r.a)(e,i,this.order),Object(r.a)(e,o,this.orderColumn),e},getData:function(){var e=this;this.request&&(this.loading=!0,new Promise((function(t){return e.request(e.getQuery(),t)})).then((function(t){var n=Array.isArray(t)?{data:t,total:t.length}:t,r=n.data,a=n.total;e.data=r,e.page.total=a,e.loading=!1})).catch((function(){e.loading=!1})))},resize:function(t){var n=e.value,r=function(){var t=e.$refs.container,r=t?t.parentNode.clientHeight:0;!r||r<=0||(n.height=r)};t&&"resize"==t.type?r():e.$nextTick((function(){r(),n.$ref&&n.$ref.doLayout()}))}},n={data:[],height:void 0,spanMethod:function(t){var n=t.rowIndex,r=t.columnIndex;if(0!=e.mergeSpans.length)return e.mergeSpans[n][e.flatColumns[r].key]}},a={sortChange:function(t){var n=t.column,r=t.prop,a=t.order;"custom"===n.sortable&&(e.value.order=a,e.value.orderColumn=r,e.value.getData())},sizeChange:function(t){e.value.page.pageSize=t,e.value.getData()},currentChange:function(){return 2===arguments.length?"currentChange":1===arguments.length?(e.value.page.currentPage=arguments.length<=0?void 0:arguments[0],e.value.getData(),"pageChange"):void 0}},i=this.$agelTableConfig||{},l=i.table||{},s=i.page||{},u=o({display:!0},i.column||{}),c=o({},this.value,{},this.attach);return{extendApi:t,defaultApi:n,eventsApi:a,pageApi:{height:45,pageSize:20,pageSizes:[10,20,50,100],currentPage:1,layout:"total, sizes, prev, pager, next, jumper",class:"agel-pagination",total:0},globalApi:l,globalPageApi:s,globalColumnApi:u,localApi:c,localPageApi:c.page||{},localEventsApi:c.on||{}}};function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function u(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(n,!0).forEach((function(t){Object(r.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var c=function(e){var t=this,n={},r=this.$scopedSlots;return e.forEach((function(e){var a=e[0],i=e[1];!1!==e[2]&&("function"==typeof i?n[a]=function(e){return i(t.$createElement,e)}:"string"==typeof i&&void 0!==r[i]&&(n[a]=function(e){return r[i](u({},e))}))})),n},p=function e(t){var n=this,r=this.$createElement;return t.map((function(t){if(t.children&&t.children.length>0)return r("el-table-column",{attrs:u({},t),key:t.key},[e.call(n,t.children)]);var a=c.call(n,[["header",t.slotHeader],["default",t.slotColumn],["default",t.slotExpand||"expand","expand"==t.type]]);return r("el-table-column",{attrs:u({},t),key:t.key,scopedSlots:a})}))};function f(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function g(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?f(n,!0).forEach((function(t){Object(r.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):f(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}var d={name:"agel-table",install:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};e.prototype.$agelTableConfig=t,e.component(t.name||this.name,this)},props:{value:{required:!0,type:Object,default:function(){return new Object}},attach:{type:Object,default:function(){return new Object}}},data:function(){return{API:{},LOAD:!1}},computed:{styles:function(){return this.getStyles()},attrs:function(){return this.getAttrs()},events:function(){return this.getEvents()},columns:function(){return this.getColumns(this.value.columns)},flatColumns:function(){return this.getFlatColumns(this.columns)},mergeKeys:function(){return this.getMergeKeys(this.flatColumns)},mergeSpans:function(){return this.getMergeSpans()}},watch:{attach:{deep:!0,handler:"initApi"},"value.isResize":"registerResize"},created:function(){this.initApi()},beforeDestroy:function(){this.registerResize(!1)},methods:{initApi:function(){var e=this,t=l.call(this);this.$emit("input",g({},t.defaultApi,{},t.extendApi,{},t.globalApi,{},t.localApi,{page:g({},t.pageApi,{},t.globalPageApi,{},t.localPageApi)})),this.API=t,this.LOAD||this.$nextTick().then((function(){return e.LOAD=!0})).then((function(){e.value.$ref=e.$refs.table,e.value.immediate&&e.value.getData(),e.registerResize()}))},getAttrs:function(){var e={};for(var t in this.value)this.API.extendApi.hasOwnProperty(t)||(e[t]=this.value[t]);if(e.height&&this.value.isPage){var n=Number(e.height)-this.value.page.height;e.height=n<0?0:n}return e},getEvents:function(){var e={},t=this.API,n=t.eventsApi,r=t.localEventsApi,a=function(t){var a;e[(a=t,a.replace(/([A-Z])/g,"-$1").toLowerCase())]=function(){var e;n[t]&&(e=n[t].apply(n,arguments)||t),r[e]&&r[e].apply(r,arguments)}};for(var i in g({},n,{},r))a(i);return e},getStyles:function(){var e=this.value,t=e.height,n=e.page;return{container:{height:t?t+"px":"auto"},page:{height:n.height?n.height+"px":"auto"}}},getColumns:function(e){var t=this,n=e;return Array.isArray(n)||(n=Object.keys(e).map((function(n){var r=e[n];return null==r.prop&&t.$set(r,"prop",n),r}))),n.map((function(e){var n={},r=g({},t.API.globalColumnApi,{key:a()});for(var i in r)null==e[i]&&t.$set(e,i,r[i]);return e.children&&(n.children=t.getColumns(e.children),0==n.children.length&&(e.key=a())),g({},e,{},n)})).filter((function(e){return e.display}))},getFlatColumns:function(e){var t=this;return e.reduce((function(e,n){return e.concat(Array.isArray(n.children)&&n.children.length>0?t.getFlatColumns(n.children):n)}),[])},getMergeKeys:function(){var e=this.value,t=e.isMerge;return e.rowKey?[]:this.flatColumns.filter((function(e){var n=void 0===e.merge?t:e.merge;return e.prop&&n&&!e.type})).map((function(e){return e.key}))},getMergeSpans:function(){var e=this,t=[],n=-1;return this.mergeKeys.forEach((function(r){e.value.data.forEach((function(a,i){var o=e.value.data[i+1],l=e.value.data[i-1];null==t[i]&&(t[i]={}),t[i][r]={rowspan:1,colspan:1},o&&a[r]==o[r]?-1==n?t[n=i][r].rowspan++:(t[n][r].rowspan++,t[i][r].rowspan=0):(n=-1,t[i][r].rowspan=l&&l[r]==a[r]?0:1)}))})),t},renderColumns:function(){var e=this,t=this.columns;t&&0!==t.length&&(this.$slots.columns=p.call(this,t),this.$nextTick((function(){e.$refs.table.doLayout()})))},registerResize:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.value.isResize;e?(this.value.resize(),window.addEventListener("resize",this.value.resize)):window.removeEventListener("resize",this.value.resize)}}},h=(n(116),n(1)),v=Object(h.a)(d,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.LOAD?n("div",{directives:[{name:"loading",rawName:"v-loading",value:e.value.loading,expression:"value.loading"}],ref:"container",staticClass:"agel-table",style:e.styles.container},[n("el-table",e._g(e._b({ref:"table",staticStyle:{width:"100%"},scopedSlots:e._u([{key:"append",fn:function(){return[e._t("append")]},proxy:!0},{key:"empty",fn:function(){return[e._t("empty")]},proxy:!0},{key:"default",fn:function(){return[e._v("\n      "+e._s(e.renderColumns())+"\n      "),e._t("columns")]},proxy:!0}],null,!0)},"el-table",e.attrs,!1),e.events)),e._v(" "),e.value.isPage?n("el-pagination",e._g(e._b({ref:"page",style:e.styles.page},"el-pagination",e.value.page,!1),e.events)):e._e()],1):e._e()}),[],!1,null,null,null).exports;"undefined"!=typeof window&&window.Vue&&v.install(window.Vue);t.a=v},121:function(e,t,n){"use strict";function r(e){return function(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}n.d(t,"a",(function(){return r}))},274:function(e,t,n){"use strict";var r=n(117);n.n(r).a},279:function(e,t,n){"use strict";n.r(t);n(86);var r=n(121),a=n(0),i=n(138),o=n.n(i),l=(n(158),n(120));a.default.use(o.a),a.default.use(l.a);var s={name:"demo",data:function(){var e=this;return{drawer:!1,table:{isResize:!0,isPage:!0,showSummary:!0,immediate:!0,sumText:"合",columns:[{label:"多选",type:"selection",align:"center",display:!0,width:50},{label:"自定义索引",type:"index",display:!0,align:"center",width:120,index:function(t){var n=e.table.page,r=n.currentPage,a=n.pageSize;return"index-".concat((r-1)*a+t)}},{label:"展开",type:"expand",display:!0,width:60},{label:"名称",minWidth:250,prop:"name",display:!0},{label:"多级表头",width:250,prop:"name",children:[{label:"合并行",prop:"merge",width:150,display:!0,merge:!0,sortable:"custom",filters:[{text:"index == 1",value:1}],filterMethod:function(e,t){return t.index==e}},{label:"自定义表头",display:!0,width:250,slotHeader:"cutomHeader",slotColumn:"cutomColumn"}]}],page:{pageSize:3,pageSizes:[3,10]},request:function(t,n){e.http(t).then((function(e){n({data:e,total:5*t.pageSize})}))},summaryMethod:function(){return["合"].concat(Object(r.a)(e.table.columns.map((function(e,t){return t+1}))))},rowClassName:function(e){var t=e.rowIndex;return"customRowClass-".concat(t+1)},on:{sortChange:function(e){console.log("触发sortChange:",e)},currentChange:function(e){console.log("触发currentChange:",e)},pageChange:function(e){console.log("触发pageChange:"+e)},sizeChange:function(e){console.log("触发sizeChange:"+e)}}}}},computed:{displayColumns:function(){var e=this.table.columns;return[].concat(Object(r.a)(e.filter((function(e){return!e.children}))),Object(r.a)(e.find((function(e){return e.children})).children))}},watch:{"table.isResize":function(e){e||(this.table.height="")}},methods:{getData:function(){this.table.getData()},removeData:function(){var e=this;this.http({page:1,pageSize:0}).then((function(t){e.table.data=t,e.table.page.total=0,e.table.page.currentPage=1}))},http:function(e){var t=e.page,n=e.pageSize;e.level;return new Promise((function(e){setTimeout((function(){for(var r=[],a=0;a<n;a++){var i=(t-1)*n+a;r.push({id:Math.random(),name:"agel-table",merge:"自动合并",index:i})}e(r)}),200)}))}}},u=(n(274),n(1)),c=Object(u.a)(s,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"demo-page"},[n("el-drawer",{attrs:{title:"功能区面板",direction:"rtl",visible:e.drawer,size:"400px","custom-class":"demo-page-panel"},on:{"update:visible":function(t){e.drawer=t}}},[n("div",{staticClass:"input-item"},[n("div",{staticClass:"lablel"},[e._v("功能切换")]),e._v(" "),n("el-checkbox",{model:{value:e.table.isPage,callback:function(t){e.$set(e.table,"isPage",t)},expression:"table.isPage"}},[e._v("分页")]),e._v(" "),n("el-checkbox",{model:{value:e.table.isResize,callback:function(t){e.$set(e.table,"isResize",t)},expression:"table.isResize"}},[e._v("自适应")]),e._v(" "),n("el-checkbox",{model:{value:e.table.loading,callback:function(t){e.$set(e.table,"loading",t)},expression:"table.loading"}},[e._v("加载")]),e._v(" "),n("el-checkbox",{attrs:{value:!0,disabled:""}},[e._v("合并行")])],1),e._v(" "),n("div",{staticClass:"input-item"},[n("div",{staticClass:"lablel"},[e._v("动态显示列")]),e._v(" "),e._l(e.displayColumns,(function(t,r){return n("el-checkbox",{key:t.label,attrs:{label:t.label},model:{value:t.display,callback:function(n){e.$set(t,"display",n)},expression:"item.display"}})}))],2),e._v(" "),n("div",{staticClass:"input-item"},[n("div",{staticClass:"lablel"},[e._v("高度")]),e._v(" "),n("el-input",{attrs:{type:"number"},model:{value:e.table.height,callback:function(t){e.$set(e.table,"height",t)},expression:"table.height"}})],1),e._v(" "),n("div",{staticClass:"input-item"},[n("div",{staticClass:"lablel"},[e._v("最大高度")]),e._v(" "),n("el-input",{attrs:{type:"number"},model:{value:e.table.maxHeight,callback:function(t){e.$set(e.table,"maxHeight",t)},expression:"table.maxHeight"}})],1),e._v(" "),n("div",{staticClass:"input-item"},[n("el-button",{on:{click:e.getData}},[e._v("加载数据")]),e._v(" "),n("el-button",{on:{click:e.removeData}},[e._v("清空数据")])],1)]),e._v(" "),n("div",[n("el-button",{on:{click:function(t){e.drawer=!e.drawer}}},[e._v("功能区")]),e._v(" "),e.table.isResize?n("span",[e._v("盒子高度 60vh, 表格会自适应变化")]):n("span",[e._v("盒子高度 auto")])],1),e._v(" "),n("div",{staticClass:"table-box",style:{height:e.table.isResize?"60vh":"auto"}},[n("agel-table",{scopedSlots:e._u([{key:"append",fn:function(){return[n("p",{staticClass:"append-slot"},[e._v("table slot append .... loading ...")])]},proxy:!0},{key:"empty",fn:function(){return[n("p",{staticClass:"append-slot"},[e._v("table slot empty .... 暂无数据 ...")])]},proxy:!0},{key:"cutomHeader",fn:function(t){return[n("el-button",{attrs:{size:"mini"}},[e._v(e._s(t.column.label))])]}},{key:"cutomColumn",fn:function(t){return[n("el-button",{attrs:{size:"mini"}},[e._v("自定义列")])]}},{key:"expand",fn:function(t){t.index;var r=t.row;return[n("p",[e._v("展开行："+e._s(r.name))])]}}]),model:{value:e.table,callback:function(t){e.table=t},expression:"table"}})],1)],1)}),[],!1,null,null,null);t.default=c.exports},31:function(e,t,n){},86:function(e,t,n){"use strict";var r=n(14),a=n(87)(5),i=!0;"find"in[]&&Array(1).find((function(){i=!1})),r(r.P+r.F*i,"Array",{find:function(e){return a(this,e,arguments.length>1?arguments[1]:void 0)}}),n(46)("find")},87:function(e,t,n){var r=n(49),a=n(69),i=n(42),o=n(41),l=n(88);e.exports=function(e,t){var n=1==e,s=2==e,u=3==e,c=4==e,p=6==e,f=5==e||p,g=t||l;return function(t,l,d){for(var h,v,b=i(t),m=a(b),y=r(l,d,3),w=o(m.length),O=0,x=n?g(t,w):s?g(t,0):void 0;w>O;O++)if((f||O in m)&&(v=y(h=m[O],O,b),e))if(n)x[O]=v;else if(v)switch(e){case 3:return!0;case 5:return h;case 6:return O;case 2:x.push(h)}else if(c)return!1;return p?-1:u||c?c:x}}},88:function(e,t,n){var r=n(89);e.exports=function(e,t){return new(r(e))(t)}},89:function(e,t,n){var r=n(22),a=n(90),i=n(11)("species");e.exports=function(e){var t;return a(e)&&("function"!=typeof(t=e.constructor)||t!==Array&&!a(t.prototype)||(t=void 0),r(t)&&null===(t=t[i])&&(t=void 0)),void 0===t?Array:t}},90:function(e,t,n){var r=n(32);e.exports=Array.isArray||function(e){return"Array"==r(e)}}}]);