import {retry, Subject, takeUntil} from "rxjs";
import {webSocket} from "rxjs/webSocket";
import type {AppState} from "../app/app-state";
import {sendTrackData} from "./send-track-data";

export function initWsClient(app_state: AppState) {
  // Get the saved connection URL for the websocket server
  app_state.ws_server_config.connection_url.current_value =
    Spicetify.LocalStorage.get(app_state.ws_server_config.connection_url.local_storage_key) ?? undefined;

  if (app_state.ws_server_config.connection_url.current_value == null) {
    app_state.ws_server_config.connection_url.current_value = app_state.ws_server_config.connection_url.default_value;
  }

  // Unsubscribe the websocket client subject (this terminates all action/reties)
  if (app_state.ws_client.subject != null) {
    app_state.ws_client.retry_stop_flag.next("stop");
    app_state.ws_client.subject.unsubscribe();
    app_state.ws_client.retry_stop_flag = new Subject<string>();
  }

  // Create the websocket client subject (this won't start any connections yet)
  const connection_url = app_state.ws_server_config.connection_url.current_value;
  app_state.ws_client.subject = webSocket<string>({
    url: connection_url,
    deserializer: msg => msg.data,
    openObserver: {
      next: () => {
        app_state.logger(`Connected to WebSocket server with URL: ${connection_url}`);
      }
    }
  });

  // Subscribe the websocket client subject (this starts the action)
  app_state.ws_client.subject
    .pipe(
      takeUntil(app_state.ws_client.retry_stop_flag),
      retry(1000) // Retry the connection every second if there is a connection error
    )
    .subscribe({
      next: () => {
        if (app_state.emission_mode.value !== 'passive') {
          return;
        }
        // For passive mode, send the current track data when a message is received
        sendTrackData(app_state);
      },
      error: (err) => {
        app_state.logger(err);
        // For all errors not covered by retry()
        initWsClient(app_state);
      }
    });

  if (app_state.emission_mode.value !== 'active') {
    return;
  }
}
