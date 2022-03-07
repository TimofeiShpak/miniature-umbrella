export function validateTeacher() {
  let isValid = true;
  let type = addTacherModal.dataset.type;
  if (!inputNameTeacher.value && (type === 'edit' || type === 'add')) {
    isValid = false;
    inputNameTeacherError.innerText = 'Укажите ФИО'
  } else {
    inputNameTeacherError.innerText = ''
  }
  if (!inputMaxHoursTeacher.value && (type === 'edit' || type === 'add')) {
    isValid = false;
    inputMaxHoursTeacherError.classList.remove('hide')
  } else {
    inputMaxHoursTeacherError.classList.add('hide')
  }
  if (!inputLoginTeacher.value && (type === 'changeProfile' || type === 'add')) {
    isValid = false;
    inputLoginTeacherError.classList.remove('hide')
  } else {
    inputLoginTeacherError.classList.add('hide')
  }
  if (!inputPasswordTeacher.value && (type === 'changeProfile' || type === 'add')) {
    isValid = false;
    inputPasswordTeacherError.classList.remove('hide')
  } else {
    inputPasswordTeacherError.classList.add('hide')
  }
  return isValid;
}