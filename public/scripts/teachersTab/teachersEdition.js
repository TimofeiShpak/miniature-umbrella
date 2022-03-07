let teacherData = null;

showModalTeacherBtn.addEventListener('click', openAddNewTeacher);
hideModalTeacherBtn.addEventListener('click', hideTeacherModal);

inputMaxHoursTeacher.addEventListener('input', (event) => {
  event.target.value = Math.max(event.target.min, +(event.target.value.replaceAll(/[^0-9]/g, '')))
})

function openAddNewTeacher() {
  $('#addTacherModal').modal('show');
  teacherModalLabel.innerText = 'Добавление преподавателя';
  deleteTeacherBtn.classList.add('hide');
  seeTeacherProfileBtn.classList.add('hide');
  addTacherModal.dataset.type = 'add';
  modalViewTeacher.classList.add('hide');
  modalEditTeacher.classList.remove('hide');
  addTeacherProfileModal.classList.remove('hide');
}

export function openEditTeacher(data) {
  $('#addTacherModal').modal('show');
  teacherModalLabel.innerText = 'Редактирование преподавателя';
  deleteTeacherBtn.classList.remove('hide');
  seeTeacherProfileBtn.classList.remove('hide');
  modalViewTeacher.classList.add('hide');
  modalEditTeacher.classList.remove('hide');
  addTeacherProfileModal.classList.add('hide');
  inputNameTeacher.value = data.name;
  inputMaxHoursTeacher.value = data.maxHours;
  inputMaxHoursTeacher.min = data.currentHours;
  inputNameTeacher.dataset.id = data._id;
  addTacherModal.dataset.type = 'edit';
  teacherData = data;
}

export function hideTeacherModal() {
  inputNameTeacher.value = '';
  inputMaxHoursTeacher.value = '';
  inputMaxHoursTeacher.min = 0;
  inputNameTeacher.dataset.id = '';
  inputLoginTeacher.value = '';
  inputPasswordTeacher.value = '';
  $('#addTacherModal').modal('hide');
  inputMaxHoursTeacherError.classList.add('hide');
  inputNameTeacherError.innerText = '';
  inputLoginTeacherError.classList.add('hide');
  inputPasswordTeacherError.classList.add('hide');
  addTeacherInfoModal.classList.remove('hide');
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
  addTacherModal.dataset.type = 'changeProfile';
  inputLoginTeacher.value = teacherData.login;
  inputPasswordTeacher.value = teacherData.password;
}

function cancelProfileTeacher() {
  modalViewTeacher.classList.add('hide');
  modalEditTeacher.classList.remove('hide');
}