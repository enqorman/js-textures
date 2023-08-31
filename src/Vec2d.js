export default class Vec2d {
    /**
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = parseFloat(x);
        if (isNaN(this.x))
            this.x = 0;
        this.y = parseFloat(y);
        if (isNaN(this.y))
            this.y = 0;
    }

    /**
     * @param {number} scale 
     * @returns {Vec2d}
     */
    scale(scale) {
        return this.mul(scale);
    }

    /**
     * @param {Vec2d | number} other 
     * @returns {Vec2d}
     */
    add(other) {
        if (typeof other == "number") 
            return new Vec2d(this.x + other, this.y + other);
        else
            return new Vec2d(this.x + other.x, this.y + other.y);
    }

    /**
     * @param {Vec2d | number} other 
     * @returns {Vec2d}
     */
    sub(other) {
        if (typeof other == "number") 
            return new Vec2d(this.x - other, this.y - other);
        else
            return new Vec2d(this.x - other.x, this.y - other.y);
    }

    /**
     * @param {Vec2d | number} other 
     * @returns {Vec2d}
     */
    mul(other) {
        if (typeof other == "number") 
            return new Vec2d(this.x * other, this.y * other);
        else
            return new Vec2d(this.x * other.x, this.y * other.y);
    }

    /**
     * @param {Vec2d | number} other 
     * @returns {Vec2d}
     */
    div(other) {
        if (typeof other == "number") 
            return new Vec2d(this.x / other, this.y / other);
        else
            return new Vec2d(this.x / other.x, this.y / other.y);
    }
}