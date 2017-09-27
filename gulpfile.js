var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    gulpSequence = require('gulp-sequence'),
    plumber = require('gulp-plumber'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    coffee = require('gulp-coffee'),

    htmlmin = require('gulp-htmlmin'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    purify = require('gulp-purifycss'),
    uglify = require('gulp-uglify'),

    concat = require('gulp-concat'),
    del = require('del'),

    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache');

gulp.task('watch', ['sass-pug', 'coffee'], function () {
    browserSync.init({
        server: "app"
    });
    gulp.watch('app/pug/*.pug', ['pug']);
    gulp.watch('app/scss/*.scss', ['sass-pug']);
    gulp.watch('app/coffee/*.coffee', ['coffee']);
});

gulp.task('default', ['watch']);

gulp.task('pug', function () {
    return gulp.src(['app/pug/*.pug', '!app/pug/_*.pug'])
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('app'))
        .pipe(browserSync.stream());
});

gulp.task('sass-pug', function (callback) {
    gulpSequence('sass', 'pug')(callback);
});

gulp.task('sass', function () {
    return gulp.src(['app/scss/*.scss', '!app/scss/_*.scss'])
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(gulp.dest('app/css'))
    //.pipe(browserSync.stream());
});

gulp.task('coffee', function () {
    gulp.src(['app/coffee/*.coffee', '!app/coffee/_*.coffee'])
        .pipe(plumber())
        .pipe(coffee({
            bare: true
        }))
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.stream());
});

gulp.task('css-concat', function () {
    return gulp.src([
        'app/libs/normalize-css/normalize.css',
        //'app/libs/bootstrap/dist/css/bootstrap.min.css',
        //'app/libs/powerange/dist/powerange.min.css',
        'app/libs/switchery/dist/switchery.min.css'
        //'app/libs/huebee/dist/huebee.min.css',
        //'app/libs/owl.carousel/dist/assets/owl.carousel.min.css'
		])
        .pipe(concat('libs.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('app/css/'));
});

gulp.task('js-concat', function () {
    return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
//        'app/libs/bootstrap/dist/js/bootstrap.min.js',
//        'app/libs/svg.js/dist/svg.min.js',
//        'app/libs/powerange/dist/powerange.min4.js',
        'app/libs/switchery/dist/switchery.min.js'
//        'app/libs/huebee/dist/huebee.pkgd.min.js',
//        'app/libs/file-saver/FileSaver.min.js',
//        'app/libs/owl.carousel/dist/owl.carousel.min.js'
		])
        .pipe(concat('libs.min.js', {
            newLine: ';'
        }))
        .pipe(gulp.dest('app/js/'));
});

gulp.task('debug', gulpSequence(['css-concat', 'js-concat'], ['sass-pug', 'coffee']));

gulp.task('clean', function () {
    return del.sync('dist');
});

gulp.task('min-img', function () {
    return gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('copy-img', function () {
    return gulp.src(['app/img/**/*.+(png|jpg|jpeg|gif|svg)', '!app/img/icons/*.svg'])
        .pipe(gulp.dest('dist/img'));
});

gulp.task('copy-fonts', function () {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copy-pug', function () {
    return gulp.src('app/pug/*.pug')
        .pipe(gulp.dest('dist/pug'));
});

gulp.task('build-js', function () {
    return gulp.src('app/js/*')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('build-css', function () {
    var buildCssLibs = gulp.src('app/css/libs.min.css')
        //.pipe(csso())
        .pipe(purify(['./app/js/*.js', './app/*.html']))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'));

    var buildCssMy = gulp.src('app/css/style.css')
        .pipe(autoprefixer())
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('build-html', function () {
    return gulp.src(['dist/pug/*.pug', '!dist/pug/_*.pug'])
        .pipe(plumber())
        .pipe(pug())
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('del-pug-css', function () {
    var del_pug = del.sync('dist/pug');
    var del_css = del.sync('dist/css');
});

gulp.task('build', gulpSequence(['debug', 'clean'], ['copy-pug', 'build-css', 'build-js', 'copy-fonts', 'copy-img'], 'build-html', 'del-pug-css'));
