import { titles } from "../../constants/constants.js";

closeModal.addEventListener('click', () => {
  $('#modalSelectTeacher').modal('hide')
  selectTeacher.value = 0;
});

export function drawElements() {
  let items = [];
  for (let i = 0; i < titles.length; i++) {
    items.push(`<a class="toggle-vis" data-column="${i}">${titles[i]}</a> `)
  }
  tableVisibleMenu.innerHTML = '<button id="visibleColumnsButton">Отображение столбцов</button>' + 
  '<div id="visibleColumns" hidden>Настроить видимость можно нажав на название столбца' +
  '<div>' + items.join(' - ') + '</div></div>';

  visibleColumnsButton.addEventListener('click', ()=> {
    visibleColumns.hidden = !visibleColumns.hidden;
    visibleColumnsButton.classList.toggle('active-btn')
  })
}