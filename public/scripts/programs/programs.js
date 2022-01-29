import { api } from '../api/serverFunctions.js';
import { openEditProgram, saveEditionProgram, deleteProgram } from './programsAction.js';

let programNames = [];

export function initPrograms() {
  andNewProgram.addEventListener('click', () => {
    saveNewProgram.classList.remove('hide')
    saveNewProgramOptions.classList.remove('hide')
    notProgram.classList.add('hide')
    programs.classList.add('hide')
  })
  saveProgramBtn.addEventListener('click', () => saveEditionProgram())
  showPrograms();
}

export function getProgramNames() {
  return programNames
}

export async function showPrograms() {
  tableWrapper.hidden = true;
  programs.classList.remove('hide')
  let programsData = await api.getProgramsWithoutSubjects();
  if (programsData) {
    programs.classList.remove('hide');
    if (programsData.length === 0) {
      notProgram.classList.remove('hide');
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
    item.classList.add('interactive')
    item.innerText = `${i+1}.${programNames[i]}`
    item.dataset.name = programNames[i]
    item.append(button)
    programsContainer.append(item)
    let editBtn = document.querySelector(`#editProgramBtn-${programNames[i]}`)
    editBtn.onclick = () => openEditProgram(programsData[i])
    let deleteBtn = document.querySelector(`#deleteProgramBtn-${programNames[i]}`)
    deleteBtn.onclick = () => deleteProgram(programsData[i]._id)
  }
}