import { setData, getTypes } from './setData.js';
import { setTeacher } from '../forTeacher/setTeacher.js';
import { titles, teachers, dataTableOptions } from '../../constants/constants.js'
import { initPrograms, showPrograms } from '../programs/programs.js';
import { changeTable } from './changeTable.js';
import { api } from '../api/serverFunctions.js';
import { checkNewProgram } from '../programs/validation.js'

let table;
let rowIndex = 0;
let modalData = null;
let currentData = null;
let currentRow = null;
let dataSubjects = null;
let dataId = null;

function initTable(data) {
  $(document).ready(function() {
    dataTableOptions.data = data
    table = $('#example').DataTable(dataTableOptions);

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

async function saveData() {
  modalData[rowIndex] = Object.assign({}, currentData)
  dataSubjects[rowIndex] = currentRow.slice()
  closeModal.click()
  table.clear();
  table.rows.add(dataSubjects);
  table.draw();
  await api.saveSubjects({subjects: dataSubjects, id: dataId, save: true })
}

function saveFile() {
  let reader = new FileReader();
  reader.onload = async function(event) {
    let data = event.target.result;
    let workbook = XLSX.read(data, {
        type: 'binary'
    });

    let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]]);
    let dataTable = setData(XL_row_object);
    modalData = getTypes(dataTable);
    // initTable(dataTable);
    dataSubjects = dataTable.slice();
    if (dataSubjects && dataSubjects.length) {
      let name = programNameInput.value;
      await api.saveNewSubjects(dataSubjects, name)
      fileUploader.value = '';
      programNameInput.value = '';
      await showPrograms();
      saveNewProgram.classList.add('hide')
      saveNewProgramOptions.classList.add('hide')
    }
  };
  reader.onerror = function(event) {
    console.error("File could not be read! Code " + event.target.error.code);
  };
  reader.readAsBinaryString(fileUploader.files[0]);
}

function setProgramByName(dataTable) {
  if (dataTable) {
    if (dataTable.length === 1 && dataTable[0].subjects && dataTable[0].subjects.length) {
      tableWrapper.hidden = false;
      programs.classList.add('hide')
      dataSubjects = dataTable[0].subjects.slice();
      if (table) {
        table.clear();
        table.rows.add(dataSubjects);
        table.draw();
      } else {
        initTable(dataSubjects)
      }
      modalData = getTypes(dataSubjects.slice());
      dataId = dataTable[0]._id
    }
  }
}

async function selectProgram(event) {
  let element = event.target.closest('.interactive'); 
  if (element && element.dataset && element.dataset.name) {
    let dataTable = await api.getProgramByName(element.dataset.name);
    setProgramByName(dataTable)
  }
}

export async function init() {
  let items = [];
  for (let i = 0; i < titles.length; i++) {
    items.push(`<a class="toggle-vis" data-column="${i}">${titles[i]}</a> `)
  }
  tableVisibleMenu.innerHTML = '<button id="visibleColumnsButton">Отображение столбцов</button>' + 
  '<div id="visibleColumns" hidden>Настроить видимость можно нажав на название столбца' +
  '<div>' + items.join(' - ') + '</div></div>';
  selectTeacher.innerHTML = teachers.map(x => `<option value="${x.name}">${x.name}</option>`);
  tableTeacher.innerHTML = `<option value="all">Все преподаватели</option>` + 
  teachers.map(x => `<option value="${x.name}">${x.name}</option>`);
  closeModal.addEventListener('click', () => modalTeacher.classList.toggle('hide'));
  saveDataModal.addEventListener('click', () => saveData())
  selectTeacher.addEventListener('change', (e) => {
    setTeacher(currentData, e.target.value, currentRow)
  })
  tableTeacher.addEventListener('change', (e) => {
    changeTable(e.target.value, table, dataSubjects, modalData)
  })
  visibleColumnsButton.addEventListener('click', ()=> {
    visibleColumns.hidden = !visibleColumns.hidden;
    visibleColumnsButton.classList.toggle('active-btn')
  })
  chooseProgram.addEventListener('click', () => showPrograms())
  saveNewProgramBtn.addEventListener('click', () => {
    checkNewProgram(saveFile)
  });
  programs.addEventListener('click', (event) => selectProgram(event));
  initPrograms();
}