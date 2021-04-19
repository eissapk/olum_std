const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { mode, title, dest, src, hash, comments, asyncAwait } = require("./settings");

const config = {
  mode,
  entry: {
    main: [`./${src}/app.js`, `./${src}/app.scss`],
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
};

if (mode === "development") config.devtool = "source-map";
if (asyncAwait) config.entry.main.unshift("babel-polyfill");
module.exports = config;