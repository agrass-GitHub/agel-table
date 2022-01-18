import agelTable from './agel-table.js';


agelTable.install = function (vue, opts = {}) {
  vue.prototype.$agelTableConfig = opts;
  vue.component(agelTable.name, agelTable);
}

export default agelTable;
