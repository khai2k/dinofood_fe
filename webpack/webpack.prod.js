process.env.NODE_ENV = 'production'

const path = require('path')
const isWsl = require('is-wsl')
const merge = require('webpack-merge')
const CopyPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const safePostCssParser = require('postcss-safe-parser')
const CompressionPlugin = require('compression-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const paths = require('./config/paths')
const common = require('./webpack.common.js')

const firstRequire = {
  plugins: [
    new SWPrecacheWebpackPlugin({
      // By default, a cache-busting query parameter is appended to requests
      // used to populate the caches, to ensure the responses are fresh.
      // If a URL is already hashed by Webpack, then there is no concern
      // about it being stale, and the cache-busting can be skipped.
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'service-worker.js',
      logger(message) {
        if (message.indexOf('Total precache size is') === 0) {
          // This message occurs for every build and is a bit too noisy.
          return
        }
        console.log(message)
      },
      minify: true,
      // For unknown URLs, fallback to the index page
      navigateFallback: paths.servedPath.slice(0, -1) + '/index.html',
      // Ignores URLs starting from /__ (useful for Firebase):
      // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
      navigateFallbackWhitelist: [ /^(?!\/__).*/ ],
      // Don't precache sourcemaps (they're large) and build asset manifest:
      staticFileGlobsIgnorePatterns: [ /\.map$/, /asset-manifest\.json$/ ],
      // Work around Windows path issue in SWPrecacheWebpackPlugin:
      // https://github.com/facebookincubator/create-react-app/issues/2235
      stripPrefix: paths.appBuild.replace(/\\/g, '/') + '/'
    }),
    new CleanWebpackPlugin(),
    new CompressionPlugin({ test: /\.(css|js|html|svg)$/ })
    // new CompressionPlugin({ test: /\.js$/ })
    // new BundleAnalyzerPlugin()
  ]
}

module.exports = merge(firstRequire, common, {
  mode: 'production',
  bail: true,
  devtool: false,

  entry: [
    require.resolve('./config/polyfills'),
    paths.appIndexJs
  ],

  // https://webpack.js.org/configuration/output/#template-strings
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: paths.appBuild,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: 'static/js/[name].[hash].js',
    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: 'static/js/[name].[hash].js',
    // This is the URL that app is served from. We use "/" in development.
    publicPath: '/',
    // Point sourcemap entries to original disk location
    devtoolModuleFilenameTemplate: info => path.relative(paths.appSrc, info.absoluteResourcePath)
  },

  plugins: [],

  // https://webpack.js.org/configuration/optimization
  optimization: {
    nodeEnv: 'production',
    // Minify the code.
    minimize: true,
    minimizer: [
      // This is only used in production mode
      new TerserPlugin({
        terserOptions: {
          parse: {
            // We want terser to parse ecma 8 code. However, we don't want it
            // to apply any minification steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending further investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2
          },
          mangle: {
            safari10: true
          },
          // Added for profiling in devtools
          keep_classnames: true,
          keep_fnames: true,
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true
          }
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        // Disabled on WSL (Windows Subsystem for Linux) due to an issue with Terser
        // https://github.com/webpack-contrib/terser-webpack-plugin/issues/21
        parallel: !isWsl,
        // Enable file caching
        cache: true,
        sourceMap: true
      }),
      // This is only used in production mode
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: {
            // `inline: false` forces the sourcemap to be output into a
            // separate file
            inline: false,
            // `annotation: true` appends the sourceMappingURL to the end of
            // the css file, helping the browser find the sourcemap
            annotation: true
          }
        }
      }),
      new CopyPlugin([
        {
          from: path.resolve(paths.appPublic, 'favicon.ico'),
          to: path.resolve(paths.appBuild, 'favicon.ico'),
          toType: 'file'
        },
        {
          from: path.resolve(paths.appPublic, 'favicon-16x16.png'),
          to: path.resolve(paths.appBuild, 'favicon-16x16.png'),
          toType: 'file'
        },
        {
          from: path.resolve(paths.appPublic, 'favicon-32x32.png'),
          to: path.resolve(paths.appBuild, 'favicon-32x32.png'),
          toType: 'file'
        },
        {
          from: path.resolve(paths.appPublic, 'apple-touch-icon.png'),
          to: path.resolve(paths.appBuild, 'apple-touch-icon.png'),
          toType: 'file'
        },
        {
          from: path.resolve(paths.appPublic, 'android-chrome-192x192.png'),
          to: path.resolve(paths.appBuild, 'android-chrome-192x192.png'),
          toType: 'file'
        },
        {
          from: path.resolve(paths.appPublic, 'android-chrome-512x512.png'),
          to: path.resolve(paths.appBuild, 'android-chrome-512x512.png'),
          toType: 'file'
        },
        {
          from: path.resolve(paths.appPublic, 'static'),
          to: path.resolve(paths.appBuild, 'static'),
          toType: 'dir'
        }
      ])
    ],

    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
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
})
