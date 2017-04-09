var path = require('path');
module.exports = {
  entry:{
    index:"./client/js/page/index",
    search:"./client/js/page/search",
    confirm:"./client/js/page/confirm",
    show:"./client/js/page/show"
  },
  output: {
    path: __dirname,
    filename: "./public/[name].bundle.js"
  },
  module: {
    loaders: [
      {
        test: path.join(__dirname, 'client'),
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  devtool: 'eval',
  watch: true
}