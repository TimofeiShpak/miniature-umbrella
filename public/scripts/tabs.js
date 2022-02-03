import { initProgramsTab, hideProgramsTab } from './programsTab/table/tablePrograms.js';
import { initTeachersTab, hideTeachersTab } from './teachersTab/initTeacher.js'

export function initTabs() {
  tabs.addEventListener('click', (event) => {
    let tab = event.target.closest('.tab');
    if (tab) {
 
      if (tab.id === 'teachersTab') {
        initTeachersTab()
        hideProgramsTab()
      } else if (tab.id === 'programsTab') {
        initProgramsTab()
        hideTeachersTab()
      }
    }
  })

  initProgramsTab();
}