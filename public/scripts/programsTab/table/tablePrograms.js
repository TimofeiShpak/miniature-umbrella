import { setData, getTypes } from './setData.js';
import { setTeacher } from '../forTeacher/setTeacher.js';
import { dataTableOptions } from '../../../constants/constants.js'
import { showPrograms } from '../programs/programs.js';
import { api } from '../api/serverFunctions.js';
import { checkNewProgram } from '../programs/validation.js';
import { drawElements } from './drawElements.js';
import { selectProgram, updateTableSubjects } from './selectProgram.js';

let table;
let rowIndex = 0;
let modalData = null;
let currentData = null;
let currentRow = null;
let dataSubjects = null;
let dataBaseSubjects = null;
let teachers = [];

drawElements();

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
      let teacher = teachers.find(x => x._id === selectTeacher.value)
      setTeacher(currentData, selectTeacher.value, currentRow, teacher.name)
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

async function updateTable(data) {
  modalData = await getTypes(data)
  if (table) {
    table.clear();
    table.rows.add(data);
    table.draw();
  } else {
    initTable(data)
  }
}

async function saveData() {
  let id = dataBaseSubjects[rowIndex]._id;
  closeModal.click()
  let teachersData = {};
  if (currentData && currentData.lecture && currentData.lecture.teacher) {
    teachersData[currentData.lecture.teacher] = currentData.lecture.time;
  }
  if (currentData && currentData.laboratory && currentData.laboratory.teacher) {
    let teacher = currentData.laboratory.teacher;
    teachersData[teacher] = (teachersData[teacher] || 0) + +currentData.laboratory.time;
  }
  if (currentData && currentData.practise && currentData.practise.teacher) {
    let teacher = currentData.practise.teacher;
    teachersData[teacher] = (teachersData[teacher] || 0) + +currentData.practise.time;
  }
  await api.saveSubjects({ subject: currentRow, id, save: true, teachersData });
  let data = await updateTableSubjects();
  dataBaseSubjects = data;
  dataSubjects = dataBaseSubjects.map(x => x.subject);
  updateTable(dataSubjects);
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
    dataSubjects = dataTable.slice();
    if (dataSubjects && dataSubjects.length) {
      let name = programNameInput.value;
      let programId = 'id' + (new Date()).getTime();
      let newDataBaseSubjects = dataSubjects.slice(0, 2).map(x => {
        return {
          programId: programId,
          subject: x,
        }
      })
      await api.saveNewSubjects(newDataBaseSubjects, programId, name)
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

saveDataModal.addEventListener('click', () => saveData())

selectTeacher.addEventListener('change', (e) => {
  let teacher = teachers.find(x => x._id === e.target.value)
  setTeacher(currentData, e.target.value, currentRow, teacher.name)
})

saveNewProgramBtn.addEventListener('click', () => {
  checkNewProgram(saveFile)
});

programs.addEventListener('click', async (event) => {
  let data = await selectProgram(event);
  if (data) {
    dataBaseSubjects = data;
    dataSubjects = dataBaseSubjects.map(x => x.subject);
    updateTable(dataSubjects)
  }
});

export async function initProgramsTab() {
  teachers = await api.getTeachers();
  selectTeacher.innerHTML = teachers.map(x => `<option value="${x._id}">${x.name}</option>`);
  showPrograms();
  programsTab.classList.add('active');
  programsPage.classList.remove('hide');
  await api.getSubjectsByTeacher({teacherId: teachers[1]._id})
}

export function hideProgramsTab() {
  programsTab.classList.remove('active');
  programsPage.classList.add('hide');
}