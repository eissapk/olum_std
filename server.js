const { dest, port, hot, catchAll } = require("./settings");
const webpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");
const openurl = require("openurl");
const colors = require("colors");
const config = require("./webpack.config.js");

const options = {
  contentBase: `./${dest}`,
  hot,
  host:"localhost",
  historyApiFallback: catchAll,
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(port, "localhost", () => {
  const domain = `http://localhost:${port}`;
  openurl.open(domain);
  console.log(colors.green.bold("Serving: " + domain));
});
