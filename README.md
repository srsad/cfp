### Frontend болванка для modx revo
Для установки, вызвать консоль в корневой директории проекта и выполнить команду 
```sh
$ npm i
```
#### Сетка:
[Flexbox Grid]

#### В сборку входит:
 - `gulp`
 - `gulp-pug` - шаблонизатор
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
 - `gulp watch` - основная команда для работы. Она запускает `['css-libs', 'browser-sync', 'scripts']` и следит за:
 	 - -
	 	 - css в **app/assets/templates/sass/**, 
	 	 - js в **app/assets/templates/js/**, 
	 	 - html файлами в директории **app/\*.html**
 	 - если выболнить `gulp watch --p`, то `browser-sync` будет следить за `app/pug/**/*.pug` и можно будет работать с шаблонизатором `pug`
 - `gulp build` - сбока продакшена в dist
	- если выполнить `gulp build --el` все **\*.html** файлы, будут скопированы в `elements/templates`. т.е. если вы используете fenom и файлы, то останется только порезать шаблоны на чанки и все! А если вы всё-таки используете `pug` и разбираете шаблон на составляющие (типа чанков), расширяете шаблоны чтоб не писать лишнего кала, то вам это понравится. Данная команда не только все **\*.html** файлы соберутся в `elements/templates`, но и все ваши нарезки из `assets/pug/chunks/**/*.pug` будут скомпилорованны в **\*.tpl** и отправлены в `elements/chunks/`. По сути все ваши чанки уже будут нарезаны, останется только использовать это дело в **fenom**, **smarty**, **twig** и т.д.

#### Почему pug?
Просто это удобно и я так хочу! Сранный ублюдок!
Если у вас возникнут проблемы с понимаением синтаксиса и приципов работы `pug`, то можно воспользоваться онлайн конвектором [pug/jade] который работает в обе стороны, очень удобная штука для людей которые только начали познавать дзен. Ну и конечно читайте оригинальные доки, там есть и `extends` и `include`и много чего еще.

[Flexbox Grid]: <http://flexboxgrid.com/>
[pug/jade]: <http://html2jade.org/>

