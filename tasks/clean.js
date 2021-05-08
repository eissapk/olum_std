import gulp from "gulp";
import shell from "gulp-shell";

const clean = cb => {
  gulp.src("./src").pipe(shell("node compiler.js clean"));
  cb();
};

export default clean;