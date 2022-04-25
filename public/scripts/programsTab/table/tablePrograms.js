import { setData, getType } from './setData.js';
import { setTeacher } from '../forTeacher/setTeacher.js';
import { dataTableOptions } from '../../constants/constants.js'
import { getProgramsData, showPrograms } from '../programs/programs.js';
import { api } from '../../api/serverFunctions.js';
import { checkNewProgram } from '../programs/validation.js';
import { drawElements } from './drawElements.js';
import { selectProgram, updateTableSubjects } from './selectProgram.js';
import { openConfirm } from '../../modal/confirm.js';
import { getTeachers, getTeachersName, setTeacherHours } from '../../teachersTab/initTeacher.js';
import { drawTeacherSubjects, selectTeacherSubject, updateTableSubjectsTeacher } from '../programs/teacherSubjects.js';

let table;
let rowIndex = 0;
let currentData = null;
let currentRow = null;
let dataSubjects = null;
let dataBaseSubjects = null;
let onlySubjects = null;
let teacherHours = [];

drawElements();

function initTable() {
  $(document).ready(function() {
    dataTableOptions.data = dataSubjects
    table = $('#example').DataTable(dataTableOptions);

    // выбор ячейки и строки
    $('#example tbody').on( 'click', 'td', function () {
      if (window.user.isAdmin) {
        let cell = table.cell( this );
        // let cellData = cell.data();
        rowIndex = cell[0][0].row;
        // let cellIndex = cell[0][0].column;
        currentRow = dataSubjects[rowIndex].slice();
        currentData = getType(onlySubjects[rowIndex].slice());
        let teachers = getTeachers();
        selectTeacher.innerHTML = teachers.map((x,i) => `<option value="${i}">${x.name} (${x.currentHours || 0}/${x.maxHours})</option>`);
        teacherHours = teachers.map(x => {
          return {
            currentHours: x.currentHours,
            maxHours: x.maxHours
          }
        });
        $('#modalSelectTeacher').modal('show');
        selectTeacherForm.classList.remove('hide')
        window.subjectModal = 'edit'
        if (window.type === 'program') {
          modalTitle.innerText = 'Редактирование'
          deleteRowModal.classList.remove('hide')
        } else if (window.type === 'teacher') {
          let program = (getProgramsData() || []).find(x => x.programId === dataBaseSubjects[rowIndex].programId)
          modalTitle.innerText = `Редактирование (программа - ${program.name})`
          deleteRowModal.classList.add('hide')
        }
        setTeacher(currentData, 0, currentRow, teacherHours, teachers)
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

    let elem = document.querySelector('.dataTables_scrollBody')
    if (elem) { 
      let height = document.documentElement.clientHeight - elem.getBoundingClientRect().top - 10 +'px'
      elem.style.maxHeight = height
      if (window.type === 'teacher' && elem.children && elem.children[0] && elem.children[0].children && elem.children[0].children[1] 
        && elem.children[0].children[1].children) {
        
        [...elem.children[0].children[1].children].forEach(x => {
          x.dataset.id = '1'
          x.classList.add('table-row')
        })

      }
    }
  });
}

function updateTable(data) {
  let teachersName = getTeachersName();
  dataBaseSubjects = [...data];
  onlySubjects = data.map(x => x.subject);
  dataSubjects = onlySubjects.map(x => {
    let subjectsRow = x.slice();
    subjectsRow[26] = teachersName[subjectsRow[26]] || '';
    subjectsRow[27] = teachersName[subjectsRow[27]] || '';
    subjectsRow[28] = teachersName[subjectsRow[28]] || '';
    return subjectsRow
  });
  if (table) {
    table.clear();
    table.rows.add(dataSubjects);
    table.draw();
    let elem = document.querySelector('.dataTables_scrollBody')
    if (elem) { 
      let height = document.documentElement.clientHeight - elem.getBoundingClientRect().top - 10 +'px'
      elem.style.maxHeight = height
      if (window.type === 'teacher' && elem.children && elem.children[0] && elem.children[0].children && elem.children[0].children[1] 
        && elem.children[0].children[1].children) {
        
        [...elem.children[0].children[1].children].forEach(x => {
          x.dataset.id = '1'
          x.classList.add('table-row')
        })

      }
    }
  } else {
    initTable()
  }
}

async function saveData() {
  if (window.subjectModal === 'edit') {
    const action = async () => {
      let id = dataBaseSubjects[rowIndex]._id;
      let copyRow = currentRow.slice();
      copyRow[26] = currentData.lecture && currentData.lecture.teacher || '';
      copyRow[27] = currentData.laboratory && currentData.laboratory.teacher || '';
      copyRow[28] = currentData.practise && currentData.practise.teacher || '';
      let generalFieldLngth = copyRow.length - 3;
      for (let i = 0; i < generalFieldLngth; i++) {
        copyRow[i] = selectTeacherFields.children[i].children[1].value
      }
      setTeacherHours(teacherHours);
      await api.saveSubjects({ subject: copyRow, id, save: true });
      let data = []
      if (window.type === 'program') {
        data = await updateTableSubjects();
      } else if (window.type === 'teacher') {
        data = await updateTableSubjectsTeacher();
      }
      updateTable(data);
      $('#modalSelectTeacher').modal('hide');
    }
    openConfirm(action, null, 'Вы уверены что хотите выполнить назначение? Это действие нельзя отменить.')
  } else if (window.subjectModal === 'add') {
    const action = async () => {
      let programId = nameProgram.dataset.programId
      let copyRow = [];
      for (let i = 0; i < selectTeacherFields.children.length; i++) {
        copyRow[i] = selectTeacherFields.children[i].children[1].value
      }
      await api.saveSubjects({ subject: copyRow, add: true, programId: programId });
      let data = []
      if (window.type === 'program') {
        data = await updateTableSubjects();
      } else if (window.type === 'teacher') {
        data = await updateTableSubjectsTeacher();
      }
      updateTable(data);
      $('#modalSelectTeacher').modal('hide');
    }
    openConfirm(action, null, 'Вы уверены что хотите выполнить назначение? Это действие нельзя отменить.')
  }
}

async function saveFile() {
  if (fileUploader.files && fileUploader.files[0]) {
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
        let newDataBaseSubjects = dataSubjects.slice(0, 10).map(x => {
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
  } else {
    let programId = 'id' + (new Date()).getTime();
    let name = programNameInput.value;
    await api.saveNewProgram({programId, name})
    programNameInput.value = '';
    await showPrograms();
    saveNewProgram.classList.add('hide')
    saveNewProgramOptions.classList.add('hide')
  }
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
    updateTable(data)
  }
});

teacherSubjects.addEventListener('click', async (event) => {
  let data = await selectTeacherSubject(event);
  if (data) {
    updateTable(data)
  }
});

export async function initProgramsTab() {
  await showPrograms();
  programsTab.classList.add('active');
  programsPage.classList.remove('hide');
  drawTeacherSubjects();
}

export function hideProgramsTab() {
  programsTab.classList.remove('active');
  programsPage.classList.add('hide');
}

addRow.addEventListener('click', () => {
  $('#modalSelectTeacher').modal('show');
  selectTeacherForm.classList.add('hide')
  deleteRowModal.classList.add('hide')
  modalTitle.innerText = 'Добавить строку'
  for (let i = 0; i < selectTeacherFields.children.length; i++) {
    selectTeacherFields.children[i].children[1].value = ''
    selectTeacherFields.children[i].children[2].innerText = ''
  }
  window.subjectModal = 'add'
})

deleteRowModal.addEventListener('click', async () => {
  let id = dataBaseSubjects[rowIndex]._id;
  await api.deleteRow({id})
  $('#modalSelectTeacher').modal('hide');
  let data = []
  if (window.type === 'program') {
    data = await updateTableSubjects();
  } else if (window.type === 'teacher') {
    data = await updateTableSubjectsTeacher();
  }
  updateTable(data);
})