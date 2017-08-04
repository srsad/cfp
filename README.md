### Frontend болванка для modx revo
Для установки, вызвать консоль в корневой директории проекта и выполнить команду 
```sh
$ npm i
```
#### Сетка:
[Flexbox Grid]

#### В сборку входит:
 - `gulp`
 - `gulp-sass`
 - `gulp-autoprefixer`
 - `browser-sync`
 - `gulp-concat` - для конкатенации файлов
 - `gulp-uglifyjs` - для сжатия **JS**
 - `gulp-cssnano` - для минификации **CSS**
 - `gulp-rename`
 - `del`
 - `gulp-imagemin` - для работы с изображениями 
 - `imagemin-pngquant` - для работы с png
 - `gulp-cache` - тупо кэш
 - `gulp-gzip` - для упаковки файлов в **\*.gz**

Bower грузит в `app/assets/templates/lib/`

#### Список команд:
 - `gulp sass` - сборка сss по правилу `app/.../sass/**/*.+(sass|scss)`
 - `gulp scripts` - сборка и сжатие скриптов, по умолчанию:
    - `../lib/jquery/dist/jquery.min.js`
    - `../lib/bootstrap/dist/js/bootstrap.min.js`
 - `gulp css-libs` - сборка и сжатие стилей
 - `gulp browser-sync` - запуск browser sync
 - `gulp clean` - Удаляем все данные из dist, кроме sftp-config.json
 - `gulp clearCache` - просто отчистка кеша
 - `gulp img` - находит изображения по правилу `app/assets/templates/img/**/*` и сжимает
 - `gulp watch` - основная команда для работы. Она запускает `['css-libs', 'browser-sync', 'scripts']` и следит за css, js, html файлами
 - `gulp build` - сбока продакшена в dist
	- если выполнить `gulp build --el` все **\*.html** файлы, будут скопированы в `elements/templates`. т.е. если вы используете fenom и файлы, то останется только порезать шаблоны на чанки и все!

[Flexbox Grid]: <http://flexboxgrid.com/>

