export default class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    get angle() {
        return Math.atan2(this.y, this.x);
    }

    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    divide(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    normalize() {
        return this.divide(Math.max(.0001, this.magnitude));
    }

    addDirection(angle, magnitude) {
        this.x += magnitude * Math.cos(angle);
        this.y += magnitude * Math.sin(angle);
        return this;
    }
    
    zero() {
        this.x = 0;
        this.y = 0;
        return this;
    }
}