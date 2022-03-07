import { dataTeachersTable } from '../constants/constants.js';
import { openEditTeacher } from './teachersEdition.js';


let table = null;
let fullData = null;

export function initTeachersTable(data, dbData) {
  fullData = dbData;
  console.log(fullData)
  if (table) {
    updateTable(data)
  } else {
    $(document).ready(function() {
      dataTeachersTable.data = data
      table = $('#tableTeachers').DataTable(dataTeachersTable);

      // выбор ячейки и строки
      $('#tableTeachers tbody').on( 'click', 'td', function () {
        if (window.isAdmin) {
          let cell = table.cell( this );
          // let cellData = cell.data();
          let rowIndex = cell[0][0].row;
          // let cellIndex = cell[0][0].column;
          // let currentRow = data[rowIndex].slice();
          openEditTeacher(fullData[rowIndex]);
        }
      });
      table.on( 'select', function ( e, dt, type, indexes ) {
          let rowData = table.rows( indexes ).data().toArray();
      })

      $('a.toggle-vis').on( 'click', function (e) {
        e.preventDefault();
        e.target.classList.toggle('selected')
        let column = table.column( $(this).attr('data-column') );
        column.visible( ! column.visible() );
      });
    });
  }
}

export function updateTable(data) {
  table.clear();
  table.rows.add(data);
  table.draw();
}