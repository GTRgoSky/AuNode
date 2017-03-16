'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
var less = require('gulp-less');
var watch = require('gulp-watch');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('browserify');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var minifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var del = require('del');
var glob = require('glob');
var path = require('path');

// 报错抛出提示
var onError = function(err) {
    gutil.log('======= ERROR. ========\n');
    notify.onError("ERROR: " + err.message)(err); // for growl
    gutil.beep();
};

function buildCss(styleSrc) {
    gulp.src(styleSrc, { client: './' })
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true, //美化对齐属性值
            remove: true //去掉不必要的前缀
        }))
        .pipe(gulp.dest('dest/css'))
        .pipe(sourcemaps.write('./'))
        .on('finish', function() {});
}

// require编译
// require编译
function bundle(b, file) {
    console.log(file)
    return b.bundle()
        .on("error", notify.onError(function (error) {
            gutil.log('======= ERROR. ========\n', error);
            return "Message to the notifier: " + error.message;
        }))
        .pipe(source(file))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dest/js'));
}


// 根据变动生成css与js
function buildCssAndJs() {
    watch('src/less/!(_)*.less', function(event) {
        var path = event.path.replace(/\\/g, '/'),
            reg = path.match(/(\/src(\/\w+)*)?\/([\w]+.less)?$/),
            src = reg[0];
        console.log(JSON.stringify(path));
        console.log(JSON.stringify(reg));
        buildCss(src.substring(1));
        gutil.log(gutil.colors.green("SUCCESS: " + src.substring(1) + '  finished!'));
    });

    watch('src/js/!(_)*.js', function(event) {
        console.log('event path:'+event.path);
        var path = event.path.replace(/\\/g, '/');
        console.log('path:'+path);
        var reg = path.match(/(\/src(\/\w+)*)?\/([\w]+.js)?$/),
            src = reg[0],
            // src="D:/src",
            fileName = reg[3];
        console.log(JSON.stringify(reg));
        console.log(JSON.stringify(src));
        console.log(JSON.stringify(fileName));
        var b = watchify(browserify(assign({}, watchify.args, {
            cache: {},
            packageCache: {},
            entries: [path]
        })));

        b.on('log', gutil.log);

        bundle(b, fileName);

        return;
    });

}

/*
 编译所有的less
 */
function Less(callback) {

    glob('src/less/!(_)*.less', {}, function(err, files) {

        files.forEach(function(file) {

            buildCss(file);

            gutil.log(gutil.colors.green("SUCCESS: " + file + '  finished!'));

        });

        callback();
    });
}

/*
 编译所有的js
 注：执行此命令的时候请注释掉下面的 [default]任务行
 */
function reset(callback) {

    glob('src/js/!(_)*.js', {}, function(err, files) {

        files.forEach(function(file) {

            var reg = file.match(/(app\/src\/(\w+)*)?\/([\w]+.js)?$/),
                fileName = reg[3];

            var b = watchify(browserify(assign({}, watchify.args, {
                cache: {},
                packageCache: {},
                entries: [file]
            })));

            bundle(b, fileName);

            gutil.log(gutil.colors.green("SUCCESS: " + file + '  finished!'));

        });
    });

    callback();
}
/*
 * clean output
 * */
function clean(callback) {
    del.sync(['dest/css/**']);
    callback();
}
/*
 *
 * minCss
 *
 * */

function minCss(callback) {
    return gulp.src('dest/css/*.css')
        .pipe(rename({ suffix: '.min' })) //修改文件名
        .pipe(minifycss())
        .pipe(gulp.dest('css'))
        .on('finish', callback);
}
/*
 *
 * compress
 *
 * */
function compress(callback) {
    return gulp.src('dest/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dest/minJS/js'))
        .on('finish', callback);
}

//default task
gulp.task(buildCssAndJs);

//编译所有的less
gulp.task(Less);
//编译所有的js
gulp.task(reset);

// register task
gulp.task(clean);
gulp.task(minCss);
gulp.task(compress);


gulp.task('default', gulp.series('buildCssAndJs'));

// build
gulp.task('build', gulp.series('minCss', 'compress','clean'));
