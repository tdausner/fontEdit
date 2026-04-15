export default class minusHandler {

    constructor(actionButton) {
        const bitmap = bitmaps[actionButton.bitmapIndex];
        const width = bitmap.width;
        if (width > 1) {
            const cells = bitmap.cells;
            for (let row = 0; row <= params.maxRows - 1; row++) {
                const lastCell = cells[row][width - 1];
                const bodyRow = lastCell.parentElement;
                bodyRow.deleteCell(width - 1);
                cells[row].pop();
            }
            bitmap.width--;
            actionButton.parentElement.querySelector('span').innerText = bitmap.width;
        }
     }
}