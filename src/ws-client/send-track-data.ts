import type {AppState} from "../app/app-state";

export function sendTrackData(app_state: AppState) {
  const track_data = Spicetify.Player.data?.item;
  if (track_data == null) {
    return;
  }
  app_state.ws_client.subject?.next(
    JSON.stringify(track_data)
  );
}
