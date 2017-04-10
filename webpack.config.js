var path = require('path');
module.exports = {
  entry:{
    index:"./client/js/page/index"
  },
  output: {
    path: __dirname,
    filename: "./public/bundle.js"
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
  devtool: 'eval',
  watch: true
}