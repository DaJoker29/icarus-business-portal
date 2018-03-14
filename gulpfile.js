const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('css', () => {
  const postcss = require('gulp-postcss');
  const autoprefixer = require('autoprefixer');
  return gulp
    .src('./client/styles/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('watch', () => {
  gulp.watch('client/styles/*.css', ['css']);
});

gulp.task('default', ['css']);
