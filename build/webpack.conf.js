const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const config = require('../config/client')

const isDev = process.env.NODE_ENV !== 'production'
const styleLoader = isDev ? 'style-loader' : MiniCssExtractPlugin.loader

module.exports = {
  mode: isDev ? 'development' : 'production',

  entry: './client',

  output: {
    path: path.resolve(__dirname, '../server/public'),
    publicPath: `${config.clientBaseUrl}/`,
    filename: path.posix.join('assets', isDev ? '[name].js' : '[name].[chunkhash].js'),
    chunkFilename: path.posix.join('assets', '[chunkhash].js')
  },

  devtool: isDev ? 'cheap-module-eval-source-map' : 'hidden-source-map',

  resolve: {
    mainFiles: ['index', 'Index'],

    extensions: ['.js', '.json', '.vue'],

    alias: {
      '@': path.resolve(__dirname, '../client')
    }
  },

  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all'
    }
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(vue|js)$/,
        use: ['eslint-loader']
      },

      {
        test: /\.vue$/,
        use: ['vue-loader']
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },

      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              root: path.resolve(__dirname, '../client'),
              attrs: ['img:src', 'link:href']
            }
          }
        ]
      },

      {
        test: /\.less/,
        use: [styleLoader, 'css-loader', 'postcss-loader', 'less-loader']
      },

      {
        test: /\.scss$/,
        use: [styleLoader, 'css-loader', 'postcss-loader', 'sass-loader']
      },

      {
        test: /\.css$/,
        use: [styleLoader, 'css-loader', 'postcss-loader']
      },

      {
        test: /favicon\.png$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash]'
            }
          }
        ]
      },

      {
        test: /\.(png|jpe?g|gif|svg|mp4|webm|ogg|mp3|wav|flac|aac|eot|ttf|otf|woff?2)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new VueLoaderPlugin(),

    new HtmlWebpackPlugin({
      template: 'client/index.html'
    }),

    new webpack.HashedModuleIdsPlugin()
  ],

  performance: {
    hints: isDev ? false : 'warning'
  }
}

if (isDev) {
  module.exports.entry = ['webpack-hot-middleware/client', './client']

  module.exports.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )
} else {
  module.exports.optimization.minimizer = [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true
    }),
    new OptimizeCSSAssetsPlugin()
  ]

  module.exports.plugins.push(
    new MiniCssExtractPlugin({
      filename: path.posix.join('assets', '[name].[chunkhash].css'),
      chunkFilename: path.posix.join('assets', '[chunkhash].css')
    })
  )
}
