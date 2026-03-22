import * as os from "node:os";
import * as path from "node:path";
import {existsSync} from "node:fs";
import {$} from "bun";

const error_message_base = "Could not load build artifact into Spicetify!";

const root_dir_project = path.resolve(import.meta.dirname, '..');
const build_artifacts_path = path.join(root_dir_project, 'dist');
if (!existsSync(build_artifacts_path)) {
  console.log(`${error_message_base} Build artifact directory not found.`);
  process.exit(1);
}

const prod_js_path = Bun.file(path.join(build_artifacts_path, 'mw-get-track-info-orange.js'));
if (!await prod_js_path.exists()) {
  console.log(`${error_message_base} Missing build artifact.`);
  process.exit(1);
}

const get_spicetify_extensions_path = () => {
  const relative_path = path.join('spicetify', 'Extensions');

  const platform = os.platform();
  if (platform === "win32" && process.env.APPDATA != null) {
    return path.resolve(process.env.APPDATA, relative_path);
  }
  if (platform !== "linux") {
    return null;
  }
  if (process.env.XDG_CONFIG_HOME != null) {
    return path.resolve(process.env.XDG_CONFIG_HOME, relative_path);
  }
  if (process.env.HOME != null) {
    return path.resolve(process.env.HOME, '.config', relative_path);
  }
  return null;
}
const spicetify_extensions_path = get_spicetify_extensions_path();
if (spicetify_extensions_path == null) {
  console.log(`${error_message_base} Spicetify extensions directory not found.`);
  process.exit(1);
}

await Bun.write(path.join(spicetify_extensions_path, 'mw-get-track-info-orange.js'), prod_js_path);

await $`spicetify enable-devtools`;
await $`spicetify config extensions mw-get-track-info-orange.js`;
await $`spicetify apply`;
