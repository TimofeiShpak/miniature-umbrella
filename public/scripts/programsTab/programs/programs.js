import { api } from '../../api/serverFunctions.js';
import { openEditProgram, saveEditionProgram, deleteProgram } from './programsAction.js';
let programNames = [];

andNewProgram.addEventListener('click', () => {
  saveNewProgram.classList.remove('hide')
  saveNewProgramOptions.classList.remove('hide')
  notProgram.classList.add('hide')
  programs.classList.add('hide')
})

cancelAddProgramBtn.addEventListener('click', () => {
  saveNewProgram.classList.add('hide')
  saveNewProgramOptions.classList.add('hide')
  programs.classList.remove('hide')
})

saveProgramBtn.addEventListener('click', () => saveEditionProgram())

export function getProgramNames() {
  return programNames
}

export async function showPrograms() {
  tableWrapper.classList.add('hide');
  saveNewProgram.classList.add('hide');
  programs.classList.remove('hide')
  let programsData = await api.getPrograms();
  if (programsData) {
    programs.classList.remove('hide');
    if (programsData.length === 0) {
      notProgram.classList.remove('hide');
      programsContainer.innerHTML = '';
      programNames = [];
    } else if (programsData.length) {
      notProgram.classList.add('hide');
      drawPrograms(programsData);
    }
  }
}

function drawPrograms(programsData) {
  programsContainer.innerHTML = '';
  programNames = programsData.map(x => x.name)
  for (let i = 0; i < programsData.length; i++) {
    let item = document.createElement('div');
    item.classList.add('interactive')
    item.innerText = `${i+1}.${programNames[i]}`
    item.dataset.id = programsData[i].programId
    programsContainer.append(item)
    if (window.isAdmin) {
      let button = document.createElement('div');
      button.innerHTML = `    
      <div class="dropdown">
        <div class="dropdown-toggle programs-dropdown" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"></div>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li><a class="dropdown-item" href="#" id="editProgramBtn-${programNames[i]}">Редактировать</a></li>
            <li><a class="dropdown-item" href="#" id="deleteProgramBtn-${programNames[i]}">Удалить</a></li>
        </ul>
      </div>`
      button.onclick = (event) => {
        event.stopPropagation();
        event.preventDefault()
      }
      item.append(button)
      let editBtn = document.querySelector(`#editProgramBtn-${programNames[i]}`)
      editBtn.onclick = () => openEditProgram(programsData[i])
      let deleteBtn = document.querySelector(`#deleteProgramBtn-${programNames[i]}`)
      deleteBtn.onclick = () => deleteProgram({id: programsData[i]._id, programId: programsData[i].programId })
    }
  }
}

chooseProgram.addEventListener('click', () => showPrograms())