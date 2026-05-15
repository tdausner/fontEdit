export default class AreaButtonHandler {

    constructor(actionButton) {
        const bitmap = actionButton.bitmap;
        const area = bitmap.area;
        const areaCopyButton = bitmap.buttons['areaCopy'];
        actionButton.classList.toggle('active');
        if (actionButton.classList.contains('active')) {
            areaCopyButton.classList.remove('disabled');
            bitmap.buttons['fill'].classList.remove('active');
            bitmap.buttons['wipe'].classList.remove('active');
            bitmap.bitmapDiv.classList.remove('fill', 'wipe');
            bitmap.areaActive = true;
            bitmap.fillActive = false;
            bitmap.wipeActive = false;
            area.pos.x0 = -1;
            area.pos.y0 = -1;
            area.pos.x1 = -1;
            area.pos.y1 = -1;
            area.pos.left = -1;
            area.pos.top = -1;
            area.pos.right = -1;
            area.pos.bottom = -1;
        } else {
            areaCopyButton.classList.remove('active');
            areaCopyButton.classList.add('disabled');
            area.instance.clearCells(bitmap.cells);
            bitmap.areaActive = false;
        }
        bitmap.areaCopy = false;
        bitmap.area.isComplete = false;
    }
}