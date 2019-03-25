/* This file is processed by node.js, and node.js does not understand ES6 imports by default, just ES5/CommonJS. */
const path = require('path');

module.exports = {
    entry: {
        LisaGraphs: './src/LisaGraphs.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'var',
        library: 'lg'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    modules: false
                                }
                            ]
                        ]
                    }
                }
            }
        ]
    }
};