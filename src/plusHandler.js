import CellClickHandler from './cellClickHandler';

export default class PlusHandler {

    constructor(actionButton) {
        const bitmap = bitmaps[actionButton.bitmapIndex];
        const cells = bitmap.cells;
        const width = bitmap.width;
        for (let row = 0; row <= params.maxRows - 1; row++) {
            const lastCell = cells[row][width - 1];
            const bodyRow = lastCell.parentElement;
            const cell = bodyRow.insertCell(-1);
            cell.classList.add('value');
            cell.bitmapIndex = actionButton.bitmapIndex;
            cell.row = row;
            cell.col = width;
            cell.state = false;
            cell.addEventListener('click', ev => new CellClickHandler(ev));
            cells[row].push(cell);
        }
        bitmap.width++;
        actionButton.parentElement.querySelector('span').innerText = bitmap.width;
    }
}