import gulp from "gulp";
import shell from "gulp-shell";
import notify from "./notify";

const compile = cb => {
  gulp.src("./src").pipe(shell("node compiler.js compile")).pipe(notify(compile));
  cb();
};

export default compile;