'use strict';
var gulp = require('gulp');
var jade = require('gulp-jade');
var templateCache = require('gulp-angular-templatecache');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var mainBowerFiles = require('main-bower-files');
var gulpFilter = require('gulp-filter');
var concat = require('gulp-concat');

var dest = './gulp-dest/';

// Jade templating
gulp.task('templates', function() {
  gulp.src(['./client/{app,components}/**/*.jade'])
    .pipe(jade())
    .pipe(templateCache())
    .pipe(gulp.dest(dest));
});

// JavaScript Linting
gulp.task('lint', function() {
  gulp.src([
    './client/{app,components}/**/*.js',
    './server/**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// SASS
gulp.task('sass', function () {
  gulp.src('./client/app/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(dest + 'css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./client/{app,components}/**/*.scss', ['sass']);
});

// Bower dependencies
gulp.task('bower', function() {
  gulp.src(mainBowerFiles())
    .pipe(gulpFilter('**/*.js'))
    .pipe(uglify())
    .pipe(concat('libs.min.js'))
    .pipe(gulp.dest(dest + 'js'));
});

gulp.task('default', function() {

});
