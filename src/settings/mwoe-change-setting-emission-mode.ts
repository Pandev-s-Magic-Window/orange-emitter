import {mwoeChangeSubmitButtonState} from "./mwoe-change-submit-button-state";
import type {MwoeAppState} from "../app/mwoe-app-state";

export function mwoeChangeSettingEmissionMode(
  mwoe_app_state: MwoeAppState,
  submit_button_el?: HTMLButtonElement
) {
  if (submit_button_el == null) {
    return;
  }

  const select_el = submit_button_el.previousElementSibling?.previousElementSibling as HTMLSelectElement | null | undefined;
  if (select_el == null) {
    return;
  }

  const selected_emission_mode = select_el.value;
  if (selected_emission_mode == null || selected_emission_mode === "") {
    mwoeChangeSubmitButtonState(submit_button_el, "error", "Please submit a non-empty value");
    return;
  }

  // Save the new emission mode
  Spicetify.LocalStorage.set(
    mwoe_app_state.emission_mode.local_storage_key,
    selected_emission_mode
  );
  mwoe_app_state.emission_mode.value = selected_emission_mode as typeof mwoe_app_state.emission_mode.value;

  mwoeChangeSubmitButtonState(submit_button_el, "success");
}
