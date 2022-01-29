export function changeTable(teacher, table, dataSubjects, modalData) {
  let newData = null;
  if (teacher !== 'all') {
    newData = dataSubjects.filter((x,i) => {
      return x.slice(-3).filter(y => y === teacher).length
    });
    let hours = 0;
    modalData.map(x => {
      if (x.lecture && x.lecture.teacher === teacher) {
        hours += parseInt(x.lecture.time) || 0
      }
      if (x.laboratory && x.laboratory.teacher === teacher) {
        hours += parseInt(x.laboratory.time) || 0
      }
      if (x.practise && x.practise.teacher === teacher) {
        hours += parseInt(x.practise.time) || 0
      }
    })
    teacherHours.innerText = `Все количество часов ${hours}`
    let otherData = dataSubjects.filter((x,i) => {
      return !x.slice(-3).filter(y => y == teacher).length
    }); 
    newData = newData.concat(otherData)
  } else {
    newData = dataSubjects.slice(0)
    teacherHours.innerText = ''
  }
  table.clear();
  table.rows.add(newData);
  table.draw();
}