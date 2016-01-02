import webpack from 'webpack';
import LessPluginCleanCSS from 'less-plugin-clean-css';

import path from 'path';

import { readFileSync } from 'fs';

const babelOpts = JSON.parse(readFileSync(`${__dirname}/.babelrc`));

const rootModules = path.resolve('node_modules');

export default {
  entry: './src',
  output: {
    libraryTarget: 'var',
    library: 'SettingsPanel',
    path: './dist',
    filename: 'settings-panel.js'
  },
  externals: {
  },
  module: {
    loaders: [
      { test: /\.less$/, loader: 'style!css!less' },
      { test: /\.png$/, loader: 'url-loader?mimetype=image/png' },
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        loader: 'babel',
        query: babelOpts
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      fetch: 'imports?self=>global!exports?global.fetch!whatwg-fetch'
    })
  ],
  lessLoader: {
    lessPlugins: [
      new LessPluginCleanCSS({advanced: true})
    ]
  }
};
