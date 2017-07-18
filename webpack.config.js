const { resolve } = require('path')

module.exports = {
  devtool: '#source-map',
  entry: {
    'bundle': './src/intersection-comparison.js',
  },
  output: {
    path: __dirname,
    filename: '[name].js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }]
  }
}
