export default class Params {

    constructor() {
        // area => copy
        const areaCopy = document.querySelector('input[name="areaCopy"]');
        params.areaCopy = areaCopy.checked;
        areaCopy.addEventListener('change', ev => {
            params.areaCopy = areaCopy.checked;
        });
    }
}