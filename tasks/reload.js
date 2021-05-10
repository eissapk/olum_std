import gulp from "gulp";
import connect from "gulp-connect";

const reload = () => gulp.src("./src").pipe(connect.reload());

export default reload;
