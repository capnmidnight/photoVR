var gulp = require("gulp"),
  pkg = require("./package.json"),
  pliny = require("pliny"),
  build = require("notiontheory-basic-build"),

  nt = build.setup(gulp, pkg),

  js = nt.js(pkg.name, "src/index.js", {
    fileName: pkg.name + ".js",
    dependencies: ["format"],
    format: "iife"
  }),

  min = nt.min(pkg.name, [pkg.name + ".js"], [js.release]),

  clean = nt.clean(pkg.name, [
    "style.css",
    pkg.name + ".js"
  ], [min.release]),

  html = nt.html(pkg.name, ["*.pug"]),

  css = nt.css(pkg.name, ["*.styl"]);

gulp.task("format", [js.format]);

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
