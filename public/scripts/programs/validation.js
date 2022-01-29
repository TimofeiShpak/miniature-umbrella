import { getProgramNames } from './programs.js'

export function checkNewProgram(saveFile, isEdit) {
  let selectedNameProgram = programNameInput.value;
  let programNames = getProgramNames();
  let selectedFile = fileUploader.files[0] || isEdit;
  if (selectedNameProgram && selectedFile && !programNames.includes(selectedNameProgram)) {
    saveFile()
  } 
  if (!selectedFile) {
    fileUploaderError.classList.remove('hide')
  } else {
    fileUploaderError.classList.add('hide')
  }
  if (!selectedNameProgram) {
    programNameInputError.innerText = 'название программы обязательно'
  } else if (programNames.includes(selectedNameProgram)) {
    programNameInputError.innerText = 'программа с таким названием уже существует'
  } else {
    programNameInputError.innerText = ''
  }
}