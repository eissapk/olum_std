const gulp = require("gulp"),
  shell = require("gulp-shell");

gulp.task("compiler", shell.task("node compiler.js compile"));
gulp.task("watch", async () => gulp.watch("./src/**/*", gulp.series("compiler")));
gulp.task("default", gulp.series(["watch"]));
