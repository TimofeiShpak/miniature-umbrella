import { api } from "../api/serverFunctions.js";
import { hideTeacherModal } from "./teachersEdition.js";
import { initTeachersTable } from "./teachersTable.js";
import { validateTeacher } from "./validateTeacher.js";

deleteTeacherBtn.addEventListener('click', deleteTeacher);

saveNewTeacherBtn.addEventListener('click', async () => {
  const isValid = validateTeacher();
  if (isValid) {
    let type = addTacherModal.dataset.type;
    let dto = {};
    if (type === 'add') {
      dto = { 
        name : inputNameTeacher.value || null, 
        maxHours: +inputMaxHoursTeacher.value || null,  
        id: inputNameTeacher.dataset.id || null,
        login: inputLoginTeacher.value || null,
        password: inputPasswordTeacher.value || null,
      }
    } else if (type === 'edit') {
      dto = { 
        name : inputNameTeacher.value || null, 
        maxHours: +inputMaxHoursTeacher.value || null,  
        id: inputNameTeacher.dataset.id || null,
      }
    } else if (type === 'changeProfile') {
      dto = { 
        login: inputLoginTeacher.value || null,
        password: inputPasswordTeacher.value || null,  
        id: inputNameTeacher.dataset.id || null,
      }
    }
    await api.saveTeacher(dto);
    hideTeacherModal();
    let [tableData, data] = await getDataTeachers();
    initTeachersTable(tableData, data);
  }
})

export async function getDataTeachers() {
  let teachers = await api.getTeachers({isAdmin: window.isAdmin});
  let teachersName = {};
  let tableData = teachers.map((x,i) => {
    let name = x.name || '';
    let maxHours = x.maxHours || 0;
    let currentHours = x.currentHours || 0;
    teachersName[teachers[i]._id] = teachers[i].name;
    return [name, currentHours, maxHours]
  });
  window.teachers = teachers;
  window.teachersName = teachersName;
  return [tableData, teachers];
}

export async function initTeachersTab() {
  teachersTab.classList.add('active');
  teachersPage.classList.remove('hide');
  let [tableData, data] = await getDataTeachers();
  initTeachersTable(tableData, data);
}

export function hideTeachersTab() {
  teachersTab.classList.remove('active');
  teachersPage.classList.add('hide');
}

async function deleteTeacher() {
  await api.deleteTeacher({id: inputNameTeacher.dataset.id});
  hideTeacherModal();
  let [tableData, data] = await getDataTeachers();
  initTeachersTable(tableData, data);
}