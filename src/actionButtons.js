import showActive from './globals';
import Area from './area';
import FillAndWipeHandler from './fillAndWipeHandler';
import PlusHandler from './plusHandler';
import MinusHandler from './minusHandler';
import Canvas from './canvas';

export default class ActionButtons {

    // buttons are drawn in order of list
    buttonClassNames =[['area', 'fill', 'wipe'], ['plus', 'minus'], ['new']];
    buttonTitles = [
        [
            'select an area',
            'fill the area',
            'wipe the area'
        ],
        [
            'add a column to the right',
            'remove a column from the right'
        ],
        [
            'new bitmap',
        ]
    ];

    constructor() {
    }

    init(bitmapDiv, bitmapIndex, width) {

        const buttonDiv = document.createElement('div');
        buttonDiv.classList.add('buttons');
        bitmapDiv.append(buttonDiv);

        let area = null;

        this.buttonClassNames.forEach((buttonGroup, buttonGroupIndex) => {
            const buttonGroupDiv = document.createElement('div');
            buttonGroupDiv.classList.add('buttonGroup');
            buttonDiv.append(buttonGroupDiv);

            if (buttonGroupIndex === 0) {
                const nameInput = document.createElement('input');
                nameInput.classList.add('name');
                nameInput.type = 'text';
                nameInput.value = bitmaps[bitmapIndex].name;
                nameInput.addEventListener('change', ev => {
                    bitmaps[bitmapIndex].name = ev.target.value;
                })
                buttonGroupDiv.append(nameInput);
            }

            buttonGroup.forEach((buttonClass, buttonIndex) => {
                const button = document.createElement('button');
                button.buttonGroupIndex = buttonGroupIndex;
                button.buttonIndex = buttonIndex;
                button.bitmapIndex = bitmapIndex;
                button.title = this.buttonTitles[buttonGroupIndex][buttonIndex];
                button.classList.add(buttonClass);
                if (buttonGroupIndex === 0 && buttonIndex > 0) {
                    button.classList.add('inactive');
                }
                buttonGroupDiv.append(button);
                button.addEventListener('click', ev => this.clickHandler(ev.target));
                if (buttonGroupIndex === 0 && buttonIndex === 0) {
                    area = button.area = new Area();
                } else if (buttonGroupIndex === 1 && buttonIndex === 1) {
                    const span = document.createElement('span');
                    span.classList.add('cols');
                    span.innerText = width;
                    buttonGroupDiv.append(span);
                }
            });
        });

        return area;
    }

    clickHandler(actionButton) {
        if (actionButton.buttonGroupIndex === 0) {
            if (actionButton.buttonIndex === 0) {
                // area
                this.areaClickHandler(actionButton);
            } else if (actionButton.buttonIndex === 1 || actionButton.buttonIndex === 2) {
                // fill & wipe
                showActive(actionButton);
                new FillAndWipeHandler(actionButton, actionButton.buttonIndex === 1);
            }
        } else if (actionButton.buttonGroupIndex === 1) {
            showActive(actionButton);
            if (actionButton.buttonIndex === 0) {
                // plus
                new PlusHandler(actionButton);
            } else if (actionButton.buttonIndex === 1) {
                // minus
                new MinusHandler(actionButton);
            }
        } else if (actionButton.buttonGroupIndex === 2) {
            // new bitmap
            this.newBitmapClickHandler(actionButton);
        }
    }

    newBitmapClickHandler(actionButton) {
        showActive(actionButton);
        // add new bitmap
        const width = bitmaps[actionButton.bitmapIndex].width;
        const newBitmap = bitmapInstance.new('?', width, new Array(params.maxRows * width / 8).fill(0x00));
        if (actionButton.bitmapIndex < bitmaps.length) {
            bitmaps.splice(actionButton.bitmapIndex + 1, 0, newBitmap);
        } else {
            bitmaps.push(newBitmap);
        }
        // insert new bitmap into canvas
        const bitmapDiv = actionButton.parentElement.parentElement.parentElement;
        const newBitmapDiv = new Canvas().newBitmap(newBitmap, actionButton.bitmapIndex + 1, this);
        bitmapDiv.after(newBitmapDiv);
        // renumber
        const bitmapButtonGroups = document.querySelectorAll('.bitmap .buttons');
        for (let bitmapIndex = actionButton.bitmapIndex + 1; bitmapIndex < bitmaps.length; bitmapIndex++) {
            const bitmap = bitmaps[bitmapIndex];
            // renumber cells
            bitmap.cells.forEach(cells => cells.forEach(cell => cell.bitmapIndex = bitmapIndex));
            // renumber actionButtons
            bitmapButtonGroups[bitmapIndex].querySelectorAll('button').forEach(button => {
                button.bitmapIndex = bitmapIndex;
            });
        }
    }

    areaClickHandler(actionButton) {
        const allAreaButtons = document.querySelectorAll('button.area');
        allAreaButtons.forEach(areaButton => {
            if (actionButton === areaButton) {
                areaButton.classList.toggle('active');
            } else {
                areaButton.classList.remove('active');
                const modButtons = areaButton.parentNode.querySelectorAll('.fill, .wipe');
                modButtons.forEach(modButton => modButton.classList.add('inactive'));
                areaButton.area.clear();
            }
        });

        area.isComplete = false;
        const modButtons = actionButton.parentNode.querySelectorAll('.fill, .wipe');
        if (actionButton.classList.contains('active')) {
            area.bitmapIndex = actionButton.bitmapIndex;
            modButtons.forEach(modButton => modButton.classList.remove('inactive'));
        } else {
            actionButton.area.clear();
            area.bitmapIndex = -1;
            modButtons.forEach(modButton => modButton.classList.add('inactive'));
        }
    }
}