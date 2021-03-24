module.exports = {
  mode: "development",
  dest: "build",
  src: "pre-build",
  port: 8000,
  hot: true,
  catchAll: true,
  devtool: "source-map",
  comments: false,
  hash: 10,
  sass: true,
  pug: false,
  title: "PKjs",
};
