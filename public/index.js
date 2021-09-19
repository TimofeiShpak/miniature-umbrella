
let studentName = document.getElementById("studentName")
let studentAge = document.getElementById("studentAge")
let studentId = 0;
let modalAddStudent = document.querySelector('.modal--student-wrapper')
let saveStudent = document.getElementById("save")
let users;
let table;
let options = {
  'имя': 'name',
  'возраст': 'age',
}

function initTable(data) {
  $(document).ready(function() {
    table = $('#example').DataTable({
      // данные
      data: data,
      dom: 'Bfrtip',
      // название столбцов
      columns: [
          { title: "имя" },
          { title: "возраст" },
      ],
      // кнопка для скачивания в excel
      buttons: [{
        extend: 'excel',
        text: 'Скачать excel',
        className: 'exportExcel',
        filename: 'list',
        title: null,
        exportOptions: {
          modifier: {
            page: 'all'
          }
        }
      }],
      // перевод
      "language": {
        "lengthMenu": "Показать _MENU_ студентов на странице",
        "zeroRecords": "Ничего не найдено - sorry",
        "info": "Показать страницу _PAGE_ из _PAGES_",
        "infoEmpty": "Нет доступных записей",
        "infoFiltered": "(отфильтровано из _MAX_ всех записей)"
      },
      // записываем id для каждой строки
      createdRow: function( row, data, dataIndex ) {
        $(row).on('click', () => studentId = users[dataIndex]._id)
      }
    });

    // выбор строки
    $('#example tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    } );

    // удаление строки
    $('#button').click( function () {
        table.row('.selected').remove().draw( false );
        DeleteUser(studentId)
    } );

    // // нажатие на ячейку
    // $('#example tbody').on('click', 'tr', function () {
    //   let data = table.row( this ).data();
    //   alert( 'You clicked on '+data[0]+'\'s row' );
    // } );

    // видимость столбцов
    $('a.toggle-vis').on( 'click', function (e) {
      e.preventDefault();

        // Get the column API object
        let column = table.column( $(this).attr('data-column') );

        // Toggle the visibility
        column.visible( ! column.visible() );
    } );
  });
}

// Получение всех пользователей
async function GetUsers() {
  // отправляет запрос и получаем ответ
  const response = await fetch("/api/users", {
      method: "GET",
      headers: { "Accept": "application/json" }
  });
  // если запрос прошел нормально
  if (response.ok === true) {
      // получаем данные
      const dataUsers = await response.json();
      let rows = document.querySelector("tbody"); 
      // dataUsers.forEach(user => {
      //     // добавляем полученные элементы в таблицу
      //     rows.append(row(user));
      // });
      users = dataUsers;
      initTable(users.map(x => [x.name, x.age]));
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
      studentId = user._id;
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
      users.push(user);
      table.data.push([user.name, user.age]);
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

// Обновление всех пользователей
async function UpdateAllUsers(dataUsers) {
  const response = await fetch("/api/users-update-all", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({"users" : dataUsers})
  });
  if (response.ok === true) {

  }
}

// сброс формы
function reset() {
  studentName.value = '';
  studentAge.value = '';
  studentId = '0';
}
// создание строки для таблицы
function row(user) {

  const tr = document.createElement("tr");
  tr.setAttribute("data-rowid", user._id);

  // const idTd = document.createElement("td");
  // idTd.append(user._id);
  // tr.append(idTd);

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
  const id = studentId;
  const name = studentName.value;
  const age = studentAge.value;
  if (id == 0) {
    CreateUser(name, age);
    table.row.add( [
      name, age
    ] ).draw( false );
  } else {
    EditUser(id, name, age);
  }
  modalAddStudent.classList.add('hide')
});

GetUsers();

document.querySelector('#addStudent').addEventListener('click', () => modalAddStudent.classList.remove('hide'))
document.querySelector('#button-edit').addEventListener('click', () => {
  GetUser(studentId);
  modalAddStudent.classList.remove('hide')
})


$(document).ready(function(){
  $("#fileUploader").change(function(evt){
        let selectedFile = evt.target.files[0];
        let reader = new FileReader();
        reader.onload = function(event) {
          let data = event.target.result;
          let workbook = XLSX.read(data, {
              type: 'binary'
          });
          workbook.SheetNames.forEach(function(sheetName) {
            
              let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
              let preparedData = XL_row_object.map(x => {
                return {
                  age: x['возраст'],
                  name: x['имя']
                }
              })
              users = preparedData.map(x => Object.values(x));
              table.clear();
              table.rows.add(users);
              table.draw();
              UpdateAllUsers(preparedData);
            })
        };

        reader.onerror = function(event) {
          console.error("File could not be read! Code " + event.target.error.code);
        };

        reader.readAsBinaryString(selectedFile);
  });
});