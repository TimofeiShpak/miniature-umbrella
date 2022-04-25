import { titles } from "../../constants/constants.js";

closeModal.addEventListener('click', () => {
  $('#modalSelectTeacher').modal('hide')
  selectTeacher.value = 0;
});

export function drawElements() {
  let items = [];
  let itemsTeacher = [];
  for (let i = 0; i < titles.length; i++) {
    items.push(`<a class="toggle-vis" data-column="${i}">${titles[i]}</a> `)
    itemsTeacher.push(`
      <div class="modal-item">
        <label for="selectTeacherField${i}">${titles[i]}</label>
        <input id="selectTeacherField${i}"></input>
        <span></span>
      </div>
    `)
  }
  tableVisibleMenu.innerHTML = `<div id="visibleColumns" hidden>Настроить видимость 
  можно нажав на название столбца` + '<div>' + items.join(' - ') + '</div></div>';

  selectTeacherFields.innerHTML = itemsTeacher.slice(0, -3).join('')

  visibleColumnsButton.addEventListener('click', ()=> {
    visibleColumns.hidden = !visibleColumns.hidden;
    visibleColumnsButton.classList.toggle('active-btn')
    let elem = document.querySelector('.dataTables_scrollBody')
    let height = document.documentElement.clientHeight - elem.getBoundingClientRect().top - 10 +'px'
    elem.style.maxHeight = height
  })
}