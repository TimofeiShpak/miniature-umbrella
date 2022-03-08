import { api } from "./api/serverFunctions.js";
import { openConfirm } from "./modal/confirm.js";
import { checkIsAdmin } from "./settingsApp/settingsAccess.js";
import { initTabs } from "./settingsApp/settingsTabs.js";

loginInBtn.addEventListener('click', checkLogIn);
logOutBtn.addEventListener('click', logOut);

async function checkLogIn() {
  let login = loginInput.value;
  let password = passwordInput.value; 
  if (login && password) {
    const dto = {
      login: login,
      password: password,
    }
    let data = await api.checkTeacher(dto);
    if (data && data.length) {
      localStorage.setItem('user', JSON.stringify(data[0]));
      window.user = data[0] || {};
      userInfo.innerText = window.user.name;
      loginInput.value = '';
      passwordInput.value = '';
      await initTabs();
      $('#modalLogIn').modal('hide');
      modalLogInError.classList.add('hide');
      app.classList.remove('hide');
      checkIsAdmin();
    } else {
      modalLogInError.classList.remove('hide');
    }
  }
  if (!login) {
    modalLoginErrorInput.classList.remove('hide');
  } else {
    modalLoginErrorInput.classList.add('hide');
  }
  if (!password) {
    modalPasswordErrorInput.classList.remove('hide');
  } else {
    modalPasswordErrorInput.classList.add('hide');
  }
}

function logOut() {
  const action = () => {
    $('#modalLogIn').modal('show');
    app.classList.add('hide');
    localStorage.removeItem('user');
  }
  openConfirm(action, null, 'Вы уверены что хотите выйти? После выхода вам придется опять ввести логин и пароль')
}

export async function initApp() {
  let user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    window.user = user;
    userInfo.innerText = user.name;
    await initTabs();
    app.classList.remove('hide');
  } else {
    setTimeout(() => $('#modalLogIn').modal('show'))
  }
}