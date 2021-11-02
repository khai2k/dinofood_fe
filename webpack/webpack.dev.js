process.env.NODE_ENV = 'development'
const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const paths = require('./config/paths')

module.exports = merge(common, {
  // https://webpack.js.org/configuration/mode/#usage
  mode: 'development',

  // https://webpack.js.org/configuration/devtool/#devtool
  devtool: 'eval-source-map',

  devServer: {
    publicPath: paths.publicPath,
    contentBase: paths.appPublic,
    host: '0.0.0.0',
    port: process.env.PORT || 8080,
    hot: true,
    quiet: true,
    inline: true,
    compress: true,
    watchContentBase: true,
    disableHostCheck: true,
    historyApiFallback: true,
    watchOptions: {
      ignored: /node_modules/
    },
    proxy: {
      '/api': {
        target: process.env.API_PROXY || 'https://api.onib.link',
        secure: false,
        changeOrigin: true
      }
    }
  },

  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in JS bundle.
  // The first two entry points enable "hot" CSS and auto-refreshes for JS.
  entry: [
    // Include an alternative client for WebpackDevServer. A client's job is to
    // connect to WebpackDevServer by a socket and get notified about changes.
    // When you save a file, the client will either apply hot updates (in case
    // of CSS changes), or refresh the page (in case of JS changes). When you
    // make a syntax error, this client will display a syntax error overlay.
    // Note: instead of the default WebpackDevServer client, we use a custom one
    // to bring better experience for Create React App users. You can replace
    // the line below with these two lines if you prefer the stock client:
    // require.resolve('webpack-dev-server/client') + '?/',
    // require.resolve('webpack/hot/dev-server'),
    require.resolve('react-dev-utils/webpackHotDevClient'),
    // We ship a few polyfills by default:
    require.resolve('./config/polyfills'),
    // Errors should be considered fatal in development
    require.resolve('react-error-overlay'),
    // Finally, this is your app's code:
    paths.appIndexJs
    // We include the app code last so that if there is a runtime error during
    // initialization, it doesn't blow up the WebpackDevServer client, and
    // changing JS code would still trigger a refresh.
  ],
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: paths.appBuild,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: 'static/js/bundle.js',
    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: 'static/js/[name].chunk.js',
    // This is the URL that app is served from. We use "/" in development.
    publicPath: '/',
    // Point sourcemap entries to original disk location
    devtoolModuleFilenameTemplate: info => path
      .resolve(info.absoluteResourcePath)
      .replace(/\\/g, '/')
  }
})
