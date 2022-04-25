import { api } from "../../api/serverFunctions.js";
import { getTeachers } from "../../teachersTab/initTeacher.js";

export function drawTeacherSubjects() {
  let data = getTeachers();
  teacherSubjectsContainer.innerHTML = '';
  if (data && data.length) {
    let teacherSubjectsNames = data.map(x => x.name)
    for (let i = 0; i < data.length; i++) {
      let item = document.createElement('div');
      item.classList.add('interactive')
      item.innerText = `${i+1}.${teacherSubjectsNames[i]}`
      item.dataset.id = data[i]._id
      teacherSubjectsContainer.append(item)
    }
    notTeacherSubjects.classList.add('hide')
  } else {
    notTeacherSubjects.classList.remove('hide')
  }
  teacherSubjects.classList.remove('hide')
}


let id = null;

export async function selectTeacherSubject(event) {
  let element = event.target.closest('.interactive'); 
  if (element && element.dataset && element.dataset.id) {
    id = element.dataset.id;
    let dataBaseSubjects = await api.getSubjectsByTeacher({id: id});
    const teacher = await api.getTeacherById({ id: id });
    if (teacher && teacher[0]) {
      nameProgram.innerText = `Выбранный преподаватель: ${teacher[0].name} `
    }
    tableWrapper.classList.remove('hide');
    programs.classList.add('hide')
    teacherSubjects.classList.add('hide')
    addRow.classList.add('hide')
    window.type = 'teacher'
    if (document.querySelector('.dataTables_scrollBody')) {
      document.querySelector('.dataTables_scrollBody').scrollLeft = 0
      document.querySelector('.dataTables_scrollBody').scrollTop = 0
    }
    return dataBaseSubjects;
  }
}

export async function updateTableSubjectsTeacher() {
  let data = []
  if (id) {
    data = await api.getSubjectsByTeacher({id: id});
  }
  return data;
}