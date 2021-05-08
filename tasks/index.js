import gulp from "gulp";
import compile from "./compile";
import bundle, { _bundle } from "./bundle";
import watch from "./watch";
import server from "./server";
import clean from "./clean";

export const dev = gulp.series(compile, bundle, watch, server);
export const build = gulp.series(compile, _bundle, clean);
