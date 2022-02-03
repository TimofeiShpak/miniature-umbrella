import { api } from "../programsTab/api/serverFunctions.js";
import { saveNewTeacher } from "./teachersEdition.js";
import { initTeachersTable, updateTable } from "./teachersTable.js";

saveNewTeacherBtn.addEventListener('click', async () => {
  await saveNewTeacher()
  let tableData = await getDataTeachers()
  updateTable(tableData)
})

async function getDataTeachers() {
  let data = await api.getTeachers();
  let tableData = data.map(x => {
    let name = x.name || '';
    let currentHours = x.currentHours || 0;
    let maxHours = x.maxHours || 0;
    return [name, currentHours, maxHours]
  })
  return tableData;
}

export async function initTeachersTab() {
  teachersTab.classList.add('active');
  teachersPage.classList.remove('hide');
  let tableData = await getDataTeachers()
  initTeachersTable(tableData)
}

export function hideTeachersTab() {
  teachersTab.classList.remove('active');
  teachersPage.classList.add('hide');
}