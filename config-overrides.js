const path = require('path')
const fs = require('fs')
const { getLoader } = require('react-app-rewired')
const tsImportPluginFactory = require('ts-import-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}
module.exports = function override(config, env) {
  // 增加引入文件类型
  config.resolve.extensions = config.resolve.extensions.concat(['.less'])

  // 增加 alias
  config.resolve.alias = Object.assign({}, config.resolve.alias, {
    src: resolve('./src')
  })

  if (process.env.REACT_APP_ENV === 'development') {
    config.module.rules.push({
      test: /\.less$/,
      use: ['style-loader', 'css-loader', { loader: 'less-loader' }]
    })
  } else {
    config.module.rules.push({
      test: /\.less$/,
      loader: ExtractTextPlugin.extract(
        Object.assign({
          fallback: require.resolve('style-loader'),
          use: [
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                minimize: true
              }
            },
            { loader: 'less-loader' }
          ]
        })
      )
    })
  }

  // 引入antd
  const tsLoader = getLoader(
    config.module.rules,
    rule => rule.loader && typeof rule.loader === 'string' && rule.loader.includes('ts-loader')
  )
  
  tsLoader.options = {
    getCustomTransformers: () => ({
      before: [
        tsImportPluginFactory([
          {
            libraryName: 'antd',
            libraryDirectory: 'es',
            style: 'css'
          },
          {
            style: false,
            libraryName: 'lodash',
            libraryDirectory: null,
            camel2DashComponentName: false
          }
        ])
      ]
    })
  }
  // 移除file-loader配置中less文件匹配
  const fileLoader = getLoader(
    config.module.rules,
    rule => rule.loader && typeof rule.loader === 'string' && rule.loader.match('file-loader')
  )

  fileLoader.exclude.push(/\.less$/)

  // RegExp.prototype.toJSON = RegExp.prototype.toString
  // Function.prototype.toJSON = Function.prototype.toString
  // fs.writeFileSync('webpack-config.json', JSON.stringify(config, null, 2))
  return config
}
