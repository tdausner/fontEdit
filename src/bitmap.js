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
            } catch (err) {
                console.error('Error reading file:', err);
            }
        });

        fetch(params.defaultFont)
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    return `
static const uint8_t bitmap_0[] PROGMEM = {
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,0x00, 0x00,0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,0x00, 0x00,0x00, 0x00,
};
const FontData bitmaps[] PROGMEM = {
    { '0', sizeof(bitmap_0) / 2, bitmap_0 },
};    
`
                }
            })
            .then(text => {
                this.getInputBitmaps(text);
                this.init();
                new Canvas().init();
            });
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
        let names = [];
        let match;
        let regex = /const FontData bitmaps\[] PROGMEM = {\n([\s\S]*?)\n};/g;
        if ((match = regex.exec(text)) !== null) {
            const values = match[1].split(',').map(val => val.trim().replace(/\s*{ '(.)'.*/, '$1'));
            for (let i = 0; i < values.length; i += 3) {
                if (values[i] !== '') {
                    names.push(values[i]);
                }
                if (i === 0 && values[1] !== undefined) {
                    params.maxFontPages = parseInt(values[1].replace(/.*\/ (\d+).*/, '$1'));
                }
            }
        }

        this.inputBitmaps = [];
        let idx = 0;
        regex = /static const uint8_t bitmap_.*?\[] PROGMEM = {\n([\s\S]*?)\n};/g;
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