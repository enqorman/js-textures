import { context } from '../index.js';
import { globalTextures, imageCache } from "./Globals.js";

export default class Texture {
    /**
     * @type {ImageData}
     */
    #_imageData;

    /**
     * @type {number}
     */
    #_width;

    /**
     * @type {number}
     */
    #_height;

    /**
     * @param {ImageData} imageData 
     * @param {number} width 
     * @param {number} height 
     */
    constructor(imageData, width, height) {
        this.#_imageData = imageData;
        this.#_width = width;
        this.#_height = height;
    }

    getImageData() {
        return this.#_imageData;
    }

    get width() {
        return this.#_width;
    }

    get height() {
        return this.#_height;
    }
}

/**
 * 
 * @param {ImageData} imageData 
 * @param {Vec2d} uv
 * @param {number} textureWidth 
 * @param {number} textureHeight 
 * @returns {Promise<HTMLImageElement>}
 */
async function imageFromImageData(imageData, uv, textureWidth, textureHeight) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = textureWidth;
    tempCanvas.height = textureHeight;
    const tempContext = tempCanvas.getContext("2d");
    if (!tempContext)
        throw new Error("Failed to get temporary context from temporary canvas in Texture#imageFromImageData!")
    tempContext.putImageData(imageData, -uv.x, -uv.y, uv.x, uv.y, textureWidth, textureHeight); 
    const image = new Image();
    image.src = tempCanvas.toDataURL();
    return image;
}

/**
 * @param {Texture} texture 
 * @param {Vec2d} uv
 * @param {Vec2d} position
 * @param {number} realWidth 
 * @param {number} realHeight 
 * @param {number} textureWidth 
 * @param {number} textureHeight 
 */
export async function drawFromTexture(texture, uv, position, realWidth, realHeight, textureWidth, textureHeight) {
    if (uv.x % 1 != 0 || uv.y % 1 != 0)
        throw new Error("uvX and uvY must be a integer, not a float!");
    const id = (textureWidth * textureHeight) + (uv.x + uv.y);  
    if (!imageCache.has(id)) {
        // WORKAROUND for transparency
        const image = await imageFromImageData(texture.getImageData(), uv, textureWidth, textureHeight);
        context.drawImage(image, position.x, position.y, realWidth, realHeight); 
        imageCache.set(id, image);
    } else {
        const image = imageCache.get(id);   
        context.drawImage(image, position.x, position.y, realWidth, realHeight);
    }
}

export async function loadTextures(textures) {
    if (textures && textures instanceof Array) {
        if (textures.length == 0)
            return;
        for (let i = 0; i < textures.length; ++i) {
            const textureLocation = textures[i];
            if (typeof textureLocation != "string")
                continue;
            // TODO: resource packs kekw lel
        }
    } else {
        const elements = document.querySelectorAll(".texture");
        if (elements.length == 0)
            return;
        for (let i = 0; i < elements.length; ++i) {
            const element = elements[i];
            if (!(element instanceof HTMLImageElement))
                continue;
            if (!element.complete)
                await element.decode()
            const id = element.getAttribute("texture-id");
            if (!id)
                throw new Error("Texture element does not have 'texture-id' attribute!");
            try {
                const tempCanvas = document.createElement("canvas");
                tempCanvas.width = element.width;
                tempCanvas.height = element.height;
                tempCanvas.style.display = "none";
                document.body.appendChild(tempCanvas);

                const tempContext = tempCanvas.getContext("2d");
                if (!tempContext)
                    throw new Error("Failed to get temporary context from temporary canvas in Texture#loadTextures!")
                tempContext.drawImage(element, 0, 0);

                const imageData = tempContext.getImageData(0, 0, element.width, element.height);
                if (imageData.data.length % 4 != 0)
                    throw new Error("Invalid image data was provided.");

                globalTextures.set(id, new Texture(imageData, element.width, element.height));
                document.body.removeChild(tempCanvas);
            } catch(err) {
                console.error(`Failed to load texture with id '${id}'`);
                console.error(err);
            }
        }
    }
}