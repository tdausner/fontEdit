export default class AreaCopyButtonHandler {
    constructor(actionButton) {
        actionButton.classList.toggle('active');
        actionButton.bitmap.area.areaCopy = actionButton.classList.contains('active');
    }
}