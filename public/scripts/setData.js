import { titles, typeNames, teachers } from '../constants/constants.js'

export function setData(value) {
  let allValues = value.map(x => Object.values(x))
  let startIndex = allValues.findIndex(x => {
    return Array.isArray(x) && x.find(value => typeof value === 'string' && value.includes('Блок 1 Дисциплины (модули)'))
  });
  let endIndex = allValues.findIndex(x => {
    return Array.isArray(x) && x.find(value => typeof value === 'string' && value.includes('Всего отчетностей'))
  });

  let subjectsValue = value.slice(startIndex, endIndex).map(x => {
    let indexes = Object.keys(x);
    let arr = [];
    for (let i = 0; i < indexes.length; i++) {
        let index = +(indexes[i].replace('__EMPTY_', ''));
        if (index) {
          arr[index] = `${x[indexes[i]]}`.replace(/^\//, '');
        }  else {
          arr[0] = `${x[indexes[i]]}`.replace(/^\//, '');
        }
    }
    return arr
  })
  
  let types = {};
  let preparedValue = subjectsValue.filter((x,i) => {
    if (!types[x[1]]) {
      types[x[1]] = x[1];
      if (i !== subjectsValue.length - 1 && subjectsValue[i+1][1] === x[1]) {
        return false;
      }
    }
    return (x[2] || x[3] || x[4] || x[5] || x[6] || x[7])
  })
  let data = fillEmptyCell(preparedValue);
  return data;
}

export function getTypes(preparedValue) {
  let typesValue = [];
  preparedValue.forEach((x, i) => {
    let indexType = x.slice(2, 5).findIndex(y => !!y);
    let type = `${x[1].trim()}-${typeNames[indexType]}`;
    let workModes = x.slice(10, 13);
    typesValue[i] = {};
    if (parseInt(workModes[0])) {
      typesValue[i].lecture = {};
      let teacher = x.slice(-3,-2)[0];
      if (teacher) {
        typesValue[i].lecture.teacher = teacher;
        typesValue[i].lecture.time = parseInt(workModes[0]);
      }
    }
    if (parseInt(workModes[1])) {
      typesValue[i].laboratory = {};
      let teacher = x.slice(-2,-1)[0]
      if (teacher) {
        typesValue[i].laboratory.teacher = teacher;
        typesValue[i].laboratory.time = parseInt(workModes[1]);
      }
    }
    if (parseInt(workModes[2])) {
      typesValue[i].practise = {}
      let teacher = x.slice(-1)[0]
      if (teacher) {
        typesValue[i].practise.teacher = teacher;
        typesValue[i].practise.time = parseInt(workModes[2]);
      }
    }
    typesValue[i].title = type;
  })
  return typesValue;
}

function fillEmptyCell(data) {
  for(let i = 0; i < data.length; i++) {
    for (let j = 0; j < titles.length; j++) { 
      if (!data[i][j]) {
        data[i][j] = '';
      }
    }
  }
  return data;
}