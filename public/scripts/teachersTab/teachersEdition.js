let teacherData = null;

showModalTeacherBtn.addEventListener('click', openAddNewTeacher);
hideModalTeacherBtn.addEventListener('click', hideTeacherModal);

inputMaxHoursTeacher.addEventListener('input', (event) => {
  event.target.value = (event.target.value.replaceAll(/[^0-9]/g, ''))
})

function openAddNewTeacher() {
  $('#addTeacherModal').modal('show');
  teacherModalLabel.innerText = 'Добавление преподавателя';
  deleteTeacherBtn.classList.add('hide');
  seeTeacherProfileBtn.classList.add('hide');
  addTeacherModal.dataset.type = 'add';
  modalViewTeacher.classList.add('hide');
  modalEditTeacher.classList.remove('hide');
  addTeacherProfileModal.classList.remove('hide');
}

export function openEditTeacher(data, index) {
  $('#addTeacherModal').modal('show');
  teacherModalLabel.innerText = 'Редактирование преподавателя';
  seeTeacherProfileBtn.classList.remove('hide');
  modalViewTeacher.classList.add('hide');
  modalEditTeacher.classList.remove('hide');
  addTeacherProfileModal.classList.add('hide');
  inputNameTeacher.value = data.name;
  inputMaxHoursTeacher.value = data.maxHours;
  inputMaxHoursTeacher.min = data.currentHours;
  inputNameTeacher.dataset.id = data._id;
  addTeacherModal.dataset.type = 'edit';
  addTeacherModal.dataset.index = index;
  teacherData = data;
  if (data._id === window.user._id) {
    deleteTeacherBtn.classList.add('hide')
  } else {
    deleteTeacherBtn.classList.remove('hide')
  }
}

export function hideTeacherModal() {
  inputNameTeacher.value = '';
  inputMaxHoursTeacher.value = '';
  inputMaxHoursTeacher.min = 0;
  inputNameTeacher.dataset.id = '';
  inputLoginTeacher.value = '';
  inputPasswordTeacher.value = '';
  $('#addTeacherModal').modal('hide');
  inputMaxHoursTeacherError.innerText = '';
  inputNameTeacherError.innerText = '';
  inputLoginTeacherError.innerText = '';
  inputPasswordTeacherError.classList.add('hide');
  addTeacherInfoModal.classList.remove('hide');
  addTeacherModalError.innerText = '';
}

seeTeacherProfileBtn.addEventListener('click', checkProfileTeacher)
changeModalTeacherBtn.addEventListener('click', changeProfileTeacher)
cancelModalTeacherBtn.addEventListener('click', cancelProfileTeacher)

function checkProfileTeacher() {
  modalViewTeacher.classList.remove('hide');
  modalEditTeacher.classList.add('hide');
  loginTeacherView.innerText = `логин: ${teacherData.login}`;
  passwordTeacherView.innerText = `пароль: ${teacherData.password}`;
}

function changeProfileTeacher() {
  modalViewTeacher.classList.add('hide');
  modalEditTeacher.classList.remove('hide');
  deleteTeacherBtn.classList.add('hide');
  seeTeacherProfileBtn.classList.add('hide');
  addTeacherInfoModal.classList.add('hide');
  addTeacherProfileModal.classList.remove('hide');
  addTeacherModal.dataset.type = 'changeProfile';
  inputLoginTeacher.value = teacherData.login;
  inputPasswordTeacher.value = teacherData.password;
  addTeacherModalError.innerText = '';
}

function cancelProfileTeacher() {
  modalViewTeacher.classList.add('hide');
  modalEditTeacher.classList.remove('hide');
  addTeacherModalError.innerText = '';
}