let typesName = [
  {
    name: 'Лекции',
    secondName: 'Коллоквиум',
    additionalName: 'Установочные лекции',
    namesType: ['Лекции дневное обучение', 'Лекции заочное обучение']
  },
  {
    name: 'Практические',
    additionalName: 'Установочные практические занятия',
    namesType: ['Практика дневное обучение', 'Практика заочное обучение']
  },
  {
    name: 'Лабораторные',
    namesType: ['Лабораторные дневное обучение', 'Лабораторные заочное обучение']
  },
  {
    name: 'Контрольная работа',
    namesType: ['Контрольная работа дневное обучение', 'Контрольная работа заочное обучение']
  },
  {
    name: 'Экзамен',
    namesType: ['Экз дневное обучение', 'Экз заочное обучение']
  },
  {
    name: 'Зачет',
    namesType: ['Зачеты дневное обучение', 'Зачеты заочное обучение']
  },
  {
    name: 'Курсовая работа',
    namesType: ['Курсовая  работа дневное обучение', 'Курсовая  работа заочное обучение']
  },
  {
    name: 'Консультации',
    namesType: ['Конс. дневное обучение', 'Конс. заочное обучение']
  }
];

let table;
let lastIndex = 0;
let typeIndex = 1;
let firstPeriodHours = 0;
let secondPeriodHours = 0;
let tablewidth = [5,14,14,14,7,7,7,7,7,7];

let titles = [];
let titleLength = 0;

function initTable(data) {
  $(document).ready(function() {
    table = $('#example').DataTable({
      // данные
      data: data,
      dom: 'Bfrtip',
      paging: false,
      ordering: false,
      info: false,
      searching: false,
      bAutoWidth: false, 
      aoColumns : [
        { sWidth: '10%' },
        { sWidth: '10%' },
        { sWidth: '10%' },
        { sWidth: '10%' },
        { sWidth: '10%' },
        { sWidth: '10%' },
        { sWidth: '10%' },
        { sWidth: '10%' },
        { sWidth: '10%' },
        { sWidth: '10%' }
      ],
      // кнопка для скачивания в excel
      buttons: [{
        'extend': 'excel',
        text: 'Скачать excel',
        className: 'exportExcel',
        filename: 'list',
        title: null,
        createEmptyCells: true,
        exportOptions: {
          modifier: {
            page: 'all'
          },
          format: {
            body: function ( data ) {
              return `${data}`.split(' ').join('\r\n') 
            }
        }
        },
        customize: function (xlsx) {
          var sheet = xlsx.xl.worksheets['sheet1.xml'];
          $( 'row c', sheet ).attr( 's', '25' );
          var col = $('col', sheet);
            col.each(function (i) {
              $(this).attr('width', tablewidth[i]);
          });

        }
      }],
      // перевод
      "language": {
        "lengthMenu": "Показать _MENU_ студентов на странице",
        "zeroRecords": "Ничего не найдено - sorry",
        "info": "Показать страницу _PAGE_ из _PAGES_",
        "infoEmpty": "Нет доступных записей",
        "infoFiltered": "(отфильтровано из _MAX_ всех записей)"
      },
    });
  });
}


// Получение всех пользователей
async function GetUsers() {
  // отправляет запрос и получаем ответ
  const response = await fetch("/api/users", {
      method: "GET",
      headers: { "Accept": "application/json" }
  });
  // если запрос прошел нормально
  if (response.ok === true) {
      // получаем данные
      const dataUsers = await response.json();
      users = dataUsers;
      initTable(users.map(x => [x.name, x.age]));
  }
}

function getDataTable(values, hours, nameType) {
  let datatable = [];
  let subjects = values.map(x => x[0]);
  let specialty = values.map(x => x[4]);
  
  datatable[0] = [typeIndex, nameType, subjects[0], specialty[0]];
  setHours(hours[0], datatable[0])

  for (let i = 1; i < values.length; i++) {
    datatable[i] = [];
    datatable[i][2] = subjects[i];
    datatable[i][3] = specialty[i];
    setHours(hours[i], datatable[i])
  }
  return datatable;
}

function getLastRow(datatable, hours) {
  lastIndex = datatable.length;
  datatable[lastIndex] = [];
  datatable[lastIndex][4] = hours.reduce((sum,x) => sum+= +x['one'] || 0, 0);
  datatable[lastIndex][6] = hours.reduce((sum,x) => sum+= +x['two'] || 0, 0);
  if (datatable[lastIndex][4] || datatable[lastIndex][6]) {
    firstPeriodHours += (datatable[lastIndex][4] || 0);
    secondPeriodHours+=  (datatable[lastIndex][6] || 0);
    datatable[lastIndex][8] = (datatable[lastIndex][4] || 0) + (datatable[lastIndex][6] || 0)
    datatable[lastIndex+1] = [];
    typeIndex++;
    return datatable;
  }
  return [];
}

function getHours(values, isFuture) {
  let hours = values.map(x => {
    let key = 'one';
    if (x[8]%2 === 0 && !isFuture || x[8]%2 === 1 && isFuture) {
      key = 'two'
    }
    return {
      [key]: x[3],
    }
  })
  return hours;
}

