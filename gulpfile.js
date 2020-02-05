const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const cleancss = require('gulp-clean-css');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const notify = require('gulp-notify');

// pug
gulp.task('pug', () => {
	return gulp.src('app/pug/*.pug')
    .pipe(pug({ pretty: true }))
    .on('error', notify.onError())
    .pipe(gulp.dest('app'));
});

gulp.task('styles', () => {
	return gulp.src('app/assets/templates/default/sass/**/*.+(sass|scss)')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', notify.onError()))
    .pipe(gulp.dest('app/assets/templates/default/css'))
    .pipe(rename({ suffix: '.min', prefix : '' }))
    .pipe(autoprefixer(['last 15 versions'], {cascade: true}))
    .pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
    .pipe(gulp.dest('app/assets/templates/default/css'))
    .pipe(sourcemaps.write())
    .pipe(browserSync.stream());
});

gulp.task('js', () => {
	return gulp.src([
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/bootstrap/dist/js/bootstrap.min.js',
      'app/assets/templates/default/js/main.js'
		])
    .pipe(concat('scripts.min.js'))
    // .pipe(uglify()) // путь пока будет так
    .pipe(gulp.dest('app/assets/templates/default/js/'))
    .pipe(browserSync.reload({ stream: true }));
});


gulp.task('browser-sync', () => {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		open: false
	});
});

gulp.task('watch', gulp.parallel('styles', 'js', 'browser-sync', 'pug'), () => {
  if(process.argv.includes('--p')) gulp.watch('app/pug/**/*.pug', gulp.parallel("pug"));

  gulp.watch('app/assets/templates/default/sass/**/*.+(sass|scss)', gulp.parallel('styles'));
  gulp.watch(['assets/templates/default/libs/**/*.js', 'app/assets/templates/default/js/main.js'], gulp.parallel('js'));
  gulp.watch('app/*.html', browserSync.reload);
});

gulp.task("default", gulp.parallel("pug", "styles", "js", "browser-sync", "watch"));

gulp.task('build', gulp.series('styles', 'js', 'pug'), async () => {
  gulp.src('app/assets/templates/default/**/*')
  	.pipe(gulp.dest('dist/assets/templates/default'));

	// если fenom
	if(process.argv.includes('--el')) {
		gulp.src(['app/*.html', '!app/index.html'])
  		.pipe(gulp.dest('elements/templates'));

		gulp.src('app/index.html')
      .pipe(rename({basename: 'main'}))
      .pipe(gulp.dest('elements/templates'));

    gulp.src('app/pug/chunks/**/*.pug')
      .pipe(pug({ pretty: true })) 
      .pipe(rename({extname: '.tpl'}))
      .pipe(gulp.dest('elements/chunks'));
	}else{
		gulp.src('app/*.html')
  		.pipe(gulp.dest('dest'));
	}
  return
});
