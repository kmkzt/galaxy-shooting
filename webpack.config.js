const { resolve } = require('path')
const { smart } = require('webpack-merge')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')

const devMode = process.env.NODE_ENV === 'development'
const config = devMode
  ? require('./webpack.dev.config')
  : require('./webpack.prod.config')

const jsEntry = resolve(__dirname, 'src/index')
/** @type {import('webpack').Configuration} */
const common = {
  entry: {
    app: devMode ? ['react-hot-loader/patch', jsEntry] : jsEntry
  },
  output: {
    path: resolve('dist'),
    filename: '[name].[hash].bundle.js'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'eslint-loader',
            options: {
              failOnWarning: true,
              fix: true
            }
          }
        ]
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(3ds|abc|fbx|mtl|obj|x3d|zip|meta|drc)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/models'
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        include: /textures/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/textures'
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        exclude: /textures/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/images'
            }
          }
        ]
      },
      { test: /\.html$/, use: 'html-loader' }
    ]
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: resolve(__dirname, 'tsconfig.json')
      })
    ]
  },

  plugins: [
    new Dotenv({
      path: 'production.env',
      safe: false
    }),
    new CaseSensitivePathsPlugin(),
    new ForkTsCheckerWebpackPlugin({
      reportFiles: ['src/**/*.{ts,tsx}']
    }),
    new HtmlWebpackPlugin({
      template: resolve('template.html')
    }),
    new CopyPlugin([
      {
        from: 'node_modules/three/examples/js/libs/draco',
        to: 'libs/draco'
      }
    ])
  ],

  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: '~',
      cacheGroups: {
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
}

module.exports = smart(common, config)
