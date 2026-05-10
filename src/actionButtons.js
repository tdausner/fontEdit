import {clearOutput, showActive} from './globals';
import Area from './area';
import AreaButtonHandler from './areaButtonHandler';
import AreaCopyButtonHandler from './areaCopyButtonHandler';
import FillAndWipeButtonHandler from './fillAndWipeButtonHandler';
import PlusButtonHandler from './plusButtonHandler';
import MinusButtonHandler from './minusButtonHandler';
import Canvas from './canvas';

export default class ActionButtons {

    buttonProperties = [
        {
            'area': 'select an area',
            'areaCopy': 'copy cells on move'
        }, {
            'fill': 'fill cells',
            'wipe': 'wipe cells'
        }, {
            'plus': 'add a column @right',
            'minus': 'remove a column @right'
        }, {
            'delete': 'delete bitmap',
            'clone': 'clone bitmap',
            'new': 'new bitmap'
        }
    ];

    constructor() {
    }

    initBitmapDiv(bitmapDiv, table, bitmap, width) {

        const topDiv = document.createElement('div');
        topDiv.classList.add('topDiv');
        bitmapDiv.append(topDiv);
        const bottomDiv = document.createElement('div');
        bottomDiv.classList.add('bottomDiv');
        bitmapDiv.append(bottomDiv);
        const bottomButtonDiv = document.createElement('div');
        bottomButtonDiv.classList.add('bottomButtonDiv');
        bottomDiv.append(bottomButtonDiv);

        const buttonGroupDiv = document.createElement('div');
        buttonGroupDiv.classList.add('buttonGroup');
        const nameInput = document.createElement('input');
        nameInput.classList.add('name');
        nameInput.type = 'text';
        nameInput.value = bitmap.name;
        nameInput.addEventListener('change', ev => {
            bitmap.name = ev.target.value;
        });
        buttonGroupDiv.append(nameInput);
        topDiv.append(buttonGroupDiv);

        bitmap.buttons = {};
        this.buttonProperties.forEach((buttonGroup, buttonGroupIndex) => {
            const buttonGroupDiv = document.createElement('div');
            buttonGroupDiv.classList.add('buttonGroup');

            for (const [buttonClass, buttonTitle] of Object.entries(buttonGroup)) {
                const button = document.createElement('button');
                button.bitmap = bitmap;
                button.title = buttonTitle;
                button.classList.add(buttonClass);
                button.bitmapDiv = bitmapDiv;
                buttonGroupDiv.append(button);
                button.addEventListener('click', ev => this.clickHandler(ev.target));
                bitmap.buttons[buttonClass] = button;
                if (buttonClass === 'area') {
                    button.bitmap.area.instance = new Area();
                } else if (buttonClass === 'areaCopy') {
                    button.classList.add('disabled');
                } else if (buttonClass === 'minus') {
                    const span = document.createElement('span');
                    span.classList.add('cols');
                    span.innerText = width;
                    buttonGroupDiv.append(span);
                } else if (buttonClass === 'delete') {
                    button.active = false;
                    if (bitmaps.length < 2) {
                        button.classList.add('disabled');
                    }
                }
            }

            if (buttonGroupIndex <= 1) {
                bottomButtonDiv.append(buttonGroupDiv);
            } else {
                topDiv.append(buttonGroupDiv);
            }
        });

        bottomDiv.append(table);
    }

    clickHandler(actionButton) {
        const buttonClass = actionButton.classList[0];
        switch (buttonClass) {
            case 'area':
                new AreaButtonHandler(actionButton);
                break;
            case 'areaCopy':
                new AreaCopyButtonHandler(actionButton);
                break;
            case 'fill':
                new FillAndWipeButtonHandler(actionButton, true);
                break;
            case 'wipe':
                new FillAndWipeButtonHandler(actionButton, false);
                break;
            case 'plus':
                new PlusButtonHandler(actionButton);
                break;
            case 'minus':
                new MinusButtonHandler(actionButton);
                break;
            case 'delete':
                this.deleteBitmapClickHandler(actionButton);
                break;
            case 'clone':
                this.cloneBitmapClickHandler(actionButton);
                break;
            case 'new':
                this.newBitmapClickHandler(actionButton);
                break;
        }
    }

    cloneBitmapClickHandler(actionButton) {
        const newBitmap = this.newBitmapClickHandler(actionButton);
        newBitmap.area.instance = new Area();
        // clone cells
        const bitmap = actionButton.bitmap;
        const newBitmapCells = newBitmap.cells;
        bitmap.cells.forEach((cells, rowIndex) => {
            cells.forEach((cell, cellIndex) => {
                newBitmapCells[rowIndex][cellIndex].state = cell.state;
                newBitmapCells[rowIndex][cellIndex].classList = cell.classList;
            });
        });
        newBitmap.area.instance.clearCells(newBitmapCells);
    }

    deleteBitmapClickHandler(actionButton) {
        actionButton.classList.add('active');
        if (confirm('Are you sure you want to delete this bitmap?')) {
            clearOutput();
            // delete current bitmap
            bitmaps.splice(bitmaps.indexOf(actionButton.bitmap), 1);

            const bitmapDiv = actionButton.parentElement.parentElement.parentElement;
            bitmapDiv.remove();
            if (bitmaps.length === 1) {
                document.querySelector('button.delete').classList.add('disabled');
            }
        }
        setTimeout(() => {
            actionButton.classList.remove('active');
        }, 200);
    }

    newBitmapClickHandler(actionButton) {
        clearOutput();
        showActive(actionButton);
        if (bitmaps.length === 1) {
            actionButton.parentNode.firstElementChild.classList.remove('disabled');
        }
        // add new bitmap
        const width = actionButton.bitmap.width;
        const newBitmap = bitmapInstance.newBitmap('?', width, new Array(params.maxRows * width / 8).fill(0x00));
        let bitmapIndex = bitmaps.indexOf(actionButton.bitmap);
        if (bitmapIndex < bitmaps.length) {
            bitmaps.splice(bitmapIndex + 1, 0, newBitmap);
        } else {
            bitmaps.push(newBitmap);
        }
        // insert new bitmap into canvas
        const bitmapDiv = actionButton.parentElement.parentElement.parentElement;
        const newBitmapDiv = new Canvas().newBitmapDiv(newBitmap, this);
        bitmapDiv.after(newBitmapDiv);

        return newBitmap;
    }
}