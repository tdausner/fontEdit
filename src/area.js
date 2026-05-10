import {clearOutput} from './globals';

export default class Area {

    constructor() {
    }

    process(cellClicked) {
        const area = cellClicked.bitmap.area;
        if (area.pos.x0 === -1) {
            cellClicked.classList.add('area-first');
            area.pos.x0 = cellClicked.col;
            area.pos.y0 = cellClicked.row;
        } else if (area.pos.x1 === -1) {
            area.pos.x1 = cellClicked.col;
            area.pos.y1 = cellClicked.row;
            area.pos.left = Math.min(area.pos.x0, area.pos.x1);
            area.pos.top = Math.min(area.pos.y0, area.pos.y1);
            area.pos.right = Math.max(area.pos.x0, area.pos.x1);
            area.pos.bottom = Math.max(area.pos.y0, area.pos.y1);
        }

        if (area.pos.x1 >= 0) {
            // the area is complete, both corners are set
            if (!area.isComplete) {
                area.isComplete = true;
                document.addEventListener('keydown', this.moveArea);
                const bitmap = cellClicked.bitmap;
                const cell = bitmap.cells[area.pos.y0][area.pos.x0];
                cell.classList.remove('area-first');
                for (let row = area.pos.top; row <= area.pos.bottom; row++) {
                    for (let col = area.pos.left; col <= area.pos.right; col++) {
                        bitmap.cells[row][col].classList.add('area');
                    }
                }
            } else {
                area.isComplete = false;
                document.removeEventListener('keydown', this.moveArea);
                this.clearCells(cellClicked.bitmap.cells);
                area.pos.x0 = cellClicked.col;
                area.pos.y0 = cellClicked.row;
                cellClicked.classList.add('area-first');
            }
        }
        return false;
    }

    moveArea(ev) {

        let mustClearOutput = false;
        bitmaps.forEach(bitmap => {
            if (bitmap.areaActive) {
                const area = bitmap.area;

                if (ev.keyCode === 37 && area.pos.left > 0) {
                    // left
                    for (let row = area.pos.top; row <= area.pos.bottom; row++) {
                        for (let col = area.pos.left; col <= area.pos.right; col++) {
                            bitmap.cells[row][col - 1].state = bitmap.cells[row][col].state;
                            bitmap.cells[row][col - 1].classList = bitmap.cells[row][col].classList;
                            if (col === area.pos.right) {
                                bitmap.cells[row][col].classList.remove('area');
                                if (!bitmap.area.areaCopy) {
                                    bitmap.cells[row][col].state = false;
                                    bitmap.cells[row][col].classList.remove('on');
                                }
                            }
                        }
                    }
                    area.pos.left--;
                    area.pos.right--;
                    mustClearOutput = true;
                } else if (ev.keyCode === 38 && area.pos.top > 0) {
                    // up
                    for (let col = area.pos.left; col <= area.pos.right; col++) {
                        for (let row = area.pos.top; row <= area.pos.bottom; row++) {
                            bitmap.cells[row - 1][col].state = bitmap.cells[row][col].state;
                            bitmap.cells[row - 1][col].classList = bitmap.cells[row][col].classList;
                            if (row === area.pos.bottom) {
                                bitmap.cells[row][col].classList.remove('area');
                                if (!bitmap.area.areaCopy) {
                                    bitmap.cells[row][col].state = false;
                                    bitmap.cells[row][col].classList.remove('on');
                                }
                            }
                        }
                    }
                    area.pos.top--;
                    area.pos.bottom--;
                    mustClearOutput = true;
                } else if (ev.keyCode === 39 && area.pos.right < bitmap.width - 1) {
                    // right
                    for (let row = area.pos.top; row <= area.pos.bottom; row++) {
                        for (let col = area.pos.right; col >= area.pos.left; col--) {
                            bitmap.cells[row][col + 1].state = bitmap.cells[row][col].state;
                            bitmap.cells[row][col + 1].classList = bitmap.cells[row][col].classList;
                            if (col === area.pos.left) {
                                bitmap.cells[row][col].classList.remove('area');
                                if (!bitmap.area.areaCopy) {
                                    bitmap.cells[row][col].state = false;
                                    bitmap.cells[row][col].classList.remove('on');
                                }
                            }
                        }
                    }
                    area.pos.right++;
                    area.pos.left++;
                    mustClearOutput = true;
                } else if (ev.keyCode === 40 && area.pos.bottom < params.maxRows - 1) {
                    // down
                    for (let col = area.pos.left; col <= area.pos.right; col++) {
                        for (let row = area.pos.bottom; row >= area.pos.top; row--) {
                            bitmap.cells[row + 1][col].state = bitmap.cells[row][col].state;
                            bitmap.cells[row + 1][col].classList = bitmap.cells[row][col].classList;
                            if (row === area.pos.top) {
                                bitmap.cells[row][col].classList.remove('area');
                                if (!bitmap.area.areaCopy) {
                                    bitmap.cells[row][col].state = false;
                                    bitmap.cells[row][col].classList.remove('on');
                                }
                            }
                        }
                    }
                    area.pos.top++;
                    area.pos.bottom++;
                    mustClearOutput = true;
                }
            }
        });
        if (mustClearOutput) {
            clearOutput();
        }
    }

    clearCells(cells) {
        cells.forEach((columns) => {
            columns.forEach(cell => {
                cell.classList.remove('area', 'area-first');
            });
        });
        const area = cells[0][0].bitmap.area;
        for (const [key] of Object.entries(area.pos)) {
            area.pos[key] = -1;
        }
        document.removeEventListener('keydown', this.moveArea);
    }
}