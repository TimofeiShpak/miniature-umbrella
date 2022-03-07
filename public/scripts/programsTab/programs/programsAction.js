import { checkNewProgram } from './validation.js';
import { api } from '../../api/serverFunctions.js';
import { showPrograms } from './programs.js';

let dataProgram = null;

export function openEditProgram(data) {
  programNameInput.value = data.name;
  saveNewProgramOptions.classList.add('hide');
  saveProgramOptions.classList.remove('hide');
  saveNewProgram.classList.remove('hide');
  programs.classList.add('hide');
  dataProgram = data;
}

export function saveEditionProgram() {
  let saveFile = async () => {
    let dto = {
      id: dataProgram._id,
      name: programNameInput.value,
      edit: true,
    }
    await api.saveSubjects(dto)
    await showPrograms();
    saveProgramOptions.classList.add('hide');
    saveNewProgram.classList.add('hide');
  }
  checkNewProgram(saveFile, dataProgram.name)
}

export async function deleteProgram(id) {
  await api.deleteProgram(id);
  await showPrograms();
}