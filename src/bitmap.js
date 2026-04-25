import Canvas from './canvas';
import showActive from './globals';

export default class Bitmap {
    inputBitmaps = [];

    constructor() {
        document.querySelector('.fileUpload').addEventListener('change', ev => showActive(ev.target));
        document.getElementById('fileUpload').addEventListener('change', async ev => {
            let text = '';
            try {
                const file = ev.target.files[0];
                fileName = file.name;
                text = await this.readFileAsText(file);
                this.getInputBitmaps(text);
                this.init();
                new Canvas().init();
                document.querySelectorAll('button.fileDownload, button.copy').forEach(button => button.classList.add('inactive'));
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
const FontData bitmaps[] PROGMEM = {
    { '0', sizeof(bitmap_0) / 3, bitmap_0 },
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
        let regex = /const FontData bitmaps\[] PROGMEM = {\n([\s\S]*?)\n};/g;
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
            this[`bitmap_${idx}`] = hexString.split(',').map(val => val.trim().toString(16).padStart(2, '0'));
            this.inputBitmaps.push([names[idx], this[`bitmap_${idx}`].length / params.maxFontPages, this[`bitmap_${idx}`]]);
            idx++;
        }
        params.maxRows = params.maxFontPages * 8;
        params.maxDisplayPages = params.maxRows / 8;

        document.querySelector('.maxRows').innerText = params.maxRows;
    }

    init() {
        bitmaps = [];

        for (let bitmapIndex = 0; bitmapIndex < this.inputBitmaps.length; bitmapIndex++) {
            bitmaps.push(this.new(...this.inputBitmaps[bitmapIndex]));
        }
    }

    new(name, width, inputBitmapItem) {
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
            cells: cells
        };
    }
}