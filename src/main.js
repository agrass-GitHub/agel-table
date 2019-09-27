import Vue from 'vue';
import App from './example';
import agelTable from './lib';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
Vue.use(ElementUI, {
  size: 'small'
});
Vue.use(agelTable);
new Vue({
  render: (h) => h(App)
}).$mount('#app');
