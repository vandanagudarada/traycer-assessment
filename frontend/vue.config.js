const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3000  // or any port you want
  },
  pluginOptions: {
    vuetify: {}
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'TaskFlow AI'
      return args
    })
  }
})
