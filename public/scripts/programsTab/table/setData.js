import { titles, typeNames } from '../../constants/constants.js'

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

export function getType(data) {
  let indexType = data.slice(2, 5).findIndex(y => !!y);
  let type = {}
  type.title = `${data[1].trim()}-${typeNames[indexType]}`;
  if (data[10]) {
    type.lecture = {};
    let teacher = data[26];
    if (teacher) {
      type.lecture.teacher = data[26] || '';
      type.lecture.time = data[12];
    }
  }
  if (data[11]) {
    type.laboratory = {};
    let teacher = data[27]
    if (teacher) {
      type.laboratory.teacher = data[27] || '';
      type.laboratory.time = data[11];
    }
  }
  if (data[12]) {
    type.practise = {}
    let teacher = data[28]
    if (teacher) {
      type.practise.teacher = data[28] || '';
      type.practise.time = data[12];
    }
  }
  return type;
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