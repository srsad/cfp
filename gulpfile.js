var gulp 		 = require('gulp'),
	gutil 		 = require('gulp-util'),
	pug 		 = require('gulp-pug'),
	sass 		 = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	concat		 = require('gulp-concat'),
	uglify 		 = require('gulp-uglify'),
	cleancss 	 = require('gulp-clean-css'),
	rename 		 = require('gulp-rename'),
	autoprefixer = require('gulp-autoprefixer'),
	notify 		 = require("gulp-notify"),
	rsync 		 = require('gulp-rsync');

// pug
gulp.task('pug', function buildHTML() {
	return gulp.src('app/pug/*.pug')
	.pipe(pug({
		pretty: true // без сжатия
	})).on('error', notify.onError())
	.pipe(gulp.dest('app'));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	});
});

gulp.task('styles', function() {
	return gulp.src('app/assets/templates/default/sass/**/*.+(sass|scss)')
	.pipe(sass({ outputStyle: 'expanded' }).on('error', notify.onError()))
	.pipe(gulp.dest('app/assets/templates/default/css'))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions'], {cascade: true}))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } }))
	.pipe(gulp.dest('app/assets/templates/default/css'))
	.pipe(browserSync.stream());
});

gulp.task('js', function() {
	return gulp.src([
		'app/assets/templates/default/libs/jquery/dist/jquery.min.js',
		'app/assets/templates/default/js/main.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('app/assets/templates/default/js/'))
	.pipe(browserSync.reload({ stream: true }));
});

gulp.task('rsync', function() {
	return gulp.src('app/**')
	.pipe(rsync({
		root: 'app/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Includes files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});

gulp.task('watch', ['styles', 'js', 'browser-sync', 'pug'], function() {
	var option = process.argv.indexOf("--p");
	if(option>-1 && process.argv[option] === '--p') {
		gulp.watch('app/pug/**/*.pug', ['pug']);
	}
	gulp.watch('app/assets/templates/default/sass/**/*.+(sass|scss)', ['styles']);
	gulp.watch(['assets/templates/default/libs/**/*.js', 'app/assets/templates/default/js/main.js'], ['js']);
	gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('default', ['watch']);

// сборка
gulp.task('build', ['styles', 'js', 'pug'], function(){
	var bBuildCss	= gulp.src('app/assets/templates/default/css/**/*')
	.pipe(gulp.dest('dist/assets/templates/default/css'));

	var bFonts		= gulp.src('app/assets/templates/default/fonts/**/**')
	.pipe(gulp.dest('dist/assets/templates/default/fonts'));

	var bImg		= gulp.src('app/assets/templates/default/img/**/')
	.pipe(gulp.dest('dist/assets/templates/default/img'));

	var bBuildJs	= gulp.src('app/assets/templates/default/js/**/*')
	.pipe(gulp.dest('dist/assets/templates/default/js'));

	var bLils		= gulp.src('app/assets/templates/default/libs/**/*')
	.pipe(gulp.dest('dist/assets/templates/default/libs'));

	var bSass		= gulp.src('app/assets/templates/default/sass/**/*')
	.pipe(gulp.dest('dist/assets/templates/default/sass'));

	// если надо скопировать html в templates
	var option = process.argv.indexOf("--el");
	if(option>-1 && process.argv[option] === '--el') {
		var bBuildHtml = gulp.src(['app/*.html', '!app/index.html'])
		.pipe(gulp.dest('elements/templates'));

		gulp.src('app/index.html')
		.pipe(rename({basename: 'main'}))
		.pipe(gulp.dest('elements/templates')); // index rename

		gulp.src('app/pug/chunks/**/*.pug')
		.pipe(pug({ pretty: true })) 
		.pipe(rename({extname: '.tpl'}))
		.pipe(gulp.dest('elements/chunks'));

	}else{
		
		var bBuildHtml = gulp.src('app/*.html')
		.pipe(gulp.dest('dist'));
	}

});