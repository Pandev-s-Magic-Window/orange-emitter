import type {MwoeAppState} from "../app/mwoe-app-state";

export function mwoeSendTrackData(mwoe_app_state: MwoeAppState) {
  const track_data = Spicetify.Player.data?.item;
  if (track_data == null) {
    return;
  }
  mwoe_app_state.ws_client.subject?.next(
    JSON.stringify(track_data)
  );
}
