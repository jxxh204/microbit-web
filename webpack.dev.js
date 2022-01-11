// webpack.dev.js
const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
    mode: 'development',

    devServer: {
        historyApiFallback: true,
        inline: true,
        port: 3000,
        hot: true,
        publicPath: '/',
    }
});