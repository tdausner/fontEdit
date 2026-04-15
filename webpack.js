const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    devServer: {
        static: {
            directory: path.join(__dirname, "./"),
        },
        compress: true,
        historyApiFallback: true,
        open: true,
        hot: true,
        port: 9000,
        devMiddleware: {
            writeToDisk: true,
        },
    },
    optimization: {
        minimize: true
    },
    entry: {
        index: './src/index.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './app'),
        clean: true
    },
    resolve: {
        extensions: ['.js', '.scss'],
        modules: ['node_modules'],
        fallback: {
            'querystring': require.resolve('querystring-es3')
        }
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            api: 'modern-compiler'
                        }
                    }
                ]
            },
            {
                test: /\.woff2$/i,
                type: 'asset/resource',
                generator: {
                    filename: '[name][ext]'
                }
            }
        ]
    }
};
