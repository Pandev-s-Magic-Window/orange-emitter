await Bun.build({
  entrypoints: [
    "./src/app.ts"
  ],

  outdir: ".build-artifacts",
  naming: "mw-orange-emitter.[ext]",

  target: "browser",

  // Minify must be set to "false" for this project,
  // since currently the Settings Page relies on global function names.
  minify: false
});
console.log("Build task done!");
