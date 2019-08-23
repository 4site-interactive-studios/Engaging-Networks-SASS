const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const minify = require("gulp-minify");

const sassFiles = "./src/scss/*.scss";
const sassWatch = "./src/scss/**/*.scss";
const sassOutput = "./dist/css";

//script paths
const jsFiles = "./src/js/*.js",
  jsOutPut = "dist/js";

const sassOptions = {
  errLogToConsole: true,
  outputStyle: "expanded"
};

function scripts(done) {
  return gulp
    .src(jsFiles)
    .pipe(concat("scripts.js"))
    .pipe(gulp.dest(jsOutPut))
    .on("end", done);
}

function css(done) {
  return gulp
    .src(sassFiles)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("./maps"))
    .pipe(gulp.dest(sassOutput))
    .on("end", done);
}

function css_prod(done) {
  return gulp
    .src(sassFiles)
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(autoprefixer())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(sassOutput))
    .on("end", done);
}

function watch() {
  gulp.watch([sassWatch, sassFiles], gulp.series(css, css_prod));
  gulp.watch(jsFiles, gulp.series(scripts));
}

function prod(done) {
  gulp
    .src(jsFiles)
    .pipe(concat("scripts.js"))
    .pipe(
      minify({
        ext: {
          min: ".min.js"
        },
        noSource: true
      })
    )
    .pipe(gulp.dest(jsOutPut))
    .on("end", done);
}

exports.scripts = scripts;
exports.css = css;
exports.watch = watch;
exports.prod = prod;
exports.default = gulp.parallel(css, scripts, watch);
