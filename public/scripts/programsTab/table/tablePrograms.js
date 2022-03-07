import { setData, getType } from './setData.js';
import { setTeacher } from '../forTeacher/setTeacher.js';
import { dataTableOptions } from '../../constants/constants.js'
import { showPrograms } from '../programs/programs.js';
import { api } from '../../api/serverFunctions.js';
import { checkNewProgram } from '../programs/validation.js';
import { drawElements } from './drawElements.js';
import { selectProgram, updateTableSubjects } from './selectProgram.js';

let table;
let rowIndex = 0;
let currentData = null;
let currentRow = null;
let dataSubjects = null;
let dataBaseSubjects = null;
let onlySubjects = null;

drawElements();

function initTable(data) {
  $(document).ready(function() {
    dataTableOptions.data = data
    table = $('#example').DataTable(dataTableOptions);

    // выбор ячейки и строки
    $('#example tbody').on( 'click', 'td', function () {
      if (window.isAdmin) {
        let cell = table.cell( this );
        // let cellData = cell.data();
        rowIndex = cell[0][0].row;
        // let cellIndex = cell[0][0].column;
        currentRow = data[rowIndex].slice();
        currentData = getType(onlySubjects[rowIndex]);
        $('#modalSelectTeacher').modal('show');
        setTeacher(currentData, selectTeacher.value, currentRow)
      }
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

function updateTable(data) {
  dataBaseSubjects = data;
  onlySubjects = data.map(x => x.subject);
  dataSubjects = onlySubjects.map(x => {
    let subjectsRow = x.slice();
    subjectsRow[26] = window.teachersName[subjectsRow[26]] || '';
    subjectsRow[27] = window.teachersName[subjectsRow[27]] || '';
    subjectsRow[28] = window.teachersName[subjectsRow[28]] || '';
    return subjectsRow
  });
  if (table) {
    table.clear();
    table.rows.add(dataSubjects);
    table.draw();
  } else {
    initTable(dataSubjects)
  }
}

async function saveData() {
  let id = dataBaseSubjects[rowIndex]._id;
  let copyRow = currentRow.slice();
  copyRow[26] = currentData.lecture && currentData.lecture.teacher || '';
  copyRow[27] = currentData.laboratory && currentData.laboratory.teacher || '';
  copyRow[28] = currentData.practise && currentData.practise.teacher || '';
  await api.saveSubjects({ subject: copyRow, id, save: true });
  let data = await updateTableSubjects();
  await updateTable(data);
  $('#modalSelectTeacher').modal('hide');
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
  setTeacher(currentData, e.target.value, currentRow)
})

saveNewProgramBtn.addEventListener('click', () => {
  checkNewProgram(saveFile)
});

programs.addEventListener('click', async (event) => {
  let data = await selectProgram(event);
  if (data) {
    await updateTable(data)
  }
});

export async function initProgramsTab() {
  selectTeacher.innerHTML = window.teachers.map(x => `<option value="${x._id}">${x.name} (${x.currentHours || 0}/${x.maxHours})</option>`);
  await showPrograms();
  programsTab.classList.add('active');
  programsPage.classList.remove('hide');
}

export function hideProgramsTab() {
  programsTab.classList.remove('active');
  programsPage.classList.add('hide');
}