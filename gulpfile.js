const gulp = require("gulp"),
  pug = require("gulp-pug"),
  htmlmin = require("gulp-htmlmin"),
  sass = require("gulp-sass"),
  sassGlob = require("gulp-sass-glob"),
  prefix = require("gulp-autoprefixer"),
  cssmin = require("gulp-cssnano"),
  webpack = require("webpack-stream"),
  webpackConfig = require("./webpack.config"),
  srcmap = require("gulp-sourcemaps"),
  concat = require("gulp-concat"),
  connect = require("gulp-connect"),
  notify = require("gulp-notify"),
  openurl = require("openurl"),
  nodemon = require("gulp-nodemon");

// HTML
gulp.task("html", () => {
  return gulp
    .src("./src/index.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(gulp.dest("./dest"));
});

// scss
gulp.task("scss", () => {
  return (
    gulp
      .src("./src/**/*.scss")
      .pipe(sassGlob())
      .pipe(sass())
      .pipe(
        prefix({
          cascade: false,
        })
      )
      // .pipe(cssmin())
      .pipe(gulp.dest("./src"))
  );
});

// global css
gulp.task("css", () => {
  return gulp
    .src("./src/app.scss")
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(
      prefix({
        cascade: false,
      })
    )
    .pipe(cssmin())
    .pipe(gulp.dest("./dest/style"));
});

// JS
gulp.task("js", () => {
  return gulp
    .src("./src/app.js")
    .pipe(webpack(webpackConfig))
    .on("error", function handleError() {
      this.emit("end"); // Recover from errors
    })
    .pipe(gulp.dest("./dest/js"));
});

// SERVER
gulp.task("server", () => {
  const port = process.env.PORT || 8080;
  openurl.open(`http://localhost:${port}`);
  nodemon({
    script: "server.js",
  });
});

// WATCH
gulp.task("watch", async () => {
  gulp.watch("./src/index.html", gulp.series("html"));
  gulp.watch("./src/**/*.scss", gulp.series("scss"));
  gulp.watch("./src/**/*.scss", gulp.series("css"));
  gulp.watch("./src/**/*.js", gulp.series("js"));
});

gulp.task("default", gulp.series(["html", "css", "scss", "watch", "server", "js"]));
