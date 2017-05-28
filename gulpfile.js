const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', () =>
    gulp.src('./styles/default.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./public/dist/styles'))
);

gulp.task('sass:watch', () => {
    gulp.watch('./styles/**/*.scss', ['sass']);
});