module.exports = {
  mode: 'production',
  devtool: false,
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
  },
  optimization: {
    minimize: true
  }
}
