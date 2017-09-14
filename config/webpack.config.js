const { resolve } = require('path'),
  rootDirectory = resolve(__dirname, '../'),
  LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

module.exports = {
  entry: './index.js',
  output: {
    path: resolve(rootDirectory, 'lib'),
    filename: 'q3000.js',
    sourceMapFilename: 'q3000.map',
    library: 'q3000',
    libraryTarget: 'umd'
  },
  context: resolve(rootDirectory, 'src'),
  devtool: 'cheap-eval-source-map',
  resolve: {
    extensions: ['.js', '.json'],
    modules: [
      resolve(rootDirectory, 'node_modules'),
      resolve(rootDirectory, 'src')
    ]
  },
  module: {
    exprContextCritical: false,
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      }
    ]
  },
  plugins: [
    new LodashModuleReplacementPlugin()
  ]
}
