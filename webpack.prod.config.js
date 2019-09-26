const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const Dotenv = require('dotenv-webpack')

const config = {
  devtool: false,
  plugins: [
    new Dotenv({
      path: 'production.env',
      safe: false
    })
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true
      })
    ]
  }
}

module.exports = config
