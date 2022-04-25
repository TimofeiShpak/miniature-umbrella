import { api } from "../../api/serverFunctions.js";

let id = null;

export async function selectProgram(event) {
  let element = event.target.closest('.interactive'); 
  if (element && element.dataset && element.dataset.id) {
    id = element.dataset.id;
    let dataBaseSubjects = await api.getSubjectsByProgram(id);
    if (dataBaseSubjects.length) {
      const programValue = await api.getProgramById({ programId: dataBaseSubjects[0].programId });
      if (programValue && programValue[0]) {
        nameProgram.innerText = `Название программы: ${programValue[0].name}`
        nameProgram.dataset.programId = programValue[0].programId
      }
    }
    tableWrapper.classList.remove('hide');
    programs.classList.add('hide')
    teacherSubjects.classList.add('hide')
    addRow.classList.remove('hide')
    window.type = 'program'
    if (document.querySelector('.dataTables_scrollBody')) {
      document.querySelector('.dataTables_scrollBody').scrollLeft = 0
      document.querySelector('.dataTables_scrollBody').scrollTop = 0
    }
    return dataBaseSubjects;
  }
}

export async function updateTableSubjects() {
  let data = []
  if (id) {
    data = await api.getSubjectsByProgram(id);
  }
  return data;
}
