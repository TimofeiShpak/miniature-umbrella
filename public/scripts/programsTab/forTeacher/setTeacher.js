let type, valueTeacher, dataTable;

export function setTeacher(oldType, teacher, data) {
  valueTeacher = teacher;
  dataTable = data;
  modalTitle.innerText = `${oldType.title}`;
  type = oldType;
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
    type.lecture.teacher = valueTeacher
    type.lecture.time = dataTable[10]
  } else {
    type.lecture.time = ''
    type.lecture.teacher = ''
  }
})

laboratory.addEventListener('change', (e) => {
  if (e.target.checked) {
    type.laboratory.teacher = valueTeacher
    type.laboratory.time = dataTable[11]
  } else {
    type.laboratory.teacher = ''
    type.laboratory.time = ''
  }
})

practise.addEventListener('change', (e) => {
  if (e.target.checked) {
    type.practise.teacher = valueTeacher
    type.practise.time = dataTable[12]
  } else {
    type.practise.teacher = ''
    type.practise.time = ''
  }
})