const path = require("path");
const fs = require("fs");
const gulp = require("gulp");
const shell = require("gulp-shell");
const connect = require("gulp-connect");
const openurl = require("openurl");
const notify = require("gulp-notify");
const { dest, port, livereload, https, fallback } = require("./settings");

const _notify = name => {
  const icon = path.resolve(__dirname, "public/logo.png");
  const obj = {
    message: name + " task is done",
    title: "Pkjs Notification",
    icon: fs.existsSync(icon) ? icon : null,
  };
  return notify(obj);
};
let timeout;
const watcher = gulp.watch("./src/**/*");
gulp.task("compile", () => gulp.src("./src").pipe(shell("node compiler.js compile")).pipe(_notify("compile")));
gulp.task("bundle", () => gulp.src("./src").pipe(shell("webpack --mode=development --devtool=source-map")).pipe(_notify("bundle")));
gulp.task("reload", () => gulp.src(`./${dest}`).pipe(connect.reload()));
gulp.task("watch", async () => {
  // gulp.watch("./src/**/*", gulp.series(["compile", "bundle", "reload"]));

  watcher.on("change", () => {
    if (typeof timeout != "undefined") clearTimeout(timeout);
    timeout = setTimeout(() => {
      const tasks = gulp.series(["compile", "bundle", "reload"]);
      tasks();
    }, 0);
  });
});

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
