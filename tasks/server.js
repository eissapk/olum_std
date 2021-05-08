import connect from "gulp-connect";
import openurl from "openurl";
import { dest, port, livereload, https, fallback } from "../settings";

const server = cb => {
  const options = {
    root: `./${dest}`,
    port: process.env.PORT || port,
    livereload,
    https,
    fallback: `./${dest + fallback}`,
  };
  connect.server(options);
  openurl.open(`${https ? "https" : "http"}://localhost:${options.port}`);

  cb();
};

export default server;