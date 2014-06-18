var gulp = require('gulp'),
  livereload = require('gulp-livereload');

var sources = ['./index.html', './css/app.css']

gulp.task('livereload', function() {
  livereload.listen();
  gulp.watch(sources).on('change', livereload.changed);
});
