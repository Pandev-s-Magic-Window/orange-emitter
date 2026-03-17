import {mwoeChangeSubmitButtonState} from "./mwoe-change-submit-button-state";
import {Subject, takeUntil, timeout} from "rxjs";
import {webSocket} from "rxjs/webSocket";
import type {MwoeAppState} from "../app/mwoe-app-state";
import {mwoeInitWsClient} from "../ws-client/mwoe-init-ws-client";

export function mwoeChangeSettingWsServerConnectionUrl(
  mwoe_app_state: MwoeAppState,
  submit_button_el?: HTMLButtonElement
) {
  if (submit_button_el == null) {
    return;
  }

  const input_el = submit_button_el.previousElementSibling?.previousElementSibling as HTMLInputElement | null | undefined;
  if (input_el == null) {
    return;
  }

  mwoeChangeSubmitButtonState(submit_button_el, "applying");

  const new_connection_url = input_el.value;
  if (new_connection_url == null || new_connection_url === "") {
    mwoeChangeSubmitButtonState(submit_button_el, "error", "Please submit a non-empty value");
    return;
  }

  // Terminate the current websocket connection (if any)
  mwoe_app_state.ws_client.retry_stop_flag.next("stop");
  mwoe_app_state.ws_client.subject?.unsubscribe();

  // Prepare a test connection to see if the URL is valid
  const test_stop_flag = new Subject<string>();
  const test_ws_client = webSocket<string>({
    url: new_connection_url,
    deserializer: msg => msg.data,
    openObserver: {
      next: () => {
        mwoeChangeSubmitButtonState(submit_button_el, "success");

        // Save the new valid connection URL for the websocket server
        Spicetify.LocalStorage.set(
          mwoe_app_state.ws_server_config.connection_url.local_storage_key,
          new_connection_url
        );

        // Re-init the main websocket client
        mwoeInitWsClient(mwoe_app_state);

        // End the connection manually
        test_stop_flag.next("stop");
      },
      error: () => {
        mwoeChangeSubmitButtonState(submit_button_el, "error", "Connection error");
        // Here we also want to re-init the main websocket client
        mwoeInitWsClient(mwoe_app_state)
      }
    }
  });

  // Run the test
  test_ws_client.pipe(
    takeUntil(test_stop_flag),
    timeout(5000)
  ).subscribe({
    error: () => {
      mwoeChangeSubmitButtonState(submit_button_el, "error", "Connection error");
      // Here we also want to re-init the main websocket client
      mwoeInitWsClient(mwoe_app_state);
    }
  });
}
