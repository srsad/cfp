// инструкции
var gulp  		 = require('gulp');
var pug 		 = require('gulp-pug');
var sass 		 = require('gulp-sass');
var browserSunc  = require('browser-sync');
var concat 	 	 = require('gulp-concat');
var uglify 	 	 = require('gulp-uglify');
var cssnano		 = require('gulp-cssnano');
var rename		 = require('gulp-rename');
var del 		 = require('del');
var imagemin	 = require('gulp-imagemin');
var pngquant	 = require('imagemin-pngquant');
var cache 		 = require('gulp-cache');
var autoprefixer = require('gulp-autoprefixer');
var gzip 		 = require('gulp-gzip');

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
	return gulp.src('app/assets/templates/sass/**/*.+(sass|scss)') // откуда брать 
		.pipe(sass()) // преобразовать
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true})) // поставить префиксы
		.pipe(gulp.dest('app/assets/templates/css')) // отдать оригинал
		.pipe(browserSunc.reload({stream: true})); // инектим стили
});
// в ообщем, этот костыль использует только сборщик
// он нужен из-за того что при сжатии вылетает browser Sunc, возможно это только мой глюк
gulp.task('sassb', function(){
	return gulp.src('app/assets/templates/sass/**/*.+(sass|scss)') // откуда брать 
		.pipe(sass()) // преобразовать
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true})) // поставить префиксы
		.pipe(gulp.dest('app/assets/templates/css')) // отдать оригинал
		.pipe(cssnano()) // сжать
		.pipe(rename({suffix: '.min'})) // добавить суффикс
		.pipe(gulp.dest('app/assets/templates/css')) // отдать min
		.pipe(gzip())
		.pipe(gulp.dest('app/assets/templates/css')); // отдать сжатое
});
// сборка и сжатие скриптов
gulp.task('scripts', function(){
	return gulp.src(['app/assets/templates/lib/jquery/dist/jquery.min.js',
			'app/assets/templates/lib/popper.js/dist/popper.min.js'
			'app/assets/templates/lib/bootstrap/dist/js/bootstrap.min.js',
		])
		.pipe(concat('libs.min.js')) // сборка в один файл
		.pipe(gulp.dest('app/assets/templates/js')) // выгрузка оригинала
		.pipe(uglify()) // сжатие
		.pipe(gulp.dest('app/assets/templates/js')) // выгрузка минифицированого
		.pipe(gzip())
		.pipe(gulp.dest('app/assets/templates/js')); // выгрузка сжатого
});
// сборка и сжатие стилей
gulp.task('css-libs', ['sass'], function(){
	return gulp.src('app/assets/templates/css/libs.css')
		.pipe(cssnano())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('app/assets/templates/css'))
		.pipe(gzip())
		.pipe(gulp.dest('app/assets/templates/css'));
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
	return gulp.src('app/assets/templates/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			une: [pngquant()]
		})))
		.pipe(gulp.dest('app/assets/templates/img'));
});
// слежка
gulp.task('watch', ['pug' ,'css-libs', 'browser-sync', 'scripts'], function(){
	var option, i = process.argv.indexOf("--p");
	if(i>-1 && process.argv[i] === '--p') {
		gulp.watch('app/pug/**/*.pug', ['pug']);
	}
	gulp.watch('app/assets/templates/sass/**/*.+(sass|scss)', ['sass']);// стили
	gulp.watch('app/*.html', browserSunc.reload);
	gulp.watch('app/assets/templates/js/**/*.js', browserSunc.reload);
});

// сборщик на продакшен
gulp.task('build', ['clean', 'sassb', 'scripts', 'img',], function(){
	// dist - папка с готовым проектом
	// в "original" леттит полный оригинальный проект проект
	var bBuildCss  = gulp.src('app/assets/templates/css/**/*')
	.pipe(gulp.dest('dist/assets/templates/css'))
	.pipe(gulp.dest('dist/assets/templates/original/app/assets/templates/css'));

	var bFonts     = gulp.src('app/assets/templates/fonts/**/**')
	.pipe(gulp.dest('dist/assets/templates/fonts'))
	.pipe(gulp.dest('dist/assets/templates/original/app/assets/templates/fonts'));

	var bImg 	  = gulp.src('app/assets/templates/img/**/')
	.pipe(gulp.dest('dist/assets/templates/img'))
	.pipe(gulp.dest('dist/assets/templates/original/app/assets/templates/img'));


	var bBuildJs   = gulp.src('app/assets/templates/js/**/*')
	.pipe(gulp.dest('dist/assets/templates/js'))
	.pipe(gulp.dest('dist/assets/templates/original/app/assets/templates/js'));

	var bLils 	  = gulp.src('app/assets/templates/lib/**/*')
	.pipe(gulp.dest('dist/assets/templates/lib'))
	.pipe(gulp.dest('dist/assets/templates/original/app/assets/templates/lib'));

	var bSass 	  = gulp.src('app/assets/templates/sass/**/*')
	.pipe(gulp.dest('dist/assets/templates/original/app/assets/templates/sass'));

	var bBuildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'))
	.pipe(gulp.dest('dist/assets/templates/original/app'));

	var bPug 	  = gulp.src('app/pug/**/*')
	.pipe(gulp.dest('dist/assets/templates/original/pug'));

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
	}

	var bGulpfile  = gulp.src('gulpfile.js')
	.pipe(gulp.dest('dist/assets/templates/original'));

	var bPjson	  = gulp.src('package.json')
	.pipe(gulp.dest('dist/assets/templates/original'));

	var bBoresrc   = gulp.src('.bowerrc')
	.pipe(gulp.dest('dist/assets/templates/original'));

});

