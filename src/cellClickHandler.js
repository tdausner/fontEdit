import {clearOutput} from './globals';

export default class CellClickHandler {

    constructor(ev) {
        const cell = ev.target;

        if (cell.bitmap.areaActive) {
            cell.bitmap.area.instance.process(cell);
        } else if (keyPressed === -1) {
            cell.classList.toggle('on');
            cell.state = cell.classList.contains('on');
            clearOutput();
        } else if (cell.bitmap.fillActive) {
            cell.classList.add('on');
            cell.state = true;
            clearOutput();
        } else if (cell.bitmap.wipeActive) {
            cell.classList.remove('on');
            cell.state = false;
            clearOutput();
        }
    }
}