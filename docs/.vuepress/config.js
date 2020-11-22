module.exports = {
  title: 'agel-table | 使用文档',
  description: '基于 element-ui table 的二次封装加强组件',
  dest: './distdocs',
  base: '/agel-table/',
  themeConfig: {
    updatePopup: true,
    nav: [
      { text: '首页', link: '/' },
      { text: '演示教程', link: '/example' },
      { text: 'API', link: '/api' },
      { text: '总结', link: '/sum' },
      { text: 'Github', link: 'https://github.com/agrass-GitHub/agel-table' }
    ],
  },
  plugins: {
    run: {
      jsLabs: [
        "https://unpkg.com/element-ui/lib/index.js",
        "https://cdn.jsdelivr.net/gh/agrass-GitHub/agel-table@0.11/dist/agel-table.umd.min.js"
      ],
      cssLabs: ['https://unpkg.com/element-ui/lib/theme-chalk/index.css'],
      css: ".el-table__column-resize-proxy {display:none}",
      reverse: true,
    }
  },
};
