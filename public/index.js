let studentName = document.getElementById("studentName")
let studentAge = document.getElementById("studentAge")
let studentId = document.getElementById("studentId")
let modalAddStudent = document.querySelector('.modal--student-wrapper')
let saveStudent = document.getElementById("save")

// Получение всех пользователей
export async function GetUsers() {
  // отправляет запрос и получаем ответ
  const response = await fetch("/api/users", {
      method: "GET",
      headers: { "Accept": "application/json" }
  });
  // если запрос прошел нормально
  if (response.ok === true) {
      // получаем данные
      const users = await response.json();
      let rows = document.querySelector("tbody"); 
      users.forEach(user => {
          // добавляем полученные элементы в таблицу
          rows.append(row(user));
      });
  }
}
// Получение одного пользователя
async function GetUser(id) {
  const response = await fetch("/api/users/" + id, {
      method: "GET",
      headers: { "Accept": "application/json" }
  });
  if (response.ok === true) {
      const user = await response.json();
      studentId.value = user._id;
      studentName.value = user.name;
      studentAge.value = user.age;
      modalAddStudent.classList.remove('hide')
  }
}
// Добавление пользователя
async function CreateUser(userName, userAge) {

  const response = await fetch("api/users", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
          name: userName,
          age: parseInt(userAge, 10)
      })
  });
  if (response.ok === true) {
      const user = await response.json();
      reset();
      document.querySelector("tbody").append(row(user));
  }
}
// Изменение пользователя
async function EditUser(userId, userName, userAge) {
  const response = await fetch("api/users", {
      method: "PUT",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
          id: userId,
          name: userName,
          age: parseInt(userAge, 10)
      })
  });
  if (response.ok === true) {
      const user = await response.json();
      reset();
      document.querySelector("tr[data-rowid='" + user._id + "']").replaceWith(row(user));
  }
}
// Удаление пользователя
async function DeleteUser(id) {
  const response = await fetch("/api/users/" + id, {
      method: "DELETE",
      headers: { "Accept": "application/json" }
  });
  if (response.ok === true) {
      const user = await response.json();
      document.querySelector("tr[data-rowid='" + user._id + "']").remove();
  }
}

// сброс формы
function reset() {
  studentName.value = '';
  studentAge.value = '';
  studentId.value = '0';
}
// создание строки для таблицы
function row(user) {

  const tr = document.createElement("tr");
  tr.setAttribute("data-rowid", user._id);

  const idTd = document.createElement("td");
  idTd.append(user._id);
  tr.append(idTd);

  const nameTd = document.createElement("td");
  nameTd.append(user.name);
  tr.append(nameTd);

  const ageTd = document.createElement("td");
  ageTd.append(user.age);
  tr.append(ageTd);
    
  const linksTd = document.createElement("td");

  const editLink = document.createElement("a");
  editLink.setAttribute("data-id", user._id);
  editLink.setAttribute("style", "cursor:pointer;padding:15px;");
  editLink.append("Изменить");
  editLink.addEventListener("click", e => {

      e.preventDefault();
      GetUser(user._id);
  });
  linksTd.append(editLink);

  const removeLink = document.createElement("a");
  removeLink.setAttribute("data-id", user._id);
  removeLink.setAttribute("style", "cursor:pointer;padding:15px;");
  removeLink.append("Удалить");
  removeLink.addEventListener("click", e => {

      e.preventDefault();
      DeleteUser(user._id);
  });

  linksTd.append(removeLink);
  tr.appendChild(linksTd);

  return tr;
}
// сброс значений формы
document.getElementById("reset").addEventListener('click', (event) => {
  reset();
  modalAddStudent.classList.add('hide')
})


// отправка формы
saveStudent.addEventListener("click", () => {
  const id = studentId.value;
  const name = studentName.value;
  const age = studentAge.value;
  if (id == 0) {
    CreateUser(name, age);
  } else {
    EditUser(id, name, age);
  }
  modalAddStudent.classList.add('hide')
});

GetUsers();

document.querySelector('#addStudent').addEventListener('click', () => modalAddStudent.classList.remove('hide'))
