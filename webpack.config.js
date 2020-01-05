const { resolve } = require('path')
const { smart } = require('webpack-merge')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')

const devMode = process.env.NODE_ENV === 'development'
const config = devMode
  ? require('./webpack.dev.config')
  : require('./webpack.prod.config')

/** @type {import('webpack').Configuration} */
const common = {
  entry: resolve(__dirname, 'src/index'),
  output: {
    filename: '[name].bundle.js'
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
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
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
    alias: {
      '@': resolve(__dirname, 'src')
    },
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
    })
  ]
}

module.exports = smart(common, config)
