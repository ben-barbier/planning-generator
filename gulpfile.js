var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require("tsify");
var fancy_log = require("fancy-log");
var paths = {
  pages: ['src/*.html'],
  inputs: ['src/*.csv'],
};

var watchedBrowserify = watchify(browserify({
  basedir: '.',
  debug: true,
  entries: ['src/index.ts'],
  cache: {},
  packageCache: {}
}).plugin(tsify));

gulp.task("copy-html", function () {
  return gulp.src(paths.pages)
      .pipe(gulp.dest("dist"));
});

gulp.task("copy-inputs", function () {
  return gulp.src(paths.inputs)
      .pipe(gulp.dest("dist"));
});

function bundle() {
  return watchedBrowserify
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest("dist"));
}

gulp.task("default", gulp.series(gulp.parallel('copy-html', 'copy-inputs'), bundle));
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", fancy_log);
