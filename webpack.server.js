const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const webpackNodeExternals = require('webpack-node-externals');

const config = {
    // Inform Webpack that we're building a bundle for NodeJS
    // rather than for the browser
    target: 'node',
    // Tell Webpack the root file of our server application
    entry: './src/index.js',
    // Tell Webpack where to put the output file that is generated
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    // This tells webpack to not bundle any libraries into our output bundle on the server
    // if that library exists inside the node_modules folder
    externals: [webpackNodeExternals()]
}

module.exports = merge(baseConfig, config);