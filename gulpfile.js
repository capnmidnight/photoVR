var gulp = require("gulp"),
  pkg = require("./package.json"),
  build = require("notiontheory-basic-build"),
  nt = build.setup(gulp, pkg),

  pliny = require("pliny"),

  js = nt.js(pkg.name, "src", {
    advertise: false,
    moduleName: "app",
    fileName: pkg.name + ".js",
    format: "iife",
    dependencies: ["format"],
    post: (inFile, cb) => pliny.carve(inFile, inFile, null, cb)
  }),

  min = nt.min(pkg.name, [pkg.name + ".js"], [js.release]),

  clean = nt.clean("legend3d", [
    "style.css",
    pkg.name + ".js",
    pkg.name + "Lib*.js"
  ], [min.release]),

  html = nt.html(pkg.name, ["*.pug"]),

  css = nt.css(pkg.name, ["*.styl"]);

gulp.task("copyPreloader", () => gulp.src(["node_modules/primrose/preloader*.js"])
  .pipe(gulp.dest("./")));

gulp.task("format", ["copyPreloader", js.format]);

gulp.task("js", [js.default]);
gulp.task("html", [html.default]);
gulp.task("css", [css.default]);

gulp.task("default", [ "js", "html", "css" ]);

gulp.task("debug", [
  js.debug,
  html.debug,
  css.debug
]);

gulp.task("test", [
  js.release,
  html.test,
  css.release
]);

gulp.task("release", [
  min.release,
  html.release,
  css.release
]);

gulp.task("kablamo", build.exec("gulp bump && gulp yolo && gulp trololo"));
