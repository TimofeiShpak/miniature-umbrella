let valueType, valueTeacher, dataTable, valueTeacherName;

export function setTeacher(type, teacher, table, teacherName) {
  valueType = type;
  valueTeacher = teacher;
  dataTable = table;
  valueTeacherName = teacherName;
  modalTitle.innerText = `${type.title}`
  modalTeacher.classList.remove('hide');
  if (type.lecture) {
    lectureOption.hidden = false;
    if (type.lecture.teacher) {
      lecture.checked = true;
    } else {
      lecture.checked = false;
    }
    if (type.lecture.teacher && type.lecture.teacher !== teacher) {
      lecture.disabled = true;
    } else {
      lecture.disabled = false;
    }
  } else {
    lectureOption.hidden = true;
  }
  if (type.laboratory) {
    laboratoryOption.hidden = false
    if (type.laboratory.teacher) {
      laboratory.checked = true;
    } else {
      laboratory.checked = false;
    }
    if (type.laboratory.teacher && type.laboratory.teacher !== teacher) {
      laboratory.disabled = true;
    } else {
      laboratory.disabled = false;
    }
  } else {
    laboratoryOption.hidden = true
  }
  if (type.practise) {
    practiseOption.hidden = false
    if (type.practise.teacher) {
      practise.checked = true;
    } else {
      practise.checked = false;
    }
    if (type.practise.teacher && type.practise.teacher !== teacher) {
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
    valueType.lecture.teacher = valueTeacher
    valueType.lecture.time = dataTable[10]
    dataTable[26] = valueTeacherName
  } else {
    valueType.lecture.time = ''
    valueType.lecture.teacher = ''
    dataTable[26] = ''
  }
})

laboratory.addEventListener('change', (e) => {
  if (e.target.checked) {
    valueType.laboratory.teacher = valueTeacher
    valueType.laboratory.time = dataTable[11]
    dataTable[27] = valueTeacherName
  } else {
    valueType.laboratory.teacher = ''
    valueType.laboratory.time = ''
    dataTable[27] = ''
  }
})

practise.addEventListener('change', (e) => {
  if (e.target.checked) {
    valueType.practise.teacher = valueTeacher
    valueType.practise.time = dataTable[12]
    dataTable[28] = valueTeacherName
  } else {
    valueType.practise.teacher = ''
    valueType.practise.time = ''
    dataTable[28] = ''
  }
})