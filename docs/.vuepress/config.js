module.exports = {
  title: 'agel-table | 使用文档',
  description: '基于 element-ui table 的二次封装组件',
  dest: './dist',
  base: '/agel-table/',
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
      { text: 'Github', link: 'https://github.com/agrass-GitHub/agel-table' }
    ],
    sidebar: [['/guide', '介绍'], '/api', '/sum', '/log']
  },
  plugins: {
    run: {
      jsLabs: ['https://unpkg.com/element-ui/lib/index.js'],
      cssLabs: ['https://unpkg.com/element-ui/lib/theme-chalk/index.css'],
      reverse: true,
    }
  },
};
