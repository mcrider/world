const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const config = {
  /**
   * Define your assets path here. Assets path is your theme path without host.
   * This is for Webpack that it can handle assets relative path right.
   */
  assetsPath: '/wp-content/themes/world/',

  /**
   * Define here your dev server url here. his is for Browsersync.
   */
  devUrl: 'http://localhost:3000/',
};

const inProduction = process.env.NODE_ENV === 'production';
// const styleHash = inProduction ? 'contenthash' : 'hash';
// const scriptHash = inProduction ? 'chunkhash' : 'hash';

module.exports = {
  entry: {
    app: glob.sync('./assets/+(js|styles)/main.+(s[ac]ss|js)'),
    vendor: ['jquery'],
  },
  output: {
    path: path.resolve(__dirname, 'static/'),
    filename: `js/[name].js`,
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { minimize: inProduction },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true },
            },
          ],
        }),
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
              publicPath: `${config.assetsPath}static/`,
            },
          },
          'image-webpack-loader',
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[hash:7].[ext]',
          outputPath: 'fonts/',
          publicPath: `${config.assetsPath}static/`,
        },
      },
    ],
  },

  resolve: {
    alias: {
      images: path.join(__dirname, '../resources/assets/images'),
    },
    extensions: ['*', '.js', '.json'],
  },

  plugins: [
    new ExtractTextPlugin(`css/[name].css`),

    new BrowserSyncPlugin({
      host: 'localhost',
      port: 4000,
      proxy: config.devUrl, // YOUR DEV-SERVER URL
      ghostMode: false,
      open: false,
      notify: false,
      files: ['./*.php', './resources/views/**/*.twig', './static/*.*'],
    }),

    new CleanWebpackPlugin(['static/css/*', 'static/js/*'], {
      watch: true,
      root: path.resolve(__dirname, '../'),
    }),

    new ManifestPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: `js/[name].js`,
    }),
  ],
};

if (inProduction) {
  module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin());

  module.exports.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"',
    },
  }));
}
