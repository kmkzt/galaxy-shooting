const webpack = require('webpack')
const { join, resolve } = require('path')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },
  devServer: {
    contentBase: join(__dirname, 'dist'),
    compress: true,
    hot: true,
    port: 9000,
    watchContentBase: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
