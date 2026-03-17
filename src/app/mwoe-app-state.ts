import type {WebSocketSubject} from "rxjs/webSocket";
import {Subject} from "rxjs";

export interface MwoeAppState {
  app_name: string;
  emission_mode: {
    value: 'active' | 'passive',
    local_storage_key: string
  };
  ws_server_config: {
    connection_url: {
      current_value?: string;
      default_value: string,
      local_storage_key: string
    }
  };
  ws_client: {
    subject?: WebSocketSubject<string>
    retry_stop_flag: Subject<string>
  };
  logger: (...item_list: any[]) => void;
}
