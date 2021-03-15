const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "production",

  entry: {
    main: ["babel-polyfill", "./src/app.js"],
  },
  output: {
    filename: "bundled.js",
    path: path.resolve(__dirname, "dest/js"),
  },
  devtool: "source-map",
  plugins: [
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ["./dest/js/**/*.*", "!./dest/js/bundled.js"],
    }),
  ],
  watch: true,
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
