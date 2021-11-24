import { setData, getTypes } from './setData.js';
import { setTeacher } from './setTeacher.js';
import { titles, typeNames, teachers } from '../constants/constants.js'

let table;
let rowIndex = 0;
let modalData = null;
let currentData = null;
let currentRow = null;
let dataSubjects = null;

let columns = []
for (let i = 0; i < titles.length; i++) {
  columns.push({ title: titles[i] || `${i+1} - столбец` });
}

function initTable(data) {
  $(document).ready(function() {
    table = $('#example').DataTable({
      // данные
      data: data,
      dom: 'Bfrtip',
      paging: false,
      ordering: false,
      info: false,
      searching: false,
      bAutoWidth: false, 
      select: true,
      columns : columns,
      // кнопка для скачивания в excel
      buttons: [{
        'extend': 'excel',
        text: 'Скачать excel',
        className: 'exportExcel',
        filename: 'list',
        title: null,
        createEmptyCells: true,
        exportOptions: {
          modifier: {
            page: 'all'
          },
          format: {
            body: function ( data ) {
              return `${data}`.split(' ').join('\r\n') 
            }
        }
        },
      }],
      // перевод
      "language": {
        "lengthMenu": "Показать _MENU_ студентов на странице",
        "zeroRecords": "Ничего не найдено - sorry",
        "info": "Показать страницу _PAGE_ из _PAGES_",
        "infoEmpty": "Нет доступных записей",
        "infoFiltered": "(отфильтровано из _MAX_ всех записей)"
      },
    });

    // выбор ячейки и строки
    $('#example tbody').on( 'click', 'td', function () {
      let cell = table.cell( this );
      let cellData = cell.data();
      rowIndex = cell[0][0].row;
      let cellIndex = cell[0][0].column;
      currentData = Object.assign({}, modalData[rowIndex]);
      currentRow = data[rowIndex].slice()
      setTeacher(currentData, selectTeacher.value, currentRow)
    });
    table.on( 'select', function ( e, dt, type, indexes ) {
        let rowData = table.rows( indexes ).data().toArray();
    })

    $('a.toggle-vis').on( 'click', function (e) {
      e.preventDefault();
      e.target.classList.toggle('selected')
      let column = table.column( $(this).attr('data-column') );
      column.visible( ! column.visible() );
    });
  });
}

function changeTable(teacher) {
  let newData = null;
  if (teacher !== 'all') {
    newData = dataSubjects.filter((x,i) => {
      return x.slice(-3).filter(y => y === teacher).length
    });
    let hours = 0;
    modalData.map(x => {
      if (x.lecture && x.lecture.teacher === teacher) {
        hours += parseInt(x.lecture.time) || 0
      }
      if (x.laboratory && x.laboratory.teacher === teacher) {
        hours += parseInt(x.laboratory.time) || 0
      }
      if (x.practise && x.practise.teacher === teacher) {
        hours += parseInt(x.practise.time) || 0
      }
    })
    teacherHours.innerText = `Все количество часов ${hours}`
    let otherData = dataSubjects.filter((x,i) => {
      return !x.slice(-3).filter(y => y == teacher).length
    }); 
    newData = newData.concat(otherData)
  } else {
    newData = dataSubjects.slice(0)
    teacherHours.innerText = ''
  }
  table.clear();
  table.rows.add(newData);
  table.draw();
}

function saveData() {
  modalData[rowIndex] = Object.assign({}, currentData)
  console.log(modalData)
  dataSubjects[rowIndex] = currentRow.slice()
  closeModal.click()
  table.clear();
  table.rows.add(dataSubjects);
  table.draw();
  saveSubjects()
}

export async function getSubjects() {
  const response = await fetch("/getSubjects", {
      method: "GET",
      headers: { "Accept": "application/json" }
  });
  if (response.ok === true) {
      let dataTable = await response.json();
      if (dataTable && dataTable[0] && dataTable[0].subjects && dataTable[0].subjects.length) {
        dataSubjects = dataTable[0].subjects.slice();
        initTable(dataTable[0].subjects);
        modalData = getTypes(dataSubjects.slice());
        console.log(modalData)
      }
  }
}

async function saveSubjects() {
  const response = await fetch("/save-subjects", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({"subjects" : dataSubjects})
  });
  if (response.ok === true) {
      const data = await response.json();
      console.log(data)
  }
}

export function subjects() {
  $(document).ready(function(){
    $("#fileUploader").change(function(evt){
          let selectedFile = evt.target.files[0];
          let reader = new FileReader();
          $(this).hide();
          reader.onload = function(event) {
            let data = event.target.result;
            let workbook = XLSX.read(data, {
                type: 'binary'
            });

            let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]]);
            let dataTable = setData(XL_row_object);
            modalData = getTypes(dataTable);
            initTable(dataTable);
            dataSubjects = dataTable.slice();
          };
          reader.onerror = function(event) {
            console.error("File could not be read! Code " + event.target.error.code);
          };
          reader.readAsBinaryString(selectedFile);
    });
  });
}

function init() {
  let items = [];
  for (let i = 0; i < titles.length; i++) {
    items.push(`<a class="toggle-vis" data-column="${i}">${titles[i]}</a> `)
  }
  tableVisibleMenu.innerHTML = '<div>Нажмите на название чтоб изменить видимость столбцов: ' + items.join(' - ') + '</div> ';
  selectTeacher.innerHTML = teachers.map(x => `<option value="${x.name}">${x.name}</option>`);
  tableTeacher.innerHTML = `<option value="all">Все преподаватели</option>` + 
  teachers.map(x => `<option value="${x.name}">${x.name}</option>`);
  tableTeacherWrapper.hidden = false;
  closeModal.addEventListener('click', () => modalTeacher.classList.toggle('hide'));
  saveDataModal.addEventListener('click', () => saveData())
  selectTeacher.addEventListener('change', (e) => setTeacher(currentData, e.target.value, currentRow))
  tableTeacher.addEventListener('change', (e) => changeTable(e.target.value))
}
init();