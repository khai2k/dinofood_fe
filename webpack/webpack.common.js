const path = require('path')
const webpack = require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')

const paths = require('./config/paths')
const getClientEnvironment = require('./config/env')

const publicUrl = ''
const env = getClientEnvironment(publicUrl)

module.exports = {
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        enforce: 'pre',
        loader: 'webpack-glob-loader'
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        enforce: 'pre',
        use: [
          { loader: 'webpack-glob-loader' },
          {
            loader: 'eslint-loader',
            options: {
              configFile: path.join(__dirname, '../.eslintrc')
            }
          }
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: true
        }
      },
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.scss$/,
          /\.json$/
          // /\.bmp$/,
          // /\.gif$/,
          // /\.jpe?g$/,
          // /\.png$/,
        ],
        test: /\.(png|jpe?g|gif|svg)$/i,
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          name: 'static/media/fonts/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      '_src': path.resolve(__dirname, '../src'),
      '_api': path.resolve(__dirname, '../src/api'),
      '_utils': path.resolve(__dirname, '../src/utils'),
      '_hooks': path.resolve(__dirname, '../src/hooks'),
      '_store': path.resolve(__dirname, '../src/store'),
      '_style': path.resolve(__dirname, '../src/style'),
      '_route': path.resolve(__dirname, '../src/route'),
      '_module': path.resolve(__dirname, '../src/module'),
      '_layout': path.resolve(__dirname, '../src/layout'),
      '_static': path.resolve(__dirname, '../public/static'),
      '_constants': path.resolve(__dirname, '../src/constants'),
      '_components': path.resolve(__dirname, '../src/components')
    }
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.ProgressPlugin(),
    new HtmlWebPackPlugin({
      inject: true,
      template: paths.appHtml
    }),
    new webpack.DefinePlugin(env.stringified),
    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    new ManifestPlugin({
      seed: require('../public/manifest.json')
    })
  ]
}
