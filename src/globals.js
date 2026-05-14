Object.assign(window, {
    fileName: 'fonEditIcon.h',
    fileHeader: '',
    fileLoaded: false,
    keyPressed: -1,
    bitmaps: [],
    /*
     * 0: {
     *      name: string,
     *      width: int,
     *      cells: [<row>][col]  <td htmlElement>
     *          {
     *              bitmap: Object,
     *              row: int,
     *              col: int,
     *              state: bool,
     *          },
     *      ],
     *      bitmapDiv: <htmlElement>,
     *      buttons: [
     *          <buttonClass>: {
     *              bitmap: Object,
     *              title: string
     *              active: bool,
     *          },
     *      ],
     *      areaActive: bool,
     *      fillActive: bool,
     *      wipeActive: bool,
     *      area: {
     *          instance: class Area(),
     *          bitmap: Object,
     *          pos: {
     *              x0: int,
     *              y0: int,
     *              x1: int,
     *              y1: int,
     *              left: int,  calculated from x0, y0, x1, y1
     *              top: int,
     *              right: int,
     *              bottom: int,
     *          },
     *          isComplete: bool,
     *          areaCopy: bool,
     *     }
     * }
    
     */
    activeBitmap: null,
    bitmapInstance: null,
    params: {
        maxFontPages: 3,
        maxDisplayPages: 4,
        maxRows: 24,
    },
});


export function clearOutput() {
    document.querySelectorAll('button.fileDownload, button.copy')
            .forEach(button => button.classList.add('disabled'));
    document.querySelector('pre').innerText = '';
}

export function showActive(actionButton) {
    actionButton.classList.add('active');
    setTimeout(() => {
        actionButton.classList.remove('active');
    }, 500);
}
