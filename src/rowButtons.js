import showActive from './globals';
import CellClickHandler from './cellClickHandler';

export default class RowButtons {

    constructor() {
        const displaySize = document.querySelector('.displaySize');
        displaySize.addEventListener('change', ev => {
            const value = ev.target.value;
            if (value === '8') {
                ev.target.disabled = true;
            }
        });
        const rowButtons = document.querySelectorAll('.rowButtons button');
        rowButtons.forEach(rowButton => {
            rowButton.addEventListener('click', ev => this.clickHandler(ev.target));
        });
    }

    clickHandler(rowButton) {
        const where = document.querySelector('input[name="where"]:checked').value;
        const workRow = where === 'top' ? 0 : params.maxRows - 1;
        params.maxDisplayPages = document.querySelector('.displaySize').value;

        showActive(rowButton);
        if (rowButton.classList.contains('addRow')) {
            // addRow
            if (Math.ceil((params.maxRows + 1) / 8) > params.maxDisplayPages) {
                alert('max display size exceeded');
            } else {
                bitmaps.forEach((bitmap, bitmapIndex) => {
                    const body = bitmap.cells[workRow][0].parentElement.parentElement;
                    const bodyRow = body.insertRow(where === 'top' ? 0 : -1);
                    const newRow = new Array(bitmap.width).fill(0).map((ignore, index) => {
                        const newCell = bodyRow.insertCell();
                        newCell.classList.add('value');
                        newCell.bitmapIndex = bitmapIndex;
                        newCell.addEventListener('click', ev => new CellClickHandler(ev));
                        return newCell;
                    });
                    if (where === 'top') {
                        bitmap.cells.unshift(newRow);
                    } else {
                        bitmap.cells.push(newRow);
                    }
                    // renumber cells
                    bitmap.cells.forEach((cells, rowIndex) => {
                       cells.forEach((cell, cellIndex) => {
                           cell.row = rowIndex;
                           cell.col = cellIndex;
                       });
                    });
                });
                params.maxRows++;
                params.maxFontPages = Math.ceil((params.maxRows + 1) / 8);
            }
        } else {
            //removeRow
            bitmaps.forEach((bitmap, bitmapIndex) => {
                const bodyRow = bitmap.cells[workRow][0].parentElement;
                //const body = bodyRow.parentElement;
                bodyRow.remove();
                if (where === 'top') {
                    bitmap.cells.shift();
                } else {
                    bitmap.cells.pop();
                }
                // renumber cells
                bitmap.cells.forEach((cells, rowIndex) => {
                    cells.forEach((cell, cellIndex) => {
                        cell.row = rowIndex;
                        cell.col = cellIndex;
                    });
                });
            });
            params.maxRows--;
            params.maxFontPages = Math.ceil((params.maxRows - 1) / 8);
        }

        document.querySelector('.maxRows').innerText = params.maxRows;
    }
}