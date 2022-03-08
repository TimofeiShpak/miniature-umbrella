export function openConfirm(action, data, text) {
  $('#modalConfirm').modal('show');
  modalConfirmText.innerText = text;

  modalConfirmSubmit.onclick = () => {
    action(data);
    $('#modalConfirm').modal('hide')
  }
}

modalConfirmCancel.addEventListener('click', () => $('#modalConfirm').modal('hide'))