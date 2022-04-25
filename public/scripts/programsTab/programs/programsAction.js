import { checkNewProgram } from './validation.js';
import { api } from '../../api/serverFunctions.js';
import { showPrograms } from './programs.js';
import { openConfirm } from '../../modal/confirm.js';

let dataProgram = null;

export function openEditProgram(data) {
  programNameInput.value = data.name;
  saveNewProgramOptions.classList.add('hide');
  saveProgramBtn.classList.remove('hide');
  saveNewProgram.classList.remove('hide');
  programs.classList.add('hide');
  teacherSubjects.classList.add('hide')
  dataProgram = data;
  programNameInputError.innerText = '';
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
    programNameInput.value = '';
    saveNewProgram.classList.add('hide');
  }
  checkNewProgram(saveFile, dataProgram.name)
}

export async function deleteProgram(id) {
  const action = async (id) => {
    await api.deleteProgram(id);
    await showPrograms();
  }
  openConfirm(action, id, 'Вы уверены что хотите удалить программу? Это действие нельзя отменить.')
}