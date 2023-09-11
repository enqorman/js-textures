/**
 * Derived from Minecraft
 */
export default class GameWindow {
    /**
     * @type {number}
     */
    #_width;

    /**
     * @type {number}
     */
    #_height;

    /**
     * @type {number}
     */
    #_scaled_width;

    /**
     * @type {number}
     */
    #_scaled_height;

    /**
     * @type {number}
     */
    #_scale_factor;

    /**
     * @param {number} width 
     * @param {number} height 
     * @param {number} guiScale 
     */
    constructor(width, height, guiScale) {
        this.#_width = parseInt(width ?? 0);
        if (isNaN(this.#_width))
            this.#_width = 0;
        this.#_height = parseInt(height ?? 0);
        if (isNaN(this.#_height))
            this.#_height = 0;
        this.#_scale_factor = 1;
        let i = guiScale == 0 ? 1000 : guiScale;
        while (this.#_scale_factor < i && this.#_width / (this.#_scale_factor + 1) >= 320 && this.#_height / (this.#_scale_factor + 1) >= 240)
            ++this.#_scale_factor;
        this.#_scaled_width = this.#_width / this.#_scale_factor;
        this.#_scaled_height = this.#_height / this.#_scale_factor;
        this.#_width = Math.ceil(this.#_scaled_width);
        this.#_height = Math.ceil(this.#_scaled_height);
    }

    /**
     * @returns {number}
     */
	getWidth() {
		return this.#_width;
	}

    /**
     * @returns {number}
     */
	getHeight() {
		return this.#_height;
	}

    /**
     * @returns {number}
     */
	getScaledWidth() {
		return this.#_scaled_width;
	}

    /**
     * @returns {number}
     */
	getScaledHeight() {
		return this.#_scaled_height;
	}

    /**
     * @returns {number}
     */
	getScaleFactor() {
		return this.#_scale_factor;
	}
}
