/* eslint-disable import/no-extraneous-dependencies  */

const config = require('./webpack.config'),
  BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

config.plugins = config.plugins.concat([
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false
  })
])

module.exports = config
