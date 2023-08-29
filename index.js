/**
 * @type {HTMLCanvasElement | undefined}
 */
const canvas = document.getElementById("main");
if (!canvas) 
    throw new Error("Could not find canvas!");

const context = canvas.getContext("2d");
if (!context)
    throw new Error("Could not get 2d context from canvas");

// class Identifier {
//     #_namespace = ""
//     #_location = ""
//     constructor(namespace, location) {
//         this.#_namespace = String(namespace ?? "");
//         this.#_location = String(location ?? "");
//     }

//     /**
//      * @param {string} str 
//      * @returns {Identifier}
//      */
//     static fromString(str) {
//         str = String(str);
//         if (!str.includes(":"))
//             return new Identifier("", str);
//         const parts = str.split(':');
//         return new Identifier(parts[0], parts[1]);
//     }

//     getNamespace() {
//         return this.#_namespace;
//     }
    
//     getLocation() {
//         return this.#_location;
//     }
// }

const textures = new Map();
async function loadTextures() {
    const elements = document.querySelectorAll(".sprite");
    if (elements.length == 0)
        return;
    for (let i = 0; i < elements.length; ++i) {
        const element = elements[i];
        if (!(element instanceof HTMLImageElement))
            continue;
        const id = element.getAttribute("texture-id");
        try {
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = element.width;
            tempCanvas.height = element.height;
            tempCanvas.style.display = "none";
            document.body.appendChild(tempCanvas);

            const tempContext = tempCanvas.getContext("2d");
            tempContext.drawImage(element, 0, 0);

            const imageData = tempContext.getImageData(0, 0, element.width, element.height);
            if (imageData.data.length % 4 != 0)
                throw new Error("Invalid image data was provided.");

            textures.set(id, imageData);
            document.body.removeChild(tempCanvas);
        } catch(err) {
            console.error(`Failed to load texture with id '${id}'`);
            console.error(err);
        }
    }
}

let GLOBAL_SCALE = 1;
/**
 * 
 * @param {ImageData} imageData 
 * @param {number} uvX 
 * @param {number} uvY 
 * @param {number} width 
 * @param {number} height 
 * @returns 
 */
function imageFromImageData(imageData, uvX, uvY, width, height) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempContext = tempCanvas.getContext("2d");
    tempContext.putImageData(imageData, -uvX, -uvY, uvX, uvY, width, height); 
    const image = new Image();
    image.src = tempCanvas.toDataURL();
    return image;
}

const imageCache = new Map();
/**
 * @param {ImageData} textureData 
 * @param {number} uvX 
 * @param {number} uvY 
 * @param {number} posX 
 * @param {number} posY 
 * @param {number} width 
 * @param {number} height 
 */
function drawFromTexture(textureData, uvX, uvY, posX, posY, realWidth, realHeight) {
    [uvX, uvY, posX, posY, realWidth, realHeight] = [uvX, uvY, posX, posY, realWidth, realHeight].map(arg => Math.floor(arg));
    const id = (realWidth * realHeight) + (uvX + uvY);

    // TODO: scaling with GLOBAL_SCALE 
    const drawnWidth = realWidth * GLOBAL_SCALE;
    const drawnHeight = realHeight * GLOBAL_SCALE;

    if (!imageCache.has(id)) {
        // WORKAROUND for transparency
        const dataImage = imageFromImageData(textureData, uvX, uvY, realWidth, realHeight);
        context.drawImage(dataImage, posX, posY, drawnWidth, drawnHeight); 
        imageCache.set(id, dataImage);
    } else {
        const dataImage = imageCache.get(id);   
        context.drawImage(dataImage, posX, posY, drawnWidth, drawnHeight);
    }
}

let slotId = 0;
let isMouseDown = false;
function render() {
    const { width, height } = canvas;

    context.fillStyle = "blue";
    context.fillRect(0, 0, width, height);

    const WIDGETS_TEXTURE = textures.get("widgets");

    // Hotbar
    const hotbarX = (canvas.width / 2) - (182 / 2);
    const hotbarY = canvas.height - 22;
    drawFromTexture(WIDGETS_TEXTURE, 0, 0, hotbarX, hotbarY, 182, 22);

    // Hotbar Selected (slot size is 22x22 (256x256))
    drawFromTexture(WIDGETS_TEXTURE, 0, 22, hotbarX + (slotId * 20) - 1, canvas.height - 23, 24, 24);
    
    if (isMouseDown) {
        // Button (Hover/Clicked)
        drawFromTexture(WIDGETS_TEXTURE, 0, 86, (canvas.width / 2) - 100, (canvas.height / 2) - 10, 200, 20);
    } else {
        // Button (Awaiting Input)
        drawFromTexture(WIDGETS_TEXTURE, 0, 66, (canvas.width / 2) - 100, (canvas.height / 2) - 10, 200, 20);
    }

    requestAnimationFrame(render);
}

document.addEventListener("DOMContentLoaded", async function main() {
    await loadTextures()
    render()

    window.addEventListener("keydown", (ev) => {
        ev.preventDefault();
        if (ev.repeat)
            return;
        if (ev.keyCode >= 49 && ev.keyCode <= 57)
            slotId = ev.keyCode - 49;
    });
    
    canvas.addEventListener("mousedown", (ev) => {
        ev.preventDefault();
        if (ev.button != 0) 
            return;
        isMouseDown = true;
    });
    
    window.addEventListener("mouseup", (ev) => {
        ev.preventDefault();
        if (ev.button != 0) 
            return;
        isMouseDown = false;
    });
    
    canvas.addEventListener("contextmenu", (ev) => ev.preventDefault());
});