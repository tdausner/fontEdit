# Font editor for SSD1306 based OLED dot matrix displays

Features:
- browser-based (FireFox, Chrome, Chromium, Edge tested)
- for 32x128 and 64x128 pixels displays
- default font `defaultFontAvr.h` in [/src](/src/defaultFontAvr.h)
- empty single bitmap (10x16) on no default font
- the number of rows can be changed (default: from file or 16)
- loading of custom fonts from a file
- pixel-based editing
- multi-pixel actions
  - mark area
  - move area
  - fill area
  - clear area
- add new bitmap
- the number of columns can be changed per bitmap
- output to the screen
- clipboard copy
- output to a file (future release)
 
The actual version is for AVR microcontrollers

## Setup

```bash
$ cd to/your/font/editor/directory
$ yarn install
$ npm start server
```

## Font format example

```php
typedef struct {
    char symbol;
    uint8_t width;
    const uint8_t *bitmap;
} FontData;

static const uint8_t bitmap_0[] PROGMEM = {
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,0x00, 0x00,0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00,0x00, 0x00,0x00, 0x00,
};
const FontData bitmaps[] PROGMEM = {
    { '0', sizeof(bitmap_0) / 2, bitmap_0 },
};    
```