const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass");
const browserSync = require("browser-sync");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");

gulp.task("pug", () => {
  return gulp
    .src("app/pug/*.pug")
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest("app"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("styles", () => {
  return gulp
    .src("app/assets/templates/default/sass/**/*.+(sass|scss)")
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(rename({ suffix: ".min", prefix: "" }))
    .pipe(autoprefixer(["last 15 versions"], { cascade: true }))
    .pipe(cleanCSS({ level: { 1: { specialComments: 0 } } }))
    .pipe(gulp.dest("app/assets/templates/default/css"))
    .pipe(sourcemaps.write())
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("js", () => {
  return gulp
    .src([
      "node_modules/jquery/dist/jquery.min.js",
      "node_modules/bootstrap/dist/js/bootstrap.min.js",
      // "node_modules/owl.carousel/dist/owl.carousel.min.js",
      "app/assets/templates/default/js/main/**/*.js"
    ])
    .pipe(concat("scripts.min.js"))
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      }),
    )
    .pipe(gulp.dest("app/assets/templates/default/js"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("browser-sync", () => {
  browserSync.init({
    server: {
      baseDir: "app",
    },
    notify: false,
    open: true,
  });
});

gulp.task("watch", () => {
  gulp.watch("app/pug/**/*.pug", gulp.parallel("pug"));
  gulp.watch("app/assets/templates/default/sass/**/*.+(sass|scss)", gulp.parallel("styles"));
  gulp.watch(["assets/templates/default/libs/**/*.js", "app/assets/templates/default/js/main/**/*.js"], gulp.parallel("js"));
  gulp.watch("app/*.html", browserSync.reload());
});

gulp.task("default", gulp.parallel("pug", "styles", "js", "browser-sync", "watch"));

gulp.task("build", gulp.series("styles", "js", "pug", async () => {
    gulp.src("app/assets/templates/default/**/*").pipe(gulp.dest("dist/assets/templates/default"));

    // если fenom
    if (process.argv.includes("--el")) {
      gulp.src(["app/*.html", "!app/index.html"]).pipe(gulp.dest("elements/templates"));

      gulp
        .src("app/index.html")
        .pipe(rename({ basename: "main" }))
        .pipe(gulp.dest("elements/templates"));

      gulp
        .src("app/pug/chunks/**/*.pug")
        .pipe(pug({ pretty: true }))
        .pipe(rename({ extname: ".tpl" }))
        .pipe(gulp.dest("elements/chunks"));
    } else {
      gulp.src("app/*.html").pipe(gulp.dest("dest"));
    }
    return;
  })
);
