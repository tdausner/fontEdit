export default class FillAndWipeHandler {

    constructor(actionButton, fill) {
        const cells = bitmaps[actionButton.bitmapIndex].cells;
        const width = bitmaps[actionButton.bitmapIndex].width;

        const startRow = area.isComplete ? area.pos.top : 0;
        const endRow = area.isComplete ? area.pos.bottom : params.maxRows - 1;
        const startCol = area.isComplete ? area.pos.left : 0;
        const endCol = area.isComplete ? area.pos.right : width - 1;

        for(let row = startRow; row <= endRow; row++) {
            for(let col = startCol; col <= endCol; col++) {
                cells[row][col].state = fill;
                if (fill) {
                    cells[row][col].classList.add('on');
                } else {
                    cells[row][col].classList.remove('on');
                }
            }
        }
    }
}