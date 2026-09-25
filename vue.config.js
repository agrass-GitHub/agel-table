const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);
const production = process.env.NODE_ENV === 'production';
const babelPreset = require.resolve('@vue/babel-preset-app/package.json', { paths: [require.resolve('@vue/cli-plugin-babel/package.json')] });

module.exports = {
  publicPath: production ? './' : '/',
  productionSourceMap: production ? false : true,
  css: {
    extract: false
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('src'));
    // 沿用 CLI 3 的 core-js 2 polyfill，不依赖 npm 扁平提升，也不新增运行时依赖。
    config.resolve.alias.set('core-js', path.dirname(require.resolve('core-js/package.json', { paths: [babelPreset] })));
  },
  configureWebpack: {
    // Vue CLI 3 的 loader 名称在 pnpm 隔离依赖下不可直接解析，复用其已安装的 loader。
    resolveLoader: {
      alias: ['cache-loader', 'thread-loader', 'babel-loader', 'vue-loader'].reduce((aliases, name) => {
        aliases[name] = require.resolve(name, {
          paths: [require.resolve('@vue/cli-plugin-babel/package.json'), require.resolve('@vue/cli-service/package.json')]
        })
        return aliases
      }, {})
    },
    output: {
      libraryExport: 'default'
    }
  }
};

// npm config set registry http://registry.npm.taobao.org/
// npm config set registry https://registry.npmjs.org/
