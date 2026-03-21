import type {AppState} from "./app-state";
import {openSettingsPage} from "../settings/open-settings-page";
import {sendTrackDataEmissionModeActive} from "../ws-client/send-track-data-emission-mode-active";
import {initWsClient} from "../ws-client/init-ws-client";

export function main(app_state: AppState) {
  const saved_emission_mode = Spicetify.LocalStorage.get(app_state.emission_mode.local_storage_key) ?? undefined;
  if (saved_emission_mode != null) {
    app_state.emission_mode.value = saved_emission_mode as typeof app_state.emission_mode.value;
  }

  // Initialize the websocket client
  initWsClient(app_state);

  // Register the settings button in the profile menu
  const menu_item = new Spicetify.Menu.Item(
    app_state.app_name,
    true,
    () => {
      openSettingsPage(app_state);
    },
    "computer"
  );
  menu_item.register();
  menu_item.setState(false)

  // Set up the listeners for active mode, even if not currently in use.
  Spicetify.Player.addEventListener("songchange", () => sendTrackDataEmissionModeActive(app_state));
  Spicetify.Player.addEventListener("onprogress", () => sendTrackDataEmissionModeActive(app_state));
  Spicetify.Player.addEventListener("onplaypause", () => sendTrackDataEmissionModeActive(app_state));
}