function setHours(hours, row) {
  let allHours = 0;
  if (hours) {
    if (hours['one']) {
      row[4] = hours['one']
      allHours+= +hours['one'];
    } else if(hours['two']) {
      row[6] = hours['two'];
      allHours+= +hours['two'];
    }
  }
  if (allHours) {
    row[8] = allHours;
  }
  return lastIndex;
}

function filterByType(values, typeFirst, typeSecond) {
  let typeValues = {};
  for (let i = 0; i < values.length; i++) {
    let type = values[i][typeFirst];
    if (typeSecond) {
      type = `${values[i][typeFirst]}-${values[i][typeSecond]}`
    }
    if (!typeValues[type]) {
      typeValues[type] = values[i]
    } else {
      if (values[i][4]) {
        typeValues[type][4] = (typeValues[type][4] || 0) +values[i][4];
      } else if (values[i][6]) {
        typeValues[type][6] = (typeValues[type][6] || 0) + values[i][6];
      }
      typeValues[type][8] = (typeValues[type][6] || 0) + (typeValues[type][4] || 0);
    }
  }
  return Object.values(typeValues);
}

function prepareData(dataFuture, dataCurrent, nameType) {
  if (dataFuture.length || dataCurrent.length) {
    let dataHours = getHours(dataFuture, true).concat(getHours(dataCurrent))
    let data = getDataTable(dataFuture.concat(dataCurrent), dataHours, nameType)
    let filteredData = filterByType(data, 2, 3)
    let wholeData = getLastRow(filteredData, dataHours);
    return wholeData;
  }
  return [];
}

function createData(allValues, generalType) {
  let type = 'очная';
  let additionalTypes = ['заочная', 'заочная сокращенная']
  let { name, additionalName, namesType, secondName } = generalType;
  let dataFuture = [];
  if (additionalName) {
    dataFuture = allValues.filter(x => x[1].includes(additionalName) && x[6] === type)
  }
  let data = allValues.filter(x => x[1].includes(name) && x[6] === type)
  if (secondName) {
    let secondData = allValues.filter(x => x[1].includes(secondName) && x[6] === type);
    data = data.concat(secondData)
  }
  let preparedData = prepareData(dataFuture, data, namesType[0]);

  let additionalDataFuture = [];
  if (additionalName) {
    additionalDataFuture = allValues.filter(x => x[1].includes(additionalName) && additionalTypes.includes(x[6]))
  }
  let additionalData = allValues.filter(x => x[1].includes(name) && additionalTypes.includes(x[6]))
  let additionalPreparedData = prepareData(additionalDataFuture, additionalData, namesType[1]);

  let datatable = preparedData.concat(additionalPreparedData);
  return datatable;
}

function writeAllHours(datatable) {
  datatable[datatable.length] = [];
  let indexAllHours = datatable.length;
  datatable[indexAllHours] = [];
  datatable[indexAllHours][3] = 'Итог'
  datatable[indexAllHours][4] = firstPeriodHours.toFixed(2);
  datatable[indexAllHours][6] = secondPeriodHours.toFixed(2);
  datatable[indexAllHours][8] = (+datatable[indexAllHours][4] + +datatable[indexAllHours][6]).toFixed(2);
  return datatable;
}

function checkDataTable(datatable) {
  for (let i = 0; i < datatable.length; i++) {
    for (let j = 0; j < 10; j++) {
      if (!datatable[i][j]) {
        datatable[i][j] = '';
      } else {
        datatable[i][j] = `${datatable[i][j]}`.split(' ').join('\n') 
      }
    }
  }
  return datatable;
}

function unificationData(x) {
  let indexGroup = x[1].search('гр.');
  if (indexGroup !== -1) {
    x[4] = x[1].slice(indexGroup+3);
  }
  x[3] = parseFloat(x[3]);
  x[8] = parseFloat(x[8]);
  return x;
}

function init(XL_row_object) {
  let allValues = XL_row_object.map(x => Object.values(x)).filter(x => x.length === 11).map(x => unificationData(x));
  
  let datatable = []
  datatable[0] = ['1','2','3','4','5','6','7','8','9','10']
  for (let i = 0; i < typesName.length; i++) {
    let data = createData(allValues, typesName[i]);
    datatable = datatable.concat(data);
  }
  datatable = writeAllHours(datatable);
  datatable = checkDataTable(datatable);
  initTable(datatable)
}

$(document).ready(function(){
  $("#fileUploader").change(function(evt){
        let selectedFile = evt.target.files[0];
        let reader = new FileReader();
        reader.onload = function(event) {
          let data = event.target.result;
          let workbook = XLSX.read(data, {
              type: 'binary'
          });
          workbook.SheetNames.forEach(function(sheetName) {
              let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
              let allValues = XL_row_object.map(x => Object.values(x));
              titleLength = Math.max(...allValues.map(x => x.length));
              titles = Object.keys(XL_row_object[0]).map(x => {
                return {
                  title: x,
                }
              });
              init(XL_row_object);
              // localStorage.setItem('d', JSON.stringify(XL_row_object))
            
              // table.clear();
              // table.rows.add(allValues);
              // table.draw();
              // UpdateAllUsers(XL_row_object);
            })
        };

        reader.onerror = function(event) {
          console.error("File could not be read! Code " + event.target.error.code);
        };

        reader.readAsBinaryString(selectedFile);
  });
});