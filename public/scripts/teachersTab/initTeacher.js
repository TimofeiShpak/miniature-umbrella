import { api } from "../api/serverFunctions.js";
import { openConfirm } from "../modal/confirm.js";
import { hideTeacherModal } from "./teachersEdition.js";
import { initTeachersTable } from "./teachersTable.js";
import { validateTeacher } from "./validateTeacher.js";

let teachers = [];
let teachersName = {};

deleteTeacherBtn.addEventListener('click', deleteTeacher);

saveNewTeacherBtn.addEventListener('click', async () => {
  const isValid = validateTeacher();
  if (isValid) {
    const action = async () => {
      let type = addTeacherModal.dataset.type;
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
    openConfirm(action, null, 'Вы уверены что хотите сохранить? Это действие нельзя отменить.')
  }
})

export async function getDataTeachers() {
  teachers = await api.getTeachers({isAdmin: window.user.isAdmin});
  teachersName = {};
  let tableData = teachers.map((x,i) => {
    let name = x.name || '';
    let maxHours = x.maxHours || 0;
    let currentHours = x.currentHours || 0;
    teachersName[teachers[i]._id] = teachers[i].name;
    if (x._id === window.user._id) {
      userInfo.innerText = name;
      name = name + ' (вы)';
    }
    return [name, currentHours, maxHours]
  });
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
  const action = async () => {
    await api.deleteTeacher({id: inputNameTeacher.dataset.id});
    hideTeacherModal();
    let [tableData, data] = await getDataTeachers();
    initTeachersTable(tableData, data);
  }
  openConfirm(action, null, 'Вы уверены что хотите удалить преподавателя? Это действие нельзя отменить.')
}

export function getTeachers() {
  return teachers;
}

export function getTeachersName() {
  return teachersName;
}

export function setTeacherHours(hours) {
  for (let i = 0; i < teachers.length; i++) {
    teachers[i].currentHours = hours[i].currentHours
  }
}