// webpack.prod.js
const path = require("path");
const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
    mode: 'production',

    // output: {
    //     filename: "bundle.js",
    //     path: path.resolve(__dirname, "dist"),
    //     publicPath: './',
    // },
    output: {
        filename:  '[name].bundle.js',
        library: 'Teamgrit_SDK',
        libraryExport: 'default',
        libraryTarget: 'window',
        path: path.resolve(__dirname, './dist'),
      },
});