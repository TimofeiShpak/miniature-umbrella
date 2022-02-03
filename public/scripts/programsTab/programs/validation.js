import { getProgramNames } from './programs.js'

export function checkNewProgram(saveFile, programName) {
  let selectedNameProgram = programNameInput.value;
  let programNames = getProgramNames();
  let selectedFile = fileUploader.files[0] || programName;
  let isAccessName = (!programNames.includes(selectedNameProgram) || selectedNameProgram === programName)
  if (selectedNameProgram && selectedFile && isAccessName) {
    saveFile()
  } 
  if (!selectedFile) {
    fileUploaderError.classList.remove('hide')
  } else {
    fileUploaderError.classList.add('hide')
  }
  if (!selectedNameProgram) {
    programNameInputError.innerText = 'название программы обязательно'
  } else if (!isAccessName) {
    programNameInputError.innerText = 'программа с таким названием уже существует'
  } else {
    programNameInputError.innerText = ''
  }
}