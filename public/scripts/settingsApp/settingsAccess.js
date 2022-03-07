export function checkIsAdmin() {
  if (window.isAdmin) {
    andNewProgram.classList.remove('hide');
    showModalTeacherBtn.classList.remove('hide');
  } else {
    andNewProgram.classList.add('hide');
    showModalTeacherBtn.classList.add('hide');
  }
}