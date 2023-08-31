import { context } from '../index.js';
import { drawFromTexture } from './Texture.js';
import { globalTextures, guiScale } from './Global.js';
import Vec2d from "./Vec2d.js";

export default class Button {
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

    /**
     * @returns {boolean}
     */
    inBounds(vec2d) {
        const width = this.width * guiScale;
        const height = this.height * guiScale;
        const pos = this.pos.scale(guiScale);
        return (vec2d.x >= pos.x && vec2d.x <= pos.x + width) && 
                (vec2d.y >= pos.y && vec2d.y <= pos.y + height);
    }

    async render() {
        const width = this.width * guiScale;
        const height = this.height * guiScale;
        const pos = this.pos.scale(guiScale);

        const WIDGETS_TEXTURE = globalTextures.get("widgets");
        const buttonY = this.disabled ? 46 : ((this.pressed || this.hovered) ? 86 : 66);
        await drawFromTexture(WIDGETS_TEXTURE, new Vec2d(0, buttonY), pos, width, height, 200, 20);

        const fontSize = 14;
        context.fillStyle = this.disabled ? "grey" : (this.pressed ? "white": (this.hovered ? "yellow" : "white"));
        context.font = fontSize + "px Mojangles";
        const textMeasurement = context.measureText(this.text);
        // todo: fix font Y
        context.fillText(this.text, pos.x + (width / 2) - (textMeasurement.width / 2), pos.y + (height / 2) + (fontSize / 2) - 2, width);
    }
}