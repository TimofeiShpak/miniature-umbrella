import { api } from "../api/serverFunctions.js";

let id = null;

export async function selectProgram(event) {
  let element = event.target.closest('.interactive'); 
  if (element && element.dataset && element.dataset.id) {
    id = element.dataset.id;
    let dataBaseSubjects = await api.getSubjectsByProgram(id);
    if (dataBaseSubjects.length) {
      const programValue = await api.getProgramById({ programId: dataBaseSubjects[0].programId });
      if (programValue && programValue[0]) {
        nameProgram.innerText = `Название программы: ${programValue[0].name} `
      }
    }
    tableWrapper.classList.remove('hide');
    programs.classList.add('hide')
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
