var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    jade = require('gulp-jade'),
    autoprefixer = require('gulp-autoprefixer'),
    connect = require('gulp-connect'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    rimraf = require('gulp-rimraf'),
    deploy = require('gulp-gh-pages'),
    rmdir = require('rimraf'),
    tmpDirectory = require('os').tmpDir(),
    runSequence = require('run-sequence');

var DEPLOY_OPTIONS = {
    remoteUrl: 'git@github.com:sbycrosz/sbycrosz.github.io.git',
    branch: 'master'
};

gulp.task('build:css', function () {
    return gulp.src('styles/*.styl')
        .pipe(plumber(''))
        .pipe(stylus())
        .pipe(autoprefixer())
        .pipe(concat("styles.css"))
        .pipe(gulp.dest('./build'))
        .pipe(connect.reload());
});

gulp.task('build:html', function () {
    return gulp.src('*.jade')
        .pipe(plumber(''))
        .pipe(jade())
        .pipe(gulp.dest('./build'))
        .pipe(connect.reload());
});

gulp.task('build:copyAssets', function() {
    return gulp.src(['assets/**/*'])
        .pipe(plumber(''))
        .pipe(gulp.dest('./build/assets'))
        .pipe(connect.reload());
});


gulp.task('build:copyCNAME', function() {
  return gulp.src('CNAME')
             .pipe(gulp.dest('build/'));
});

gulp.task('build:appcache', function () {
    return gulp.src('*.appcache')
        .pipe(gulp.dest('./build'))
        .pipe(connect.reload());
})

gulp.task('watch', function() {
    gulp.watch('styles/*.styl', ['build:css']);
    gulp.watch('assets/**/*', ['build:copyAssets']);
    gulp.watch('*.jade', ['build:html']);
});

gulp.task('serve', ['build'], function() {
    connect.server({
        root: 'build',
        livereload: true
    });
});

gulp.task('deploy:gh-pages', function () {
    return gulp.src('./build/**/*')
        .pipe(deploy(DEPLOY_OPTIONS));
});

gulp.task('deploy', function(cb) {
    runSequence(['clean:tempFolder', 'clean:build'], 'build', 'deploy:gh-pages', cb);
});

gulp.task('clean:tempFolder', function () {
    var tmpRepoDirectory = tmpDirectory + 'tmpRepo';
    rmdir(tmpRepoDirectory, function(error){});
});

gulp.task('clean:build', function () {
    return gulp.src('./build/*', { read: false })
        .pipe(rimraf());
});

gulp.task('build', ['build:html', 'build:css', 'build:copyAssets', 'build:appcache', 'build:copyCNAME']);

gulp.task('default', ['serve', 'watch']);
