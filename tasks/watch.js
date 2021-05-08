import gulp from "gulp";
import { sequence } from "./seq";

const watcher = gulp.watch(["./src/**/*"]);

const watch = async cb => {
  watcher.on("change", sequence);
  cb();
};

export default watch;
