const { join, resolve } = require('path')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  output: {
    path: resolve('public')
  },
  devServer: {
    contentBase: join(__dirname, 'public'),
    compress: true,
    port: 9000
  }
}
