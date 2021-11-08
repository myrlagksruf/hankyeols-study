const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        index: './src/index.ts'
    },
    devtool: 'inline-source-map',
    mode:'development',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },{
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }        
        ],
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename:'index.html',
            chunks:['index']
        })
    ],
    cache: {
        type: 'filesystem',
        cacheDirectory: path.resolve(__dirname, '.webpack_cache')
    },
};