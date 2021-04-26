const path = require("path");
const webpack = require("webpack");
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const EncodingPlugin = require('webpack-encoding-plugin');

const config = {
    mode: 'production',
    entry: ['babel-polyfill', './resources/scss/stylesheet.scss', './index.js'],
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "js/index.js"
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /\/node_modules\//,
            loader: "babel-loader"
        },
            {
                test: /\.scss$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'css/[name].css',
                        minimize: true,
                        sourceMap: true,
                        publicPath: '../',
                        useRelativePaths: true
                    }
                },
                    "extract-loader",
                    "css-loader",
                    'sass-loader',
                ]
            },
            {
                test: /\.ttf$/,
                loader: 'url-loader',
                options: {
                    limit: 100000
                }
            },
            {
                test: /\.(png|jpg|gif|wav|ogg)$/,
                loader: 'file-loader',
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            inject: 'body'
        }),
        new EncodingPlugin({
            encoding: 'utf-16'
        })
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "$": path.resolve(__dirname, "./")
        }
    },
    target: "web"
};

webpack(config, (err, stats) => {
    if (err || stats.hasErrors()) {
        console.error(`Could not build! ${err}`)
    } else {
        console.log(`Build successfull!`)
    }
});

// const port = 8080;

// const compiler = webpack(config);
// const server = new WebpackDevServer(compiler, {
//     contentBase: path.join(__dirname, './dist')
// });

// server.listen(port, 'localhost', function(err) {
//     if (err) throw err;
// });