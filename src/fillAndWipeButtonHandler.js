import AreaButtonHandler from './areaButtonHandler';

export default class FillAndWipeButtonHandler {

    constructor(actionButton, fill) {
        const bitmap = actionButton.bitmap;
        const otherButton = bitmap.buttons[fill ? 'wipe' : 'fill'];
        bitmap.fillActive = false;
        bitmap.wipeActive = false;
        [actionButton, otherButton].forEach(button => {
            if (button === actionButton) {
                button.classList.toggle('active');
            } else {
                button.classList.remove('active');
            }
        });
        if (actionButton.classList.contains('active')) {
            bitmap.fillActive = fill;
            bitmap.wipeActive = !fill;
            // set the bitmapDiv class to the active actionButton's class (for CSS styling)
            actionButton.bitmapDiv.classList.add(actionButton.classList[0]);
            actionButton.bitmapDiv.classList.remove(otherButton.classList[0]);
        } else {
            bitmap.fillActive = false;
            bitmap.wipeActive = false;
            // clear the bitmapDiv class list from the active actionButton's class (for CSS styling)
            actionButton.bitmapDiv.classList.remove(actionButton.classList[0], otherButton.classList[0]);
        }
        if (bitmap.areaActive) {
            new AreaButtonHandler(bitmap.buttons['area']);
            bitmap.areaActive = false;
            bitmap.areaCopy = false;
        }
    }
}