let type, teacherId, dataTable, index, teachers, teachersHours;

export function setTeacher(oldType, teacherIndex, data, hours, teachersData) {
  if (hours) {
    teachersHours = hours;
  }
  if (teachersData) {
    teachers = teachersData;
  }  
  index = teacherIndex;
  teacherId = teachers[index]._id;
  dataTable = data;
  type = oldType;
  checkType();

  [...selectTeacherFields.children].map((field,i) => {
    field.children[1].value = data[i].trim()
    field.children[2].innerText = data[i].trim()
  })
}

function checkType() {
  let teacherData = teachersHours[index]; 
  let freeHours = teacherData.maxHours - teacherData.currentHours;
  if (type.lecture) {
    lectureOption.hidden = false;
    lectureOption.children[1].innerText = `лекции ${dataTable[10]} ч`
    if (type.lecture.teacher) {
      lecture.checked = true;
    } else {
      lecture.checked = false;
    }
    if ((type.lecture.teacher && type.lecture.teacher !== teacherId) || ((freeHours < +dataTable[10]) && !lecture.checked)) {
      lecture.disabled = true;
    } else {
      lecture.disabled = false;
    }
  } else {
    lectureOption.hidden = true;
  }
  if (type.laboratory) {
    laboratoryOption.hidden = false
    laboratoryOption.children[1].innerText = `лабораторные ${dataTable[11]} ч`
    if (type.laboratory.teacher) {
      laboratory.checked = true;
    } else {
      laboratory.checked = false;
    }
    if ((type.laboratory.teacher && type.laboratory.teacher !== teacherId) || ((freeHours < +dataTable[11]) && !laboratory.checked)) {
      laboratory.disabled = true;
    } else {
      laboratory.disabled = false;
    }
  } else {
    laboratoryOption.hidden = true
  }
  if (type.practise) {
    practiseOption.hidden = false
    practiseOption.children[1].innerText = `практические ${dataTable[12]} ч`
    if (type.practise.teacher) {
      practise.checked = true;
    } else {
      practise.checked = false;
    }
    if ((type.practise.teacher && type.practise.teacher !== teacherId) || ((freeHours < +dataTable[12]) && !practise.checked)) {
      practise.disabled = true;
    } else {
      practise.disabled = false;
    }
  } else {
    practiseOption.hidden = true
  }
}

lecture.addEventListener('change', (e) => {
  if (e.target.checked) {
    type.lecture.teacher = teacherId
    type.lecture.time = dataTable[10]
    teachersHours[index].currentHours += +dataTable[10]
  } else {
    type.lecture.time = ''
    type.lecture.teacher = ''
    teachersHours[index].currentHours -= +dataTable[10]
  }
  checkType();
  selectTeacher.innerHTML = teachersHours.map((x,i) => `<option value="${i}">${teachers[i].name} (${x.currentHours || 0}/${x.maxHours})</option>`);
  selectTeacher.value = index;
})

laboratory.addEventListener('change', (e) => {
  if (e.target.checked) {
    type.laboratory.teacher = teacherId
    type.laboratory.time = dataTable[11]
    teachersHours[index].currentHours += +dataTable[11]
  } else {
    type.laboratory.teacher = ''
    type.laboratory.time = ''
    teachersHours[index].currentHours -= +dataTable[11]
  }
  checkType();
  selectTeacher.innerHTML = teachersHours.map((x,i) => `<option value="${i}">${teachers[i].name} (${x.currentHours || 0}/${x.maxHours})</option>`);
  selectTeacher.value = index;
})

practise.addEventListener('change', (e) => {
  if (e.target.checked) {
    type.practise.teacher = teacherId
    type.practise.time = dataTable[12]
    teachersHours[index].currentHours += +dataTable[12]
  } else {
    type.practise.teacher = ''
    type.practise.time = ''
    teachersHours[index].currentHours -= +dataTable[12]
  }
  checkType();
  selectTeacher.innerHTML = teachersHours.map((x,i) => `<option value="${i}">${teachers[i].name} (${x.currentHours || 0}/${x.maxHours})</option>`);
  selectTeacher.value = index;
})