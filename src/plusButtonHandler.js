import {clearOutput, showActive} from './globals';
import CellClickHandler from './cellClickHandler';
import CellHoverHandler from './cellHoverHandler';

export default class PlusButtonHandler {

    constructor(actionButton) {
        showActive(actionButton);
        clearOutput();
        const bitmap = actionButton.bitmap;
        const cells = bitmap.cells;
        const width = bitmap.width;
        for (let row = 0; row <= params.maxRows - 1; row++) {
            const lastCell = cells[row][width - 1];
            const bodyRow = lastCell.parentElement;
            const cell = bodyRow.insertCell(-1);
            cell.classList.add('value');
            cell.bitmap = bitmap;
            cell.row = row;
            cell.col = width;
            cell.state = false;
            cell.addEventListener('mousedown', ev => new CellClickHandler(ev));
            cell.addEventListener('mouseover', ev => new CellHoverHandler(ev));
            cells[row].push(cell);
        }
        bitmap.width++;
        actionButton.parentElement.querySelector('span').innerText = bitmap.width;
    }
}