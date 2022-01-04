const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const { TuneDtsPlugin } = require('@efox/emp-tune-dts-plugin');
const path = require('path');
const deps = require('./package.json').dependencies;

const createName = 'tickets.d.ts'
const createPath = './src/@types'

module.exports = {
  entry: './src/index',
  cache: false,
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /bootstrap\.tsx$/,
        loader: require.resolve('bundle-loader'),
        options: {
          lazy: true,
        },
      },
      {
        test: /\.tsx?$/,
        loader: require.resolve('babel-loader'),
        exclude: /node_modules/,
        options: {
          presets: [require.resolve('@babel/preset-react'), require.resolve('@babel/preset-typescript')],
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'app1',
      library: { type: 'var', name: 'app1' },
      filename: 'remoteEntry.js',
      shared: {
        ...deps,
        react: {
          singleton: true,
        },
        'react-dom': {
          singleton: true,
        },
      },
    }),
    new TuneDtsPlugin({
      output: path.join(createPath, createName),
      path: createPath,
      name: createName,
      isDefault:true
    })
  ],
};
