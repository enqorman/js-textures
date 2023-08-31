const globalTextures = new Map();

let guiScale = 1; // WIP
function setGuiScale(newGuiScale) {
    if (newGuiScale == guiScale)
        return;
    guiScale = newGuiScale;
}

const imageCache = new Map();

let invertedScrollwheel = false;
function setInvertedScrollwheel(inverted) {
    invertedScrollwheel = inverted;
}

let slotId = 0;
function setSlotId(newSlotId) {
    if (newSlotId == slotId)
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