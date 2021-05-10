import gulp from "gulp";
import compile from "./compile";
import { bundleDev } from "./bundle";
import notify from "./notifier";
import colors from "colors";
import logger from "./logger";

const watcher = gulp.watch(["./src/**/*"]);
const taskName = "watch";
let timeout;

const sequence = () => {
  console.log(colors.bgRed.white(taskName));
  if (typeof timeout != "undefined") clearTimeout(timeout);
  timeout = setTimeout(() => compile().then(bundleDev), 1000);
};

const watch = () => {
  logger(taskName, "start");
  watcher.on("change", sequence);
  logger(taskName, "end");
  notify(taskName);
};
export default watch;
