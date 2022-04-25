import { openConfirm } from '../../modal/confirm.js';
import { getProgramNames } from './programs.js'

export function checkNewProgram(saveFile, programName) {
  let selectedNameProgram = programNameInput.value;
  let programNames = getProgramNames();
  let isAccessName = (!programNames.includes(selectedNameProgram))
  if (selectedNameProgram && isAccessName) {
    const action = () => {
      saveFile();
    }
    openConfirm(action, null, 'Вы уверены что хотите сохранить? Это действие нельзя отменить.')
  } 
  if (!selectedNameProgram) {
    programNameInputError.innerText = 'название программы обязательно'
  } else if (!isAccessName && (selectedNameProgram !== programName)) {
    programNameInputError.innerText = 'программа с таким названием уже существует'
  } else if (selectedNameProgram === programName) {
    programNameInputError.innerText = 'название не изменилось'
  } else {
    programNameInputError.innerText = ''
  }
}