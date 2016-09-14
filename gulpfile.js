var gulp = require("gulp"),
  pkg = require("./package.json"),
  nt = require("notiontheory-basic-build").setup(gulp, pkg),
  js = nt.js(pkg.name, "src", ["format"]),
  html = nt.html(pkg.name, ["!node_modules/**/*", "**/*.pug"]),
  css = nt.css(pkg.name, ["!node_modules/**/*", "**/*.styl"]);

gulp.task("format", [js.format]);

gulp.task("copy", () => gulp.src(["node_modules/primrose/Primrose.js", "node_modules/primrose/Primrose.min.js"])
  .pipe(gulp.dest("./")));

gulp.task("default", [
  "copy",
  js.default,
  html.default,
  css.default
]);

gulp.task("debug", [
  "copy",
  js.build,
  html.debug,
  css.build
]);

gulp.task("release", [
  "copy",
  js.build,
  html.release,
  css.build
]);