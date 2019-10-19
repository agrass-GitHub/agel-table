const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);
const production = process.env.NODE_ENV === 'production';

module.exports = {
  title: 'agel-table | 使用文档',
  description: '基于 element-ui table 的二次封装组件',
  dest: './dist',
  base: production ? './' : '/',
  themeConfig: {
    updatePopup: true,
    nav: [
      { text: '首页', link: '/' },
      {
        text: '文档',
        items: [
          { text: '介绍', link: '/guide' },
          { text: 'Api', link: '/api' },
          { text: '总结', link: '/sum' },
          { text: '日志', link: '/log' }
        ]
      },
      { text: '演示', link: '/demo' },
      { text: 'Github', link: 'https://github.com/agrass-GitHub/agel-table' }
    ],
    sidebar: [['/guide', '介绍'], '/api', '/sum', '/log']
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('src'));
  }
};
