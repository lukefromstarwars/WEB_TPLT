'use strict';
const path = require('path');
const glob = require('glob-all');
const isProd = process.env.NODE_ENV === 'production';

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');


const paths = {
    src: path.join(__dirname, 'src'),
    dist: path.join(__dirname, 'wwwroot/dist'),
    views: path.join(__dirname, 'Views')
};

console.log(process.env.NODE_ENV);
//console.log(paths.dist + '\\index.html');
//console.log(paths.src + '\\app.js');

// DEV
const cssDev = [
    {
        loader: 'style-loader'
    },
    {
        loader: 'css-loader'
    },
    {
        loader: 'postcss-loader',
        options: {
            plugins: function () {
                return [
                    require('precss'),
                    require('autoprefixer')
                ];
            }
        }
    }, {
        loader: 'sass-loader'
    }
];


const servDev = {
    progress: true,
    compress: false,
    contentBase: '.',
    host: 'localhost',
    port: 9000,
    open: true,
    stats: 'errors-only',
    hot: true
};

// PROD
const cssProd = ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: [
        'css-loader',
        'postcss-loader',
        'sass-loader'
    ],
    publicPath: paths.dist
});

const servProd = {
    progress: true,
    compress: true,
    contentBase: '.'
};

// SET CONFIG
const cssConfig = isProd ? cssProd : cssDev;
const serverConfig = isProd ? servProd : servDev;
const devtoolConfig = isProd ? 'source-map' : 'cheap-eval-source-map';

module.exports = {
    entry: {
        jqueryValidation: ['jquery-validation', 'jquery-validation-unobtrusive'],
//        fa: paths.src + '\\fa.js',
        app: paths.src + '\\app.js'
    },
    output: {
        path: paths.dist,
        filename: 'js/[name].bundle.js'
    },
    devtool: devtoolConfig,
    devServer: serverConfig,
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: cssConfig
            },
            {
                test: /.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/', // where the fonts will go
                            //                            publicPath: paths.dist
                            publicPath: '../fonts/' // override the default path
                        }
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg|ico)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/', // where the fonts will go
                            //                            publicPath: paths.dist
                            publicPath: '../assets/' // override the default path
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['app', 'jqueryValidation'],
            minChunks: 2
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            "window.jQuery": 'jquery',
            Tether: 'tether',
            "window.Tether": 'tether',
        }),
        new HtmlWebpackPlugin({
            title: 'BxlCare',
            template: paths.src + '\\index.html',
            favicon: paths.src + '\\img\\favicon.ico',
            minify: {
                collapseWhitespace: isProd,
                minifyJS: isProd,
                minifyCSS: isProd
            },
            hash: isProd,
            showErrors: !isProd
        }),
        new ExtractTextPlugin({
            filename: 'css/[name].css',
            disable: !isProd,
            allChunks: true
        }),
        //        new PurifyCSSPlugin({
        //            paths: glob.sync([
        //                paths.src + '\\index.html',
        ////                paths.dist + '\\tmpPurifyCss\\*.html',
        ////                paths.dist + '\\**\\*.js',
        ////                paths.views + '\\Shared\\**\\*.cshtml'
        //            ]),
        ////            paths: glob.sync([
        ////                path.join(__dirname, 'wwwroot/*.html'),
        ////                path.join(__dirname, 'wwwroot/**/*.js'),
        ////                path.join(__dirname, 'src/tmpPurifyCss/*.html')
        ////            ]),
        //            purifyOptions: {
        //                info: true,
        //                minify: isProd,
        //                whitelist: [ '*:not*' ]
        //            }
        //        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
};