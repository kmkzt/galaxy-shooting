const { join, resolve } = require('path')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const Dotenv = require('dotenv-webpack')

const config = {
  mode: 'production',
  devtool: false,
  output: {
    path: resolve('dist')
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        loader: 'image-webpack-loader',
        options: {
          mozjpeg: {
            progressive: true,
            quality: 50
          },
          // optipng.enabled: false will disable optipng
          optipng: {
            enabled: false
          },
          pngquant: {
            quality: [0.5, 0.65],
            speed: 4
          },
          gifsicle: {
            interlaced: false
          },
          // the webp option will enable WEBP
          webp: {
            quality: 50
          }
        }
      }
    ]
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
