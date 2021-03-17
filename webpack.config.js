const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    main: ["babel-polyfill", "./src/app.js"],
  },
  output: {
    filename: "app[hash:8].js",
    path: path.resolve(__dirname, "dest"),
  },
  devtool: "source-map",
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ["./dest/**/*.*", "!./dest/*.ico"],
    }),
    new HtmlWebpackPlugin({
      title: 'PKjs',
      template: './public/index.html',
    })
  ],
  
  watch: false,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      { test: /\.css$/, use: "css-loader" },
    ],
  },
};
