import {clearOutput} from './globals';

export default class CellHoverHandler {

    constructor(ev) {
        ev.preventDefault();
        ev.stopPropagation();

        const cell = ev.target;
        activeBitmap = cell.bitmap;

        if (ev.buttons !== 0) {
            // mouse button pressed
            if (cell.bitmap.fillActive) {
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
}