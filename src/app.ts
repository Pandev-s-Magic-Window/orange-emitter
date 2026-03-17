import {mwoeChangeSettingEmissionMode} from "./settings/mwoe-change-setting-emission-mode";
import {mwoeChangeSettingWsServerConnectionUrl} from "./settings/mwoe-change-setting-ws-server-connection-url";
import {mwoeCreateDefaultAppState} from "./app/mwoe-create-default-app-state";
import {mwoeMain} from "./app/mwoe-main";

// Create the default state
const mwoe_app_state = mwoeCreateDefaultAppState();

// Set up all the wrapper functions for setting changes
function mwoeRequestSettingChangeEmissionMode(submit_button_el?: HTMLButtonElement) {
  mwoeChangeSettingEmissionMode(mwoe_app_state, submit_button_el);
}
function mwoeRequestSettingChangeWsServerConnectionUrl(submit_button_el?: HTMLButtonElement) {
  mwoeChangeSettingWsServerConnectionUrl(mwoe_app_state, submit_button_el);
}

// Launch the app
function mwoeLauncher() {
  if (!Spicetify.Player || !Spicetify.Platform || !Spicetify.ReactJSX || !Spicetify.LocalStorage) {
    setTimeout(mwoeLauncher, 100);
    return;
  }

  // Functions called by the Settings Page will get removed when transpiling,
  // since they are only referenced from within a string and not actual code.
  // So we call them here to avoid that.
  mwoeRequestSettingChangeEmissionMode();
  mwoeRequestSettingChangeWsServerConnectionUrl();

  // Run the main process
  mwoeMain(mwoe_app_state);
}
mwoeLauncher();
