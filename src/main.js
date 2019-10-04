import Vue from 'vue';
import App from './example';
import agelTable from './lib';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
Vue.use(ElementUI, { size: 'small' });
Vue.use(agelTable, {
  name: 'agel-table',
  table: {
    class: 'custom-class'
  },
  column: {
    resizable: false
  },
  page: {
    pageSize: 5,
    pageSizes: [5, 10, 15, 20]
  }
});

new Vue({ render: (h) => h(App) }).$mount('#app');
