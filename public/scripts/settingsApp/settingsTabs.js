import { initProgramsTab, hideProgramsTab } from '../programsTab/table/tablePrograms.js';
import { initTeachersTab, hideTeachersTab, getDataTeachers } from '../teachersTab/initTeacher.js'

let activeTab = 'programsTab';

export async function initTabs() {
  tabs.addEventListener('click', async (event) => {
    let tab = event.target.closest('.tab');
    if (tab && tab.id && (tab.id !== activeTab)) {
      activeTab = tab.id;
      if (activeTab === 'teachersTab') {
        hideProgramsTab()
        await initTeachersTab()
      } else if (activeTab === 'programsTab') {
        hideTeachersTab()
        await initProgramsTab()
      }
    }
  })
  await getDataTeachers();
  hideTeachersTab();
  activeTab = 'programsTab';
  await initProgramsTab();
}