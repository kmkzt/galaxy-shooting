const { join, resolve } = require('path')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const Dotenv = require('dotenv-webpack')

const config = {
  mode: 'production',
  devtool: false,
  output: {
    path: resolve('docs')
  }
  // optimization: {
  //   minimizer: [
  //     new UglifyJsPlugin({
  //       parallel: true
  //     })
  //   ]
  // }
}

module.exports = config
