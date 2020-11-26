const path = require('path')
const autoprefixer = require('autoprefixer')
const pxtorem = require('postcss-pxtorem')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const NODE_ENV = process.env.NODE_ENV
const noUglify = process.env.noUglify

const productionConfig = () => {
  if (NODE_ENV === 'production') {
    return {
      plugins:[
        // 开启zip 如果服务器有这个配置 可以不需要
        // new CompressionWebpackPlugin({
        //   test: /\.(js|css)$/,
        //   threshold: 10240,
        //   deleteOriginalAssets: false
        // })
      ]
    }
  } else {
    return {
      plugins:[]
    }
  }
}
module.exports = {
  chainWebpack: config=>{
    config.plugins.delete('prefetch');
    if (NODE_ENV === 'production' && noUglify != "1") {
      //https://github.com/tcoopman/image-webpack-loader
      config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
          // optipng.enabled: false will disable optipng
          optipng: {
            enabled: true,
          },
          pngquant: {
            quality: [0.45, 0.80],
            speed: 2
          }
      })
      .end()
    }
    
  },
  lintOnSave: false,
  productionSourceMap: NODE_ENV != 'production', // 生产环境去除map
  publicPath: NODE_ENV === 'production' ? '/xmWap/' : '/',
  // 配置一下基础配置
  configureWebpack: {
    resolve: {
      alias: {}
    },
    plugins: [
      // 开发环境不执行
      ...productionConfig().plugins
    ],
  },
  // css的配置
  css: {
    loaderOptions: {
      less: {
        // 配置可换肤
        modifyVars: {
          '@test': '#DB2F2F'
        }
      },
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 30,
            propList: ['*']
          })
        ]
      }
    }
  },
  // 开发环配置
  devServer: {
    port: 9922,
    open: true
  }
}
