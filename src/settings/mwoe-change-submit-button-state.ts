export function mwoeChangeSubmitButtonState(
  submit_button_el: HTMLButtonElement,
  action: 'applying' | 'error' | 'success',
  error_message?: string
) {
  if (action === 'applying') {
    submit_button_el.disabled = true;
    submit_button_el.style.cursor = "not-allowed";
    submit_button_el.style.backgroundColor = '#405055';
    submit_button_el.style.color = '#24ffc3';
    submit_button_el.textContent = 'Applying changes...';
    return;
  }

  if (action === 'success') {
    submit_button_el.disabled = true;
    submit_button_el.style.cursor = "not-allowed";
    submit_button_el.style.backgroundColor = '#455540';
    submit_button_el.style.color = '#6dff24';
    submit_button_el.textContent = 'Setting Saved Successfully!';
    return;
  }

  submit_button_el.disabled = false;
  submit_button_el.style.cursor = "pointer";
  submit_button_el.style.backgroundColor = '#554040';
  submit_button_el.style.color = '#ffb6b6';
  submit_button_el.textContent = `${error_message}. Click here to retry.`;
}
