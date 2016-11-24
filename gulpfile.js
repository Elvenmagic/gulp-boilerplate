var gulp = require('gulp');
var sass = require('gulp-sass');
var nunjucks = require('gulp-nunjucks');
var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream');
var sourcemaps = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('styles', ['sprite'], function() {
    gulp.src('./m/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
		.pipe(sourcemaps.init())
		.pipe(cleanCSS())
		.pipe(sourcemaps.write())
        .pipe(gulp.dest('./m/css/'));
});

gulp.task('html', function() {
    gulp.src('./m/templates/*.html')
        .pipe(nunjucks.compile())
        .pipe(gulp.dest('./'));
});

/* gulp.task('js', function() {
    gulp.src(['./m/js/lib/jquery.min.js',
			  './m/js/lib/bootstrap.min.js',
	         ])
	    .pipe(sourcemaps.init())
		//.pipe(concat('lib.js'))
        //.pipe(rename('lib.min.js'))
		.pipe(concat('lib.min.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./m/js/'));
}); */

gulp.task('sprite', function() {
    var spriteData = gulp.src('./m/i/_spritesource/**/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            imgPath: '../i/sprite.png',
            cssName: '_sprites.scss',
			//retinaSrcFilter: ['./m/i/_spritesource/**/*@2x.png'],
			//retinaImgName: 'sprite@2x.png',
			//retinaImgPath: '../i/sprite@2x.png',
        }));

    var imgStream = spriteData.img
        .pipe(gulp.dest('./m/i/'));

    var cssStream = spriteData.css
        .pipe(gulp.dest('./m/scss/'));

    return merge(imgStream, cssStream);
});

gulp.task('default', ['sprite', 'styles', 'html'], function() {
    gulp.watch('./m/scss/**/*.scss', ['styles']);
    gulp.watch('./m/templates/**/*.html', ['html']);
    gulp.watch('./m/i/_spritesource/**/*.png', ['sprite']);
});
