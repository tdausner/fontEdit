import ActionButtons from './actionButtons';
import CellClickHandler from './cellClickHandler';

export default class Canvas {

    constructor() {
    }

    init() {
        const canvas = document.querySelector('.canvas');
        const actionButtons = new ActionButtons();
        const bitmapDivs = document.querySelectorAll('.bitmap');
        bitmapDivs.forEach(bitmapDiv => bitmapDiv.remove());

        bitmaps.forEach((bitmap, bitmapIndex) => {
            canvas.append(this.newBitmap(bitmap, bitmapIndex, actionButtons));
        });
    }

    newBitmap(bitmap, bitmapIndex, actionButtons) {
        const bitmapDiv = document.createElement('div');
        bitmapDiv.classList.add('bitmap');
        const table = document.createElement('table');
        area.instance = actionButtons.initBitmapDiv(bitmapDiv, table, bitmapIndex, bitmap.width);

        const tableBody = table.createTBody();
        bitmap.cells.forEach((row, rowIdx) => {
            const bodyRow = tableBody.insertRow(-1);
            row.forEach((on, colIdx) => {
                const bodyCell = bodyRow.insertCell(-1);
                bodyCell.classList.add('value');
                bodyCell.bitmapIndex = bitmapIndex;
                bodyCell.row = rowIdx;
                bodyCell.col = colIdx;
                bodyCell.state = false;
                if (on) {
                    bodyCell.classList.add('on');
                    bodyCell.state = true;
                }
                bodyCell.addEventListener('click', ev => new CellClickHandler(ev));
                bitmap.cells[rowIdx][colIdx] = bodyCell;
            })
        })
        return bitmapDiv;
    }
}