import type {MwoeAppState} from "../app/mwoe-app-state";
import {mwoeSendTrackData} from "./mwoe-send-track-data";

export function mwoeSendTrackDataEmissionModeActive(mwoe_app_state: MwoeAppState) {
  if (mwoe_app_state.emission_mode.value === 'active') {
    mwoeSendTrackData(mwoe_app_state);
  }
}
