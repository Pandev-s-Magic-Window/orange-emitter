import {retry, Subject, takeUntil} from "rxjs";
import {webSocket} from "rxjs/webSocket";
import type {MwoeAppState} from "../app/mwoe-app-state";
import {mwoeSendTrackData} from "./mwoe-send-track-data";

export function mwoeInitWsClient(mwoe_app_state: MwoeAppState) {
  // Get the saved connection URL for the websocket server
  mwoe_app_state.ws_server_config.connection_url.current_value =
    Spicetify.LocalStorage.get(mwoe_app_state.ws_server_config.connection_url.local_storage_key) ?? undefined;

  if (mwoe_app_state.ws_server_config.connection_url.current_value == null) {
    mwoe_app_state.ws_server_config.connection_url.current_value = mwoe_app_state.ws_server_config.connection_url.default_value;
  }

  // Unsubscribe the websocket client subject (this terminates all action/reties)
  if (mwoe_app_state.ws_client.subject != null) {
    mwoe_app_state.ws_client.retry_stop_flag.next("stop");
    mwoe_app_state.ws_client.subject.unsubscribe();
    mwoe_app_state.ws_client.retry_stop_flag = new Subject<string>();
  }

  // Create the websocket client subject (this won't start any connections yet)
  const connection_url = mwoe_app_state.ws_server_config.connection_url.current_value;
  mwoe_app_state.ws_client.subject = webSocket<string>({
    url: connection_url,
    deserializer: msg => msg.data,
    openObserver: {
      next: () => {
        mwoe_app_state.logger(`Connected to WebSocket server with URL: ${connection_url}`);
      }
    }
  });

  // Subscribe the websocket client subject (this starts the action)
  mwoe_app_state.ws_client.subject
    .pipe(
      takeUntil(mwoe_app_state.ws_client.retry_stop_flag),
      retry(1000) // Retry the connection every second if there is a connection error
    )
    .subscribe({
      next: () => {
        if (mwoe_app_state.emission_mode.value !== 'passive') {
          return;
        }
        // For passive mode, send the current track data when a message is received
        mwoeSendTrackData(mwoe_app_state);
      },
      error: (err) => {
        mwoe_app_state.logger(err);
        // For all errors not covered by retry()
        mwoeInitWsClient(mwoe_app_state);
      }
    });

  if (mwoe_app_state.emission_mode.value !== 'active') {
    return;
  }
}
