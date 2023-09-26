export class Game {
    keys = {};

    constructor(canvas, update) {
        this.ctx = canvas.getContext("2d");

        let previous = 0;
        function frame(time) {
            const deltaT = time - previous;
            previous = time;
            resize();
            update(deltaT);
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);

        function resize() {
            const w = canvas.clientWidth;
            const h = canvas.clientHeight;
            if (canvas.width != w || canvas.height != h) {
                canvas.width = w;
                canvas.height = h;
            }
        }

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

    setBackground(color) {
        this.background = color;
        return this;
    }
}

export function getCollision(object1, object2, offsetX = 0, offsetY = 0) {
    const bound1 = object1.bounds;
    const bound2 = object2.bounds;
    const above = bound1.x2 > bound2.x1 && bound1.x1 < bound2.x2;
    const beside = bound1.y2 > bound2.y1 && bound1.y1 < bound2.y2;
    bound1.y1 += offsetY;
    bound1.y2 += offsetY;
    bound1.x1 += offsetX;
    bound1.x2 += offsetX;
    return {
        top: bound1.y1 <= bound2.y2 && bound1.y1 >= bound2.y1 && above,
        bottom: bound1.y2 >= bound2.y1 && bound1.y2 <= bound2.y2 && above,
        left: bound1.x1 <= bound2.x2 && bound1.x1 >= bound2.x1 && beside,
        right: bound1.x2 >= bound2.x1 && bound1.x2 <= bound2.x2 && beside,
        contact: {
            top: bound2.y2,
            bottom: bound2.y1 - object1.height,
            left: bound2.x2,
            right: bound2.x1 - object1.width,
        },
    }
}

export function getInverseCollision(object1, object2, offsetX = 0, offsetY = 0) {
    const bound1 = object1.bounds;
    const bound2 = object2.bounds;
    bound1.y1 += offsetY;
    bound1.y2 += offsetY;
    bound1.x1 += offsetX;
    bound1.x2 += offsetX;
    return {
        top: bound1.y1 <= bound2.y1,
        bottom: bound1.y2 >= bound2.y2,
        left: bound1.x1 <= bound2.x1,
        right: bound1.x2 >= bound2.x2,
        contact: {
            top: bound2.y1,
            bottom: bound2.y2 - object1.height,
            left: bound2.x1,
            right: bound2.x2 - object1.width,
        },
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