const savedTypesName = [
  {
    name: 'Лекции',
    secondName: 'Коллоквиум',
    additionalName: 'Установочные лекции',
    namesType: ['Лекции дневное обучение', 'Лекции заочное обучение', 'Лекции очно-заочное обучение']
  },
  {
    name: 'Практические',
    additionalName: 'Установочные практические занятия',
    namesType: ['Практика дневное обучение', 'Практика заочное обучение', 'Практика очно-заочное обучение']
  },
  {
    name: 'РГР',
    namesType: ['РГР дневное обучение', 'РГР заочное обучение', 'РГР очно-заочное обучение']
  },
  {
    name: 'Лабораторные',
    namesType: ['Лабораторные дневное обучение', 'Лабораторные заочное обучение', 'Лабораторные очно-заочное обучение']
  },
  {
    name: 'Контрольная работа',
    namesType: ['Контрольная работа дневное обучение', 'Контрольная работа заочное обучение', 'Контрольная работа очно-заочное обучение']
  },
  {
    name: 'Экзамен',
    namesType: ['Экзамен дневное обучение', 'Экзамен заочное обучение', 'Экзамен очно-заочное обучение']
  },
  {
    name: 'Зачет',
    namesType: ['Зачеты дневное обучение', 'Зачеты заочное обучение', 'Зачеты очно-заочное обучение']
  },
  {
    name: 'Курсовой проект',
    namesType: ['Курсовой проект дневное обучение', 'Курсовой проект заочное обучение', 'Курсовой проект очно-заочное обучение']
  },
  {
    name: 'Курсовая работа',
    namesType: ['Курсовая работа дневное обучение', 'Курсовая работа заочное обучение', 'Курсовая работа очно-заочное обучение']
  },
  {
    name: 'Консультации',
    namesType: ['Консультации дневное обучение', 'Консультации заочное обучение', 'Консультации очно-заочное обучение']
  },
  {
    name: 'Прочие практики',
    namesType: ['Практика дневное обучение', 'Практика заочное обучение', 'Практика очно-заочное обучение']
  },
];

const titles = ['№', 'название дисциплин', 'экз', 'зач', 'зач с оцен-кой',
    'КП', 'КР', 'РГР', 'зачетные единицы', 'Всего часов', 'лекции', 'лаб. работы',
    'практ. занятия', 'всего аудиторн.', 'СРС', 'практическая подготовка',
    'семестр 1', 'семестр 2', 'семестр 3', 'семестр 4', 'семестр 5', 'семестр 6',
    'семестр 7', 'семестр 8', 'кафедры', 'коды компетенций', 'преподаватель лекций', 
    'преподаватель лабораторных', 'преподаватель практик'];

const titlesTeachersTable = ['ФИО', 'занято часов', 'макс часов']

const columnsTeachersTable = [];
for (let i = 0; i < titlesTeachersTable.length; i++) {
  columnsTeachersTable.push({ title: titlesTeachersTable[i] || '' });
}
// columnsTeachersTable.push({render : function ( data, type, row, meta ) {
//   return '<button class="btn btn-secondary">редактировать</button>';
// }})
// columnsTeachersTable.push({render : function ( data, type, row, meta ) {
//   return '<button class="btn btn-danger" >удалить</button>';
// }})

const typeNames = ['экзамен', 'зачет', 'зачет с оценкой']

const buttons = [{
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
}]

const language = {
  "lengthMenu": "Показать _MENU_ студентов на странице",
  "zeroRecords": "Данных нет",
  "info": "Показать страницу _PAGE_ из _PAGES_",
  "infoEmpty": "Нет доступных записей",
  "infoFiltered": "(отфильтровано из _MAX_ всех записей)"
}

let columns = [];
for (let i = 0; i < titles.length; i++) {
  columns.push({ title: titles[i] || `${i+1} - столбец` });
}

const dataTableOptions = {
  dom: 'Bfrtip',
  paging: false,
  info: false,
  searching: false,
  bAutoWidth: false, 
  select: true,
  scrollX: true,
  scrollY: true,
  "scrollCollapse": true,
  columns : columns,
  buttons: buttons,
  language: language,
  "columnDefs": [
    { "type": "num", targets: [2, 23] }
  ],
  "oLanguage": {
    "sEmptyTable": "Нет данных"
  },
  initComplete: function () {
      var btns = $('.dt-button');
      btns.addClass('btn btn-primary downloadExcel');
  }
}

const dataTeachersTable = {
  paging: false,
  info: false,
  searching: false,
  bAutoWidth: false, 
  select: true,
  columns : columnsTeachersTable,
  language: language,
  buttons: [],
  "columnDefs": [
    { "type": "num", targets: [1, 2] },
  ]
}

export { savedTypesName, titles, typeNames, dataTableOptions, dataTeachersTable }