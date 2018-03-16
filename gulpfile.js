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

gulp.task('js', cb => {
  const babel = require('gulp-babel');
  const concat = require('gulp-concat');
  const uglify = require('gulp-uglify');
  const pump = require('pump');

  pump(
    [
      gulp.src('client/scripts/*.js'),
      sourcemaps.init(),
      babel(),
      concat('scripts.js'),
      uglify(),
      sourcemaps.write('.'),
      gulp.dest('build/js'),
    ],
    cb,
  );
});

gulp.task('watch', () => {
  gulp.watch('client/styles/*.css', ['css']);
  gulp.watch('client/scripts/*.js', ['js']);
});

gulp.task('build', ['css', 'js']);
gulp.task('default', ['build', 'watch']);
