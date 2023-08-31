/**
 * @type {Map<string, Texture>}
 */
const globalTextures = new Map();

/**
 * @type {number}
 */
let guiScale = 1; // WIP

/**
 * @param {number} newGuiScale 
 */
function setGuiScale(newGuiScale) {
    if (newGuiScale == guiScale || !(typeof newGuiScale == "number"))
        return;
    guiScale = newGuiScale;
}

/**
 * @type {Map<number, ImageData>}
 */
const imageCache = new Map();

let invertedScrollwheel = false;
function setInvertedScrollwheel(inverted) {
    invertedScrollwheel = inverted;
}

/**
 * @type {number}
 */
let slotId = 0;

/**
 * @param {number} newSlotId 
 */
function setSlotId(newSlotId) {
    if (newSlotId == slotId || !(typeof newSlotId == "number"))
        return;
    slotId = newSlotId;
}

export {
    globalTextures,
    guiScale,
    setGuiScale,
    imageCache,
    invertedScrollwheel,
    setInvertedScrollwheel,
    slotId,
    setSlotId
}