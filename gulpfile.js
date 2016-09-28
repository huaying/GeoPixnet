var gulp = require('gulp');
var react = require('gulp-react');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pump = require('pump');
var del = require('del');

const src_dir = "./public/src/js/";
const dist_dir = "./public/dist/"
gulp.task('concat-uglify', ['react'] ,function(){
    pump([
        gulp.src([src_dir+'js.cookie.js',src_dir+'markerwithlabel.js',src_dir+'tool.js',src_dir+'map.js',dist_dir+'main.js'])
        ,concat('all.min.js')
        ,uglify()
        ,gulp.dest(dist_dir)
    ])
})


gulp.task('react', function(){
    return gulp.src(src_dir+'main.jsx')
            .pipe(react())
            .pipe(gulp.dest(dist_dir))
})

gulp.task('watch', function() {
    gulp.watch('public/src/**/*.js', ['concat-uglify']);
});
//gulp.task('default',['finally'], function(){});
gulp.task('default',['watch']);
