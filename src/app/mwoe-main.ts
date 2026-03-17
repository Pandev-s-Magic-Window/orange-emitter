import {mwoeOpenSettingsPage} from "../settings/mwoe-open-settings-page";
import type {MwoeAppState} from "./mwoe-app-state";
import {mwoeSendTrackDataEmissionModeActive} from "../ws-client/mwoe-send-track-data-emission-mode-active.ts";
import {mwoeInitWsClient} from "../ws-client/mwoe-init-ws-client";

export function mwoeMain(mwoe_app_state: MwoeAppState) {
  const saved_emission_mode = Spicetify.LocalStorage.get(mwoe_app_state.emission_mode.local_storage_key) ?? undefined;
  if (saved_emission_mode != null) {
    mwoe_app_state.emission_mode.value = saved_emission_mode as typeof mwoe_app_state.emission_mode.value;
  }

  // Initialize the websocket client
  mwoeInitWsClient(mwoe_app_state);

  // Register the settings button in the profile menu
  const menu_item = new Spicetify.Menu.Item(
    mwoe_app_state.app_name,
    true,
    () => {
      mwoeOpenSettingsPage(mwoe_app_state);
    },
    "computer"
  );
  menu_item.register();
  menu_item.setState(false)

  // Set up the listeners for active mode, even if not currently in use.
  Spicetify.Player.addEventListener("songchange", () => mwoeSendTrackDataEmissionModeActive(mwoe_app_state));
  Spicetify.Player.addEventListener("onprogress", () => mwoeSendTrackDataEmissionModeActive(mwoe_app_state));
  Spicetify.Player.addEventListener("onplaypause", () => mwoeSendTrackDataEmissionModeActive(mwoe_app_state));
}
