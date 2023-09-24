export class Game {
    keys = {};

    constructor(canvas, width, height, update) {
        this.ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;

        let previous = 0;
        function frame(time) {
            const deltaT = time - previous;
            previous = time;
            update(deltaT);
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);

        document.addEventListener("keydown", e => {
            this.keys[e.key] = true;
        });

        document.addEventListener("keyup", e => {
            this.keys[e.key] = false;
        });
    }
}

export class Object {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.velocityY = 0;
    }

    get bounds() {
        return {
            x1: this.x,
            y1: this.y,
            x2: this.x + this.width,
            y2: this.y + this.height,
        }
    }

    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }

    setBackground(color) {
        this.background = color;
        return this;
    }
}

export function getCollision(object1, object2) {
    const bound1 = object1.bounds;
    const bound2 = object2.bounds;
    const above = bound1.x2 > bound2.x1 && bound1.x1 < bound2.x2;
    const beside = bound1.y2 > bound2.y1 && bound1.y1 < bound2.y2;
    return {
        top: bound1.y1 <= bound2.y2 && bound1.y1 >= bound2.y1 && above ? bound1.y1 - bound2.y2 : null,
        bottom: bound1.y2 >= bound2.y1 && bound1.y2 <= bound2.y2 && above ? bound1.y2 - bound2.y1 : null,
        left: bound1.x1 <= bound2.x2 && bound1.x1 >= bound2.x1 && beside ? bound1.x1 - bound2.x2 : null,
        right: bound1.x2 >= bound2.x1 && bound1.x2 <= bound2.x2 && beside ? bound1.x2 - bound2.x1 : null,
    }
}

export function getInverseCollision(object1, object2) {
    const bound1 = object1.bounds;
    const bound2 = object2.bounds;
    return {
        top: bound1.y1 <= bound2.y1 ? bound1.y1 - bound2.y1 : null,
        bottom: bound1.y2 >= bound2.y2 ? bound1.y2 - bound2.y2 : null,
        left: bound1.x1 <= bound2.x1 ? bound1.x1 - bound2.x1 : null,
        right: bound1.x2 >= bound2.x2 ? bound1.x2 - bound2.x2 : null,
    }
}

export function normalize(x, y) {
    const length = Math.sqrt(x ** 2 + y ** 2);
    return {
        x: x / length || 0,
        y: y / length || 0,
    };
}

export function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}