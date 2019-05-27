const path = require('path');

module.exports = {
  entry: {
    bundle1: './src/demo1.js',
    bundle2: './src/demo2.js'
  },
  output: {
    filename: '[name].js',
    path:path.resolve(__dirname,'examples/js')
  },
  devServer: {
    contentBase: path.join(__dirname,'examples/html'),
    compress: false,
    port: 9000,
    overlay: true
  }
};
