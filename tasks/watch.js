import gulp from "gulp";
import { compileDev } from "./compile";
import { bundleDev } from "./bundle";
import colors from "colors";
import logger from "./logger";

const watcher = gulp.watch(["./src/**/*"]);
const taskName = "watch";
let timeout;

const sequence = () => {
  console.log(colors.bgRed.white(taskName));
  if (typeof timeout != "undefined") clearTimeout(timeout);
  timeout = setTimeout(() => compileDev().then(bundleDev), 1000);
};

const watch = () => {
  return new Promise((resolve, reject) => {
    try {
      logger(taskName, "start");
      watcher.on("change", sequence);
      logger(taskName, "end");
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};
export default watch;
