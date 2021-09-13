const {src, dest, parallel, series, watch} = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');

// Sökvägar
const files = {
    htmlPath: "src/**/*.html",
    cssPath: "src/css/*.css",
    jsPath: "src/js/*.js",
    imagePath: "src/images/*"
}

//HTML-task
function copyHTML() {
 return src(files.htmlPath)
 .pipe(dest('pub'));
}

//CSS-task
function cssTask() {
    return src(files.cssPath)
    .pipe(sourcemaps.init())
    .pipe(concat('main.css'))
    .pipe(cssnano())
    .pipe(sourcemaps.write('../maps'))
    .pipe(dest('pub/css'))
    .pipe(browserSync.stream());
}
//JS-task
function jsTask() {
    return src(files.jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('../maps'))
 .pipe(dest('pub/js'));
}
//Image-task
function imageTask() {
    return src(files.imagePath)
    .pipe(imagemin())
 .pipe(dest('pub/images'));
}
//Watch-task
function watchTask() {
    browserSync.init({
        server: "./pub"
    });

    watch([files.htmlPath, files.cssPath, files.jsPath, files.imagePath], parallel(copyHTML, jsTask, cssTask, imageTask)).on('change', browserSync.reload);
}

exports.default = series(parallel(copyHTML, jsTask, cssTask, imageTask), 
watchTask);