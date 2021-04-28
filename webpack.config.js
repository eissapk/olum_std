const path = require("path");
const WebpackBeforeBuildPlugin = require('before-build-webpack');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');
const shell = require('shelljs');
const colors = require("colors");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { mode, title, dest, src, hash, comments, asyncAwait } = require("./settings");

const config = {
  mode,
  entry: {
    main: [`./${src}/app.mjs`, `./${src}/app.scss`],
  },
  output: {
    path: path.resolve(__dirname, dest),
    filename: `app[fullhash:${hash}].js`,
  },
  plugins: [
    // new ExtraWatchWebpackPlugin({
    //   files: ["*.*"],
    //   dirs: [ path.resolve(__dirname, "src") ],
    // }),
    // new WebpackBeforeBuildPlugin(function(stats, cb) {
    //   console.log(colors.red("before build"));
    //   shell.exec('node compiler.js compile')
    //   cb(); 
    // }), 
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: [`./${dest}/**/*.*`],
    }),
    new HtmlWebpackPlugin({
      title: title || "PKjs",
      template: "./public/index.html",
      favicon: "./public/favicon.png",
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: comments,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.s[ac]ss|css$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg|webp)$/i,
        type: "asset/resource",
      },
    ],
  },
  externals: {
    lodash: {
      commonjs: "lodash",
      commonjs2: "lodash",
      amd: "lodash",
      root: "_",
    },
  },
};

if (mode === "development") config.devtool = "source-map";
if (asyncAwait) config.entry.main.unshift("babel-polyfill");
module.exports = config;