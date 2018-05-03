// инструкции
var gulp  		 = require('gulp'),
	pug 		 = require('gulp-pug'),
	sass 		 = require('gulp-sass'),
	browserSunc  = require('browser-sync'),
	concat 	 	 = require('gulp-concat'),
	uglify 	 	 = require('gulp-uglify'),
	cssnano		 = require('gulp-cssnano'),
	rename		 = require('gulp-rename'),
	del 		 = require('del'),
	imagemin	 = require('gulp-imagemin'),
	pngquant	 = require('imagemin-pngquant'),
	cache 		 = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'),
	gzip 		 = require('gulp-gzip');

//Pug
gulp.task('pug', function buildHTML() {
	return gulp.src('app/pug/*.pug')
	.pipe(pug({
		pretty: true //без сжатия
	}))
	.pipe(gulp.dest('app'));
});
// сборка сss
gulp.task('sass', function(){
	return gulp.src('app/assets/templates/default/sass/**/*.+(sass|scss)') // откуда брать 
		.pipe(sass()) // преобразовать
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true})) // поставить префиксы
		.pipe(gulp.dest('app/assets/templates/default/css')) // отдать оригинал
		.pipe(browserSunc.reload({stream: true})); // инектим стили
});
// в ообщем, этот костыль использует только сборщик
// он нужен из-за того что при сжатии вылетает browser Sunc, возможно это только мой глюк
gulp.task('sassb', function(){
	return gulp.src('app/assets/templates/default/sass/**/*.+(sass|scss)') // откуда брать 
		.pipe(sass()) // преобразовать
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true})) // поставить префиксы
		.pipe(gulp.dest('app/assets/templates/default/css')) // отдать оригинал
		.pipe(cssnano()) // сжать
		.pipe(rename({suffix: '.min'})) // добавить суффикс
		.pipe(gulp.dest('app/assets/templates/default/css')) // отдать min
		.pipe(gzip())
		.pipe(gulp.dest('app/assets/templates/default/css')); // отдать сжатое
});
// сборка и сжатие скриптов
gulp.task('scripts', function(){
	return gulp.src(['app/assets/templates/default/lib/jquery/dist/jquery.min.js',
			'app/assets/templates/default/lib/popper.js/dist/popper.min.js',
			'app/assets/templates/default/lib/bootstrap/dist/js/bootstrap.min.js',
		])
		.pipe(concat('libs.min.js')) // сборка в один файл
		.pipe(gulp.dest('app/assets/templates/default/js')) // выгрузка оригинала
		.pipe(uglify()) // сжатие
		.pipe(gulp.dest('app/assets/templates/default/js')) // выгрузка минифицированого
		.pipe(gzip())
		.pipe(gulp.dest('app/assets/templates/default/js')); // выгрузка сжатого
});
// сборка и сжатие стилей
gulp.task('css-libs', ['sass'], function(){
	return gulp.src('app/assets/templates/default/css/libs.css')
		.pipe(cssnano())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('app/assets/templates/default/css'))
		.pipe(gzip())
		.pipe(gulp.dest('app/assets/templates/default/css'));
});

gulp.task('browser-sync', function(){
	browserSunc({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});
// 
gulp.task('clean', function() {
	// Удаляем все данные из dist, кроме sftp-config.json
	return del.sync(['app/dist/**', '!app/dist', '!app/dist/sftp-config.json']); 
});
// отчистка кеша
gulp.task('clearCache', function() {
	return cache.clearAll();
});
// изображения
gulp.task('img', function(){
	return gulp.src('app/assets/templates/default/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			une: [pngquant()]
		})))
		.pipe(gulp.dest('app/assets/templates/default/img'));
});
// слежка
gulp.task('watch', ['pug' ,'css-libs', 'browser-sync', 'scripts'], function(){
	var option, i = process.argv.indexOf("--p");
	if(i>-1 && process.argv[i] === '--p') {
		gulp.watch('app/pug/**/*.pug', ['pug']);
	}
	gulp.watch('app/assets/templates/default/sass/**/*.+(sass|scss)', ['sass']);// стили
	gulp.watch('app/*.html', browserSunc.reload);
	gulp.watch('app/assets/templates/default/js/**/*.js', browserSunc.reload);
});

// сборщик на продакшен
gulp.task('build', ['clean', 'sassb', 'scripts', 'img',], function(){
	// dist - папка с готовым проектом
	// в "original" леттит полный оригинальный проект проект
	var bBuildCss  = gulp.src('app/assets/templates/default/css/**/*')
	.pipe(gulp.dest('dist/assets/templates/css'));

	var bFonts     = gulp.src('app/assets/templates/default/fonts/**/**')
	.pipe(gulp.dest('dist/assets/templates/fonts'));

	var bImg 	  = gulp.src('app/assets/templates/default/img/**/')
	.pipe(gulp.dest('dist/assets/templates/img'));

	var bBuildJs   = gulp.src('app/assets/templates/default/js/**/*')
	.pipe(gulp.dest('dist/assets/templates/js'));

	var bLils 	  = gulp.src('app/assets/templates/default/lib/**/*')
	.pipe(gulp.dest('dist/assets/templates/lib'));

	var bSass 	  = gulp.src('app/assets/templates/default/sass/**/*')
	.pipe(gulp.dest('dist/assets/templates/sass'));

	//если надо скопировать html в templates
	var boption, i = process.argv.indexOf("--el");
	if(i>-1 && process.argv[i] === '--el') {
		var bBuildHtml = gulp.src('app/*.html')
		.pipe(gulp.dest('elements/templates')); // сюда летят все html файлы которые мы будем нарезать на чанки
		//собераем все Pug чанки в чанки =)
		gulp.src('app/pug/chunks/**/*.pug')
		.pipe(pug({ pretty: true })) 
		.pipe(rename({extname: '.tpl'}))
		.pipe(gulp.dest('elements/chunks'));
	}else{
		var bBuildHtml = gulp.src('app/*.html')
		.pipe(gulp.dest('dist'));
	}

});

