const path = require("path");
const gulp = require("gulp");
const shell = require("gulp-shell");
const connect = require("gulp-connect");
const openurl = require("openurl");
const notify = require("gulp-notify");
const { dest, port, livereload, https, fallback, notifyMsg, notifyTitle } = require("./settings");

const _notify = taskName => {
  return notify({
    message: taskName + " " + notifyMsg.replace(/\<taskName\>/, "").trim(),
    title: notifyTitle,
    icon: path.join(__dirname, "public/logo.png"),
  });
};

gulp.task("compile", () => gulp.src("./src").pipe(shell("node compiler.js compile")).pipe(_notify("compile")));
gulp.task("bundle", () => gulp.src("./src").pipe(shell("webpack --mode=development --devtool=source-map")).pipe(_notify("bundle")));
gulp.task("reload", () => gulp.src(`./${dest}`).pipe(connect.reload()));
gulp.task("watch", async () => gulp.watch("./src/**/*", gulp.series(["compile", "bundle", "reload"])));
gulp.task("server", () => {
  const options = {
    root: `./${dest}`,
    port: process.env.PORT || port,
    livereload,
    https,
    fallback: `./${dest + fallback}`,
  };
  connect.server(options);
  openurl.open(`http://localhost:${options.port}`);
});
gulp.task("dev", gulp.series(["compile", "bundle", "watch", "server"]));
gulp.task("build", shell.task("node compiler.js compile && webpack --mode=production --no-devtool && node compiler.js clean"));