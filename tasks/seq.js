import gulp from "gulp";
import compile from "./compile";
import bundle from "./bundle";

let timeout;

export const sequence = () => {
  if (typeof timeout != "undefined") clearTimeout(timeout);

  timeout = setTimeout(() => {
    const seq = gulp.series(compile, bundle);
    seq();
  }, 1000);
};