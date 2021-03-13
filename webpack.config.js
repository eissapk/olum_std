const path = require("path");

module.exports = {
  entry: {
    main: ["babel-polyfill", "./src/app.js"],
  },
  output: {
    filename: "bundled.js",
    path: path.resolve(__dirname, "dest/js"),
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
    ],
  },
};
