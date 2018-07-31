"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const nodemon = require("gulp-nodemon");
const browserSync = require("browser-sync");
const reload = browserSync.reload;
const pkg = require("./package.json");

gulp.task("nodemon", function(cb) {
  var started = false;

  return nodemon({
    script: pkg.main
  }).on("start", function() {
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task("browser-sync", ["nodemon"], function() {
  browserSync.init(null, {
    proxy: "http://localhost:3000",
    files: ["public/**/*.*"],
    browser: "google chrome",
    port: 7000
  });
});

gulp.task("sass", function() {
  return gulp
    .src("./public/scss/*.scss")
    .pipe(
      sass({
        errLogToConsole: true,
        trace: true,
        verbose: true,
        sourceComments: true
      }).on("error", sass.logError)
    )
    .pipe(gulp.dest("public/css"))
    .pipe(reload({ stream: true }));
});

gulp.task("watch", function() {
  gulp.watch("./public/scss/*.scss", ["sass"]);
  gulp.watch("./public/**/*.*").on("change", reload);
});

gulp.task("default", ["watch", "sass", "browser-sync"]);
