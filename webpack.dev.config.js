const { join, resolve } = require('path')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: join(__dirname, 'public'),
    compress: true,
    port: 9000
  }
}
