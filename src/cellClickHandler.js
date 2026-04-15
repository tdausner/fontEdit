
export default class CellClickHandler {

    constructor(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        const cell = ev.target;
        if (area.bitmapIndex === cell.bitmapIndex) {
            area.instance.process(cell);
        } else {
            cell.classList.toggle('on');
            cell.state = cell.classList.contains('on');
        }
    }
}