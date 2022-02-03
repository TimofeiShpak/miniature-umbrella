import { api } from "../programsTab/api/serverFunctions.js";

showModalTeacherBtn.addEventListener('click', () => $('#exampleModal').modal('show'));
hideModalTeacherBtn.addEventListener('click', () => $('#exampleModal').modal('hide'));

inputMaxHoursTeacher.addEventListener('input', (event) => {
  event.target.value = Math.max(1, +(event.target.value.replaceAll(/[^0-9]/g, '')))
})

export async function saveNewTeacher() {
  let isValid = validateTeacher();
  if (isValid) {
    const dto = { 
      name : inputNameTeacher.value, 
      currentHours: 0, 
      maxHours: inputMaxHoursTeacher.value, 
      save: true 
    }
    await api.saveTeacher(dto);
    inputNameTeacher.value = '';
    inputMaxHoursTeacher.value = '';
    $('#exampleModal').modal('hide');
  }
}

function validateTeacher() {
  let isValid = true;
  if (!inputNameTeacher.value) {
    isValid = false;
    inputNameTeacherError.innerText = 'Укажите ФИО'
  } else {
    inputNameTeacherError.innerText = ''
  }
  if (!inputMaxHoursTeacher.value) {
    isValid = false;
    inputMaxHoursTeacherError.classList.remove('hide')
  } else {
    inputMaxHoursTeacherError.classList.remove('add')
  }
  return isValid;
}