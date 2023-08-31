/**
 * @type {HTMLCanvasElement | undefined}
 */
const canvas = document.getElementById("main");
if (!canvas) 
    throw new Error("Could not find canvas!");

const context = canvas.getContext("2d");
if (!context)
    throw new Error("Could not get 2d context from canvas");

class Vec2d {
    constructor(x, y) {
        this.x = parseFloat(x);
        if (isNaN(this.x))
            this.x = 0;
        this.y = parseFloat(y);
        if (isNaN(this.y))
            this.x = 0;
    }
}

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

const globalTextures = new Map();
async function loadTextures(textures) {
    if (textures && textures instanceof Array) {
        if (textures.length == 0)
            return;
        for (let i = 0; i < textures.length; ++i) {
            const textureLocation = textures[i];
            if (typeof textureLocation != "string")
                continue;
            // TODO: resource packs kekw
        }
    } else {
        const elements = document.querySelectorAll(".sprite");
        if (elements.length == 0)
            return;
        for (let i = 0; i < elements.length; ++i) {
            const element = elements[i];
            if (!(element instanceof HTMLImageElement))
                continue;
            if (!element.complete)
                await element.decode()
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

                globalTextures.set(id, imageData);
                document.body.removeChild(tempCanvas);
            } catch(err) {
                console.error(`Failed to load texture with id '${id}'`);
                console.error(err);
            }
        }
    }
}

// WIP
let GLOBAL_SCALE = 1;
/**
 * 
 * @param {ImageData} imageData 
 * @param {Vec2d} uvPos
 * @param {number} width 
 * @param {number} height 
 * @returns 
 */
function imageFromImageData(imageData, uvPos, textureWidth, textureHeight) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = textureWidth;
    tempCanvas.height = textureHeight;
    const tempContext = tempCanvas.getContext("2d");
    tempContext.putImageData(imageData, -uvPos.x, -uvPos.y, uvPos.x, uvPos.y, textureWidth, textureHeight); 
    const image = new Image();
    image.src = tempCanvas.toDataURL();
    return image;
}

const imageCache = new Map();
/**
 * @param {ImageData} textureData 
 * @param {Vec2d} uvPos
 * @param {Vec2d} pos
 * @param {number} width 
 * @param {number} height 
 */
function drawFromTexture(textureData, uvPos, pos, realWidth, realHeight, textureWidth, textureHeight) {
    if (uvPos.x % 1 != 0 || uvPos.y % 1 != 0)
        throw new Error("uvX and uvY must be a integer, not a float!");
    const id = (textureWidth * textureHeight) + (uvPos.x + uvPos.y);  

    // TODO: scaling with GLOBAL_SCALE 
    const drawnWidth = realWidth * GLOBAL_SCALE;
    const drawnHeight = realHeight * GLOBAL_SCALE;
    if (!imageCache.has(id)) {
        // WORKAROUND for transparency
        const dataImage = imageFromImageData(textureData, uvPos, textureWidth, textureHeight);
        context.drawImage(dataImage, pos.x, pos.y, drawnWidth, drawnHeight); 
        imageCache.set(id, dataImage);
    } else {
        const dataImage = imageCache.get(id);   
        context.drawImage(dataImage, pos.x, pos.y, drawnWidth, drawnHeight);
    }
}

let slotId = 0;
let invertedScrollwheel = false;
function invertScrollwheel() {
    invertedScrollwheel = !invertedScrollwheel;
}

class Button {
    /** 
     * @param {string} text 
     * @param {Vec2d} pos 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(text, pos, width, height) {
        this.text = text;
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.disabled = false;
        this.pressed = false;
        this.hovered = false;
    }

    render() {
        const WIDGETS_TEXTURE = globalTextures.get("widgets");
        const buttonY = (this.pressed || this.hovered) ? 86 : (this.disabled ? 46 : 66);
        drawFromTexture(WIDGETS_TEXTURE, new Vec2d(0, buttonY), this.pos, this.width, this.height, 200, 20);

        const fontSize = 14;
        context.fillStyle = this.disabled ? "grey" : (this.pressed ? "white": (this.hovered ? "yellow" : "white"));
        context.font = fontSize + "px Mojangles";
        const textMeasurement = context.measureText(this.text);
        // todo: fix font Y
        context.fillText(this.text, this.pos.x + (this.width / 2) - (textMeasurement.width / 2), this.pos.y + (this.height / 2) + (fontSize / 2) - 2, this.width);
    }
}

const button = new Button("Button", new Vec2d(0, 0), 200, 20);
function render() {
    const { width, height } = canvas;

    context.fillStyle = "blue";
    context.fillRect(0, 0, width, height);

    const WIDGETS_TEXTURE = globalTextures.get("widgets");

    // Hotbar
    const hotbarX = (canvas.width / 2) - (182 / 2);
    drawFromTexture(WIDGETS_TEXTURE, new Vec2d(0, 0), new Vec2d(hotbarX, canvas.height - 22), 182, 22, 182, 22);

    // Hotbar Selected (slot size is 22x22 (256x256))
    drawFromTexture(WIDGETS_TEXTURE, new Vec2d(0, 22), new Vec2d(hotbarX + (slotId * 20) - 1, canvas.height - 23), 24, 24, 24, 24);
    
    button.pos = new Vec2d((canvas.width / 2) - (button.width / 2), (canvas.height / 2) - (button.height / 2));
    button.render();
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
    
    canvas.addEventListener("mousewheel", (ev) => {
        ev.preventDefault();
        const v = invertedScrollwheel ? -1 : 1;
        slotId = (slotId + (ev.deltaY < 0 ? v : -v) + 9) % 9;
    });

    canvas.addEventListener("mousedown", (ev) => {
        ev.preventDefault();
        if (ev.button != 0) 
            return;
        const { offsetX: x, offsetY: y } = ev;
        if ((x >= button.pos.x && x <= button.pos.x + button.width) && (y >= button.pos.y && y <= button.pos.y + button.height))
            button.pressed = true;
    });
    
    canvas.addEventListener("mouseup", (ev) => {
        ev.preventDefault();
        if (ev.button != 0) 
            return;
        button.pressed = false;
    });

    canvas.addEventListener("mousemove", (ev) => {
        ev.preventDefault();
        const { offsetX: x, offsetY: y } = ev;
        if ((x >= button.pos.x && x <= button.pos.x + button.width) && (y >= button.pos.y && y <= button.pos.y + button.height))
            button.hovered = true;
        else 
            button.hovered = false;
    });
    
    canvas.addEventListener("contextmenu", (ev) => ev.preventDefault());
});