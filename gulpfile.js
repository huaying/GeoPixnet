var gulp = require('gulp');
var react = require('gulp-react');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pump = require('pump');
var cssnano = require('gulp-cssnano');

const src_dir = "./public/src/js/";
const css_dir = "./public/src/css/";
const dist_dir = "./public/dist/"
gulp.task('concat-uglify', ['react'] ,function(){
    pump([
        gulp.src([src_dir+'js.cookie.js',src_dir+'markerwithlabel.js',src_dir+'tool.js',src_dir+'map.js',dist_dir+'main.js'])
        ,concat('all.min.js')
        ,uglify()
        ,gulp.dest(dist_dir)
    ])
})

gulp.task('cssnano', function(){
    pump([
        gulp.src([css_dir+'**/*.css'])
        ,concat('all.min.css')
        ,cssnano()
        ,gulp.dest(dist_dir)
    ])
})

gulp.task('react', function(){
    return gulp.src(src_dir+'main.jsx')
            .pipe(react())
            .pipe(gulp.dest(dist_dir))
})

gulp.task('watchjs', function() {
    gulp.watch('public/src/**/*.js', ['concat-uglify']);
});
gulp.task('watchcss', function() {
    gulp.watch('public/src/**/*.css', ['cssnano']);
});
//gulp.task('default',['finally'], function(){});
gulp.task('default',['watchjs','watchcss']);
