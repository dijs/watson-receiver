var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [
  {
    entry: {
      app: './src/server.js',
    },
    output: {
      path: __dirname + '/dist',
      filename: 'server.js',
      libraryTarget: 'commonjs2',
      publicPath: '/',
    },
    target: 'node',
    node: {
      console: false,
      global: false,
      process: false,
      Buffer: false,
      __filename: false,
      __dirname: false
    },
    externals: nodeExternals(),
    plugins: [

    ],
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
      //   {
      //    test: /\.s?css$/,
      //    loaders: [
      //      'isomorphic-style-loader',
      //      'css-loader?modules&localIdentName=[name]_[local]_[hash:base64:3]'
      //     //  'postcss-loader'
      //    ]
      //  }
      ]
    },
  },
  {
    entry: './src/app/browser.js',
    output: {
      path: __dirname + '/dist/assets',
      publicPath: '/',
      filename: 'bundle.js'
    },
    plugins: [
      new ExtractTextPlugin({
        filename: 'index.css',
        allChunks: true
      })
    ],
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: ['latest', 'react'],
              plugins: ['transform-class-properties']
            }
          }]
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('css-loader')
          // loader: new ExtractTextPlugin({ filename: 'css!sass' })
        }
      ]
    }
    // resolve: {
    //   extensions: ['', '.js', '.jsx']
    // }
  }
];
