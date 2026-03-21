import {APP_GLOBAL_SYMBOL_NAME} from "../src/app/app-global-symbol-name.ts";

await Bun.build({
  entrypoints: [
    "./src/app.ts"
  ],

  outdir: ".build-artifacts",
  naming: "mw-get-track-info-orange.js",

  target: "browser",

  // We want to preserve the code as much as possible so it's easier
  // to transform the output down below.
  minify: false
});

/**
 * Scope the whole bundle in a IIFE to avoid potential conflicts with other extensions.
 * We do it manually like this so we can export the settings global scope helper (idk how to do this with Bun alone).
 */
const artifact = Bun.file('./.build-artifacts/mw-get-track-info-orange.js');
const artifact_current_contents = await artifact.text();
const artifact_new_contents = `
const ${APP_GLOBAL_SYMBOL_NAME} = (function() {
${artifact_current_contents}
return {SettingsGlobalScopeHelper: SettingsGlobalScopeHelper}})();
`;
await artifact.write(artifact_new_contents);

// Build done :)
console.log("Build task done!");
