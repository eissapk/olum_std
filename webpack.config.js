const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { mode, devtool, title, dest, hash, comments } = require("./settings");

module.exports = {
  mode,
  devtool, // uncomment for dev mode
  entry: {
    main: ["babel-polyfill", "./src/app.js", "./src/app.scss"],
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
