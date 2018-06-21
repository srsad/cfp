### Frontend болванка для modx revo
Для установки, вызвать консоль в корневой директории проекта и выполнить команду 
```sh
npm i
```
#### Основное
Вообще это надстройка от [этого], я только обновил bootstrap с [4.0] до [4.1], добавил шаблонизатор и адаптировал под себя.

#### В сборку входит:
 - `bower`
 - `gulp`
 - `gulp-util`
 - `gulp-pug`
 - `gulp-sass`
 - `browser-sync`
 - `gulp-concat`
 - `gulp-uglify`
 - `gulp-clean-css`
 - `gulp-rename`
 - `gulp-autoprefixer`
 - `gulp-notify`
 - `gulp-rsync`

Bower грузит в `app/assets/templates/default/lib/`

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
 - `gulp watch` - основная команда для работы. Она запускает `['styles', 'js', 'browser-sync', 'pug']` и следит за:
    - css в **app/assets/templates/sass/**, 
    - js в **app/assets/templates/js/**, 
    - html файлами в директории **app/\*.html**
    - если выболнить `gulp watch --p`, то `browser-sync` будет следить за `app/pug/**/*.pug` и можно будет работать с шаблонизатором `pug`
 - `gulp build` - сбока продакшена в dist
     - если выполнить `gulp build --el`, то все **\*.html** файлы, будут скопированы в `elements/templates`. Т.е. если вы используете fenom и файлы, то останется только порезать шаблоны на чанки и все! А если вы всё-таки используете `pug` и разбираете шаблон на составляющие (типа чанков), расширяете шаблоны чтоб не писать лишнего кала. Тогда данная команда не только соберает все **\*.html** файлы в `elements/templates`, но так же возмет все ваши нарезки из `assets/pug/chunks/**/*.pug` скомпилирует в **\*.tpl** и отправит в `elements/chunks/`. Таким образом все ваши чанки уже будут нарезаны, останется только использовать это дело в **fenom**, **smarty**, **twig** или любой другой срани ...

Если у вас возникнут проблемы с понимаением синтаксиса и приципов работы `pug`, то можно воспользоваться онлайн конвектором [pug/jade] который работает в обе стороны, очень удобная штука для людей которые только начали познавать дзен. Ну и конечно читайте оригинальные доки, там есть и `extends` и `include`и много чего еще.

[этого]: <https://github.com/agragregra/OptimizedHTML-4>
[pug/jade]: <http://html2jade.org/>
[4.0]: <https://getbootstrap.com/docs/4.0/getting-started/introduction/>
[4.1]: <https://getbootstrap.com/docs/4.1/getting-started/introduction/>
