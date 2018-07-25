const path = require('path');

const commonOptions = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
};

const webConfig = {
  ...commonOptions,
  target: 'web',
  entry: './web/index.ts',
  devtool: 'inline-source-map',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'web')
  }
};

const consoleConfig = {
  ...commonOptions,
  target: 'node',
  entry: './console/main.ts',
  devtool: 'inline-source-map',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'console')
  }
};

module.exports = [ webConfig, consoleConfig ];
