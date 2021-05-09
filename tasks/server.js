import connect from "gulp-connect";
import openurl from "openurl";
import notify from "./notifier";
import logger from "./logger";
import { dest, port, livereload, https, fallback } from "../settings";

const server = () => {
  const taskName = "server";
  return new Promise((resolve, reject) => {
    try {
      logger(taskName, "start");
      const options = {
        root: `./${dest}`,
        port: process.env.PORT || port,
        livereload,
        https,
        fallback: `./${dest + fallback}`,
      };
      connect.server(options);
      openurl.open(`${https ? "https" : "http"}://localhost:${options.port}`);
      logger(taskName, "end");
      notify(taskName);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

export default server;