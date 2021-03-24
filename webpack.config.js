const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const TerserPlugin = require("terser-webpack-plugin");
const { mode, devtool, title, dest, src, hash, comments } = require("./settings");

module.exports = {
  mode,
  // devtool, // uncomment for dev mode
  entry: {
    main: ["babel-polyfill", `./${src}/app.js`, `./${src}/app.scss`],
  },
  output: {
    path: path.resolve(__dirname, dest),
    filename: `app[fullhash:${hash}].js`,
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: [`./${dest}/**/*.*`],
    }),
    new HtmlWebpackPlugin({
      title: title || "PKjs",
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
    }),
    // new WebpackShellPluginNext({
    //   onBuildStart:{
    //     scripts: ['echo "Webpack Start"'],
    //   }, 
    //   onBuildEnd:{
    //     scripts: ['echo "Webpack End"'],
    //   },
    //   onWatchRun:['echo "webpack watch"'],
    // })
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
      // { test: /\.css$/,  use: ["css-loader"] },
    ],
  },
};
