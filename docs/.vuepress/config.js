module.exports = {
  title: 'agel-table | Vue 2 表格组件',
  description: '基于 Vue 2 与 Element UI 2 的声明式表格组件，支持分页请求、列配置、合并、自适应高度和固定行高虚拟滚动。',
  dest: './distdocs',
  base: '/agel-table/',
  themeConfig: {
    updatePopup: true,
    displayAllHeaders: true,
    nav: [
      { text: '首页', link: '/' },
      { text: '使用指南', link: '/example.html' },
      { text: 'API 参考', link: '/api.html' },
      { text: '更新日志', link: '/log.html' },
      { text: 'Github', link: 'https://github.com/agrass-GitHub/agel-table' }
    ],
    sidebar: {
      '/example/': [
        {
          title: '使用指南',
          collapsable: false,
          children: ['/example.html']
        },
        {
          title: 'API 参考',
          children: ['/api.html']
        }
      ],
      '/api/': [
        {
          title: 'API 参考',
          collapsable: false,
          children: ['/api.html']
        },
        {
          title: '使用指南',
          children: ['/example.html']
        }
      ]
    }
  },
};
