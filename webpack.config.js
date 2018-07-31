const path = require('path');
var nodeExternals = require('webpack-node-externals');

function moduleExists(name) {
  try {
    require(name);
    return true;
  } catch (e) {
    return false;
  }
}

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
  entry: './web/index.tsx',
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
  externals: [nodeExternals()],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'console')
  }
};

const smsConfig = {
  ...commonOptions,
  target: 'node',
  entry: './sms/app.ts',
  devtool: 'inline-source-map',
  mode: 'development',
  externals: [nodeExternals()],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'sms')
  }
};

const smsLambdaConfig = {
  ...commonOptions,
  target: 'node',
  entry: './sms/lambda.ts',
  devtool: 'inline-source-map',
  mode: 'development',
  externals: [nodeExternals()],
  output: {
    filename: 'lambda.bundle.js',
    path: path.resolve(__dirname, 'sms'),
    library: "handler",
    libraryExport: "default",
    libraryTarget: "commonjs"
  }
};

const configs = [
  webConfig, consoleConfig, smsConfig
];

if (moduleExists('aws-sdk')) {
  configs.push(smsLambdaConfig);
}

module.exports = configs;
