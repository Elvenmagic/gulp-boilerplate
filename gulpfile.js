var gulp = require('gulp');
var sass = require('gulp-sass');
var nunjucks = require('gulp-nunjucks');
var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream');

gulp.task('styles', function() {
    gulp.src('./m/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./m/css/'));
});

gulp.task('html', function() {
    gulp.src('./m/templates/*.html')
        .pipe(nunjucks.compile())
        .pipe(gulp.dest('./'));
});

gulp.task('sprite', function() {
    var spriteData = gulp.src('./m/i/_spritesource/**/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            imgPath: '../i/sprite.png',
            cssName: '_sprites.scss'
        }));

    // Pipe image stream through image optimizer and onto disk
    var imgStream = spriteData.img
        .pipe(gulp.dest('./m/i/'));

    // Pipe CSS stream through CSS optimizer and onto disk
    var cssStream = spriteData.css
        .pipe(gulp.dest('./m/scss/'));

    // Return a merged stream to handle both `end` events
    return merge(imgStream, cssStream);
});

gulp.task('default', ['sprite', 'styles', 'html'], function() {
    gulp.watch('./m/scss/**/*.scss', ['styles']);
    gulp.watch('./m/templates/**/*.html', ['html']);
    gulp.watch('./m/i/_spritesource/**/*.png', ['sprite']);
});
