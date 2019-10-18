import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import agelTable from '../../src';

export default ({ Vue }) => {
  import('./style/index.styl');
  Vue.use(Element);
  Vue.use(agelTable);
};
