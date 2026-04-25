Object.assign(window, {
    fileName: 'fonEditIcon.h',
    fileHeader: '',
    fileLoaded: false,
    bitmaps: [],
    bitmapInstance: null,
    area:  {
        // bitmapIndex >= 0 => areaButton of "bitmapIndex" is active
        isComplete: false,
        bitmapIndex: -1,
        pos: {
            x0: -1,
            y0: -1,
            x1: -1,
            y1: -1,
            left: -1,
            top: -1,
            right: -1,
            bottom: -1,
        },
        instance: null,
    },
    params: {
        maxFontPages: 3,
        maxDisplayPages: 4,
        maxRows: 24,
        areaCopy: false,
    },
});

export default function showActive(actionButton) {
    actionButton.classList.add('active');
    setTimeout(() => {
        actionButton.classList.remove('active');
    }, 500);
}
