import Canvas from './canvas';
import {clearOutput, showActive} from './globals';

export default class Bitmap {
    inputBitmaps = [];

    constructor() {
        document.querySelector('.fileUpload').addEventListener('change', ev => showActive(ev.target));
        document.getElementById('fileUpload').addEventListener('change', async ev => {
            let text = '';
            try {
                const file = ev.target.files[0];
                fileName = file.name;
                document.querySelector('.fontNameInput').value = fileName;
                text = await this.readFileAsText(file);
                this.getInputBitmaps(text);
                this.init();
                new Canvas().init();
                clearOutput();
                document.querySelectorAll('.fontName')
                        .forEach(fn => fn.innerText = fileName.substring(0, fileName.lastIndexOf('.')));
            } catch (err) {
                console.error('Error reading file:', err);
            }
        });

        this.getInputBitmaps(`
static const uint8_t bitmap_0[] PROGMEM = {
    0x00, 0x00, 0x00, 0x00, 0x00, 0xf8, 0xfc, 0xfe, 0xff, 0x0f, 0x07, 0x07, 0x07, 0x07, 0x0f, 0x3e, 0x3c, 0x38, 
    0x80, 0xc0, 0xc0, 0x60, 0x60, 0xff, 0xff, 0xff, 0xff, 0x30, 0x30, 0x18, 0x18, 0x1c, 0x0c, 0x04, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
};
const FontData bitmaps_fontEditIcon[] PROGMEM = {
    { 'f', sizeof(bitmap_0) / 3, bitmap_0 },
};
`);
        this.init();
        new Canvas().init();
    }

    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    getInputBitmaps(text) {
        const matches = /^(\/\*[\s\S]*?\*\/\s)/.exec(text);
        if (matches !== null && matches.length > 0) {
            fileHeader = matches[0];
        }

        let names = [];
        let match;
        let regex = /const FontData bitmaps_[A-Za-z0-9_]+\[] PROGMEM = {\n([\s\S]*?)\n};/g;
        if ((match = regex.exec(text)) !== null) {
            const values = match[1].split(/(\s*{\s*'|'[^/]+\/\s*|,\s*bitmap_\d+\s*},\s*)/);
            for (let i = 2; i < values.length; i += 6) {
                let name = values[i];
                if (name === "\\") {
                    name = "'";
                } else if (name === "\\\\") {
                    name = "\\";
                }
                if (name !== '') {
                    names.push(name);
                }
                if (i === 2 && values[4] !== undefined) {
                    params.maxFontPages = parseInt(values[4]);
                }
            }
        }

        this.inputBitmaps = [];
        let idx = 0;
        regex = /static const uint8_t bitmap_.*?\[] PROGMEM = {.*\n([\s\S]*?)\n};/g;
        while ((match = regex.exec(text)) !== null) {
            const hexString = match[1].replace(/,\s*?$/, '');
            const hexData = hexString.split(',').map(val => val.trim().toString(16).padStart(2, '0'));
            this.inputBitmaps.push([names[idx++], hexData.length / params.maxFontPages, hexData]);
        }
        params.maxRows = params.maxFontPages * 8;
        params.maxDisplayPages = params.maxRows / 8;

        document.querySelector('.maxRows').innerText = params.maxRows;
    }

    init() {
        bitmaps = [];

        for (let index = 0; index < this.inputBitmaps.length; index++) {
            bitmaps.push(this.newBitmap(...this.inputBitmaps[index]));
        }
    }

    newBitmap(name, width, inputBitmapItem) {
        let cells = [];
        let row = 0;
        for (let page = 0; page < params.maxFontPages; page++) {
            for (let col = 0; col < width; col++) {
                let hex = inputBitmapItem[width * page + col];
                for (let bit = 0; bit < 8; bit++) {
                    row = (page * 8) + bit;
                    if (col === 0) {
                        cells.push([]);
                    }
                    cells[row].push(!!(hex & (1 << bit)));
                }
            }
        }
        return {
            name: name,
            width: width,
            cells: cells,
            buttons: [],
            areaActive: false,
            fillActive: false,
            wipeActive: false,
            area: {
                instance: null,
                bitmap: null,
                pos: {
                    x0: -1,
                    y0: -1,
                    x1: -1,
                    y1: -1,
                    left: -1,
                    top: -1,
                }
            }
        };
    }
}