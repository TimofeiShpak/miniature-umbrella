import { getTeachers } from "./initTeacher.js";

export function validateTeacher() {
  let isValid = true;
  let type = addTeacherModal.dataset.type;
  let login = inputLoginTeacher.value;
  let password = inputPasswordTeacher.value;
  let name = inputNameTeacher.value;
  let maxHours = +inputMaxHoursTeacher.value;
  let teachers = getTeachers();
  let teacher = teachers[addTeacherModal.dataset.index];
  if (!name && (type === 'edit' || type === 'add')) {
    isValid = false;
    inputNameTeacherError.innerText = 'укажите ФИО'
  } else {
    inputNameTeacherError.innerText = ''
  }
  if (!maxHours && (type === 'edit' || type === 'add')) {
    isValid = false;
    inputMaxHoursTeacherError.innerText = 'укажите максимальное количество часов'
  } else {
    if (maxHours < +inputMaxHoursTeacher.min) {
      isValid = false;
      inputMaxHoursTeacherError.innerText = `максимальное количество часов не может быть меньше занятых ${inputMaxHoursTeacher.min}`
    } else {
      inputMaxHoursTeacherError.innerText = ''
    }
  }
  if (!login && (type === 'changeProfile' || type === 'add')) {
    isValid = false;
    inputLoginTeacherError.innerText = 'укажите логин';
  } else {
    let teachersLogin = teachers.map(x => x.login);
    if (teachersLogin.includes(login)) {
      isValid = false;
      inputLoginTeacherError.innerText = 'логин занят';
    } else {
      inputLoginTeacherError.innerText = '';
    }
  }
  if (!password && (type === 'changeProfile' || type === 'add')) {
    isValid = false;
    inputPasswordTeacherError.classList.remove('hide')
  } else {
    inputPasswordTeacherError.classList.add('hide')
  }
  if (type === 'edit' && (teacher.name === name && teacher.maxHours === maxHours)) {
    isValid = false;
    addTeacherModalError.innerText = 'ничего не изменилось'
  } else if (type === 'changeProfile' && (teacher.login === login && teacher.password === password)) {
    isValid = false;
    addTeacherModalError.innerText = 'ничего не изменилось'
  } else {
    addTeacherModalError.innerText = ''
  }
  return isValid;
}