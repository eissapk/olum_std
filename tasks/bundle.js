import gulp from "gulp";
import shell from "gulp-shell";
import connect from "gulp-connect";
import notify from "./notify";

const bundle = cb => {
  gulp.src("./src").pipe(shell("webpack --env dev")).pipe(connect.reload()).pipe(notify(bundle));
  cb();
};

export const _bundle = cb => {
  gulp.src("./src").pipe(shell("webpack")).pipe(connect.reload());
  cb();
};

export default bundle;
