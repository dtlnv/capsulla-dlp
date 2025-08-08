const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const config = {
    entry: {
        content: path.resolve(__dirname, './src/content/index'),
        'service-worker': path.resolve(__dirname, './src/service-worker/index'),
        options: path.resolve(__dirname, './src/content/options/index.tsx'),
        popup: path.resolve(__dirname, './src/content/popup/index.tsx'),
    },
    output: {
        path: path.join(__dirname, './build/src'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.ts(x)?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, './public/manifest.json'), to: path.resolve(__dirname, './build/manifest.json') },
                { from: path.resolve(__dirname, './public/options.html'), to: path.resolve(__dirname, './build/options.html') },
                { from: path.resolve(__dirname, './public/popup.html'), to: path.resolve(__dirname, './build/popup.html') },
                { from: path.resolve(__dirname, './public/images'), to: path.resolve(__dirname, './build/images') },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
        new CleanWebpackPlugin(),
    ],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
};

module.exports = config;
