export function checkIsAdmin() {
  if (window.user.isAdmin) {
    addNewProgram.classList.remove('hide');
    showModalTeacherBtn.classList.remove('hide');
  } else {
    addNewProgram.classList.add('hide');
    showModalTeacherBtn.classList.add('hide');
  }
}