var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var minify = require('gulp-minify');

var sassFiles = './src/scss/*.scss';
var sassWatch = './src/scss/**/*.scss';
var sassOutput = './dist/css';

//script paths
var jsFiles = './src/js/*.js',
    jsOutPut = 'dist/js';


var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

gulp.task('scripts', function() {
  return gulp.src(jsFiles)
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest(jsOutPut));
});

gulp.task('sass', function () {
  return gulp
    .src(sassFiles)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(sassOutput));
});

gulp.task('watch', function() {
  gulp
  // Watch the sassWatch folder for change,
  // and run `sass` task when something happens
    .watch(sassWatch, ['sass'])
    // When there is a change,
    // log a message in the console
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
  gulp
  // Watch the jsFiles for change,
  // and run `scripts` task when something happens
    .watch(jsFiles, ['scripts'])
    // When there is a change,
    // log a message in the console
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('prod', function () {
  gulp
    .src(sassFiles)
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(sassOutput));
  gulp.src(jsFiles)
    .pipe(concat('scripts.js'))
    .pipe(minify({
      ext:{
        min:'.min.js'
      },
      noSource: true
    }))
    .pipe(gulp.dest(jsOutPut));

});

gulp.task('default', ['sass', 'scripts', 'watch']);

