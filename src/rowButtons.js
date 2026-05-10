import {clearOutput, showActive} from './globals';
import CellClickHandler from './cellClickHandler';
import CellHoverHandler from './cellHoverHandler';

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
        clearOutput();
        const where = document.querySelector('input[name="where"]:checked').value;
        const workRow = where === 'top' ? 0 : params.maxRows - 1;
        params.maxDisplayPages = document.querySelector('.displaySize').value;

        showActive(rowButton);
        if (rowButton.classList.contains('addRow')) {
            // addRow
            if (Math.ceil((params.maxRows + 1) / 8) <= params.maxDisplayPages) {
                bitmaps.forEach(bitmap => {
                    const tableBody = bitmap.cells[workRow][0].parentElement.parentElement;
                    const tableRow = tableBody.insertRow(where === 'top' ? 0 : -1);
                    const newRow = new Array(bitmap.width).fill(0).map(() => {
                        const newCell = tableRow.insertCell();
                        newCell.classList.add('value');
                        newCell.bitmap = bitmap;
                        newCell.addEventListener('mousedown', ev => new CellClickHandler(ev));
                        newCell.addEventListener('mouseover', ev => new CellHoverHandler(ev));
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
            if (params.maxRows > 1) {
                bitmaps.forEach(bitmap => {
                    const tableRow = bitmap.cells[workRow][0].parentElement;
                    tableRow.remove();
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
        }

        document.querySelector('.maxRows').innerText = params.maxRows;
    }
}