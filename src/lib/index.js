import agelTable from './agel-table.vue';

if (typeof window !== 'undefined' && window.Vue) {
  agelTable.install(window.Vue);
}

export default agelTable;
