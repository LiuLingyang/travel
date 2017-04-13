var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  entry:{
    index:"./client/js/page/index"
  },
  output: {
    path: __dirname + '/public',
    filename: "./bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    // copy file from /client/assets
    new CopyWebpackPlugin([{
      from: 'client/assets'
    }]),

    new CopyWebpackPlugin([{
      from: 'client/views'
    }])
  ],
  devtool: 'eval',
  watch: true
}