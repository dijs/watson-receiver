/* eslint-disable */

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
  context: __dirname + '/app',
  entry: {
    app: './index.js',
  },
  output: {
    path: __dirname + '/public',
    filename: 'js/bundle.js',
    publicPath: '',
  },
  devServer: {
    open: true, // to open the local server in browser
    contentBase: __dirname + '/src',
  },
  plugins: [new HtmlWebpackPlugin({
    template: './template.html'
  })],
  module: {
    rules: [
      {
        test: /\.js$/, //Check for all js files
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['latest', 'react'],
            plugins: ['transform-class-properties']
          }
        }]
      },
      {
        test: /\.s?css$/,
        use: [{
            loader: "style-loader" // creates style nodes from JS strings
        }, {
            loader: "css-loader" // translates CSS into CommonJS
        }, {
            loader: "sass-loader" // compiles Sass to CSS
        }]
      }
    ]
  },
  devtool: 'eval-source-map' // Default development sourcemap
};

// Check if build is running in production mode, then change the sourcemap type
if (process.env.NODE_ENV === "production") {
  config.devtool = "source-map";

  // Can do more here
  // JSUglify plugin
  // Offline plugin
  // Bundle styles seperatly using plugins etc,
}

module.exports = config;
