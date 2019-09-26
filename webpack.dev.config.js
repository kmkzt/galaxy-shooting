const { join, resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')

const config = {
  devtool: 'source-map',
  plugins: [
    new Dotenv({
      path: 'production.env',
      safe: false
    }),
    new HtmlWebpackPlugin({
      template: resolve('template.html')
    })
  ],

  devServer: {
    contentBase: join(__dirname, 'public'),
    compress: true,
    port: 9000
  }
}

module.exports = config
