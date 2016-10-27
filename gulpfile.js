var gulp = require("gulp"),
  pkg = require("./package.json"),
  build = require("notiontheory-basic-build"),
  nt = build.setup(gulp, pkg),
  js = nt.js(pkg.name + "Lib", "src"),
  tot = nt.cat(pkg.name, [
    "node_modules/primrose/Primrose.js",
    pkg.name + "Lib.js"
  ], [js]),
  html = nt.html(pkg.name, ["!node_modules/**/*", "**/*.pug"]),
  css = nt.css(pkg.name, ["!node_modules/**/*", "**/*.styl"]);

gulp.task("default", [
  pre.default,
  js.default,
  html.default,
  css.default
]);

gulp.task("debug", [
  pre.debug,
  tot.debug,
  html.debug,
  css.debug
]);

gulp.task("test", [
  pre.release,
  tot.release,
  html.test,
  css.release
]);

gulp.task("release", [
  pre.release,
  tot.release,
  html.release,
  css.release
]);