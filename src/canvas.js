import ActionButtons from './actionButtons';
import CellClickHandler from './cellClickHandler';
import CellHoverHandler from './cellHoverHandler';

export default class Canvas {

    constructor() {
    }

    init() {
        const canvas = document.querySelector('.canvas');
        const actionButtonInstance = new ActionButtons();
        const bitmapDivs = document.querySelectorAll('.bitmap');
        bitmapDivs.forEach(bitmapDiv => bitmapDiv.remove());
        bitmaps.forEach(bitmap => canvas.append(this.newBitmapDiv(bitmap, actionButtonInstance)));
        canvas.addEventListener('mouseover', () => activeBitmap = null);

    }

    newBitmapDiv(bitmap, actionButtonInstance) {
        const bitmapDiv = document.createElement('div');
        bitmapDiv.classList.add('bitmap');
        const table = document.createElement('table');
        actionButtonInstance.initBitmapDiv(bitmapDiv, table, bitmap, bitmap.width);

        const tableBody = table.createTBody();
        bitmap.cells.forEach((row, rowIdx) => {
            const bodyRow = tableBody.insertRow(-1);
            row.forEach((on, colIdx) => {
                const bodyCell = bodyRow.insertCell(-1);
                bodyCell.classList.add('value');
                bodyCell.bitmap = bitmap;
                bodyCell.row = rowIdx;
                bodyCell.col = colIdx;
                bodyCell.state = false;
                if (on) {
                    bodyCell.classList.add('on');
                    bodyCell.state = true;
                }
                bodyCell.addEventListener('mousedown', ev => new CellClickHandler(ev));
                bodyCell.addEventListener('mouseover', ev => new CellHoverHandler(ev));
                bitmap.cells[rowIdx][colIdx] = bodyCell;
            })
        });
        bitmapDiv.addEventListener('mouseover', () => activeBitmap = null);

        return bitmapDiv;
    }
}