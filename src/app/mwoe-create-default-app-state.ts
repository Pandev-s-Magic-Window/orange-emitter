import {Subject} from "rxjs";
import type {MwoeAppState} from "./mwoe-app-state";

export function mwoeCreateDefaultAppState(): MwoeAppState {
  return {
    app_name: "Magic Window: The Orange Emitter",
    emission_mode: {
      value: 'active',
      local_storage_key: 'mwOrangeEmitter:emissionMode',
    },
    ws_server_config: {
      connection_url: {
        default_value: 'ws-client://localhost:6603',
        local_storage_key: 'mwOrangeEmitter:wsServerConnectionUrl'
      }
    },
    ws_client: {
      retry_stop_flag: new Subject<string>(),
    },
    logger: (item_list) => {
      console.log('[MwOrangeEmitter]', item_list);
    }
  }
}
