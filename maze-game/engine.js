export class Game {
    #time = Date.now();
    #deltaT = 0;
    keys = {};

    constructor(canvas, width, height, update) {
        this.ctx = canvas.getContext("2d");
        this.width = width;
        this.height = height;

        canvas.width = width;
        canvas.height = height;

        setInterval(() => {
            this.#deltaT = Date.now() - this.#time;
            this.#time = Date.now();
            update(this.#deltaT);
        }, 1);

        document.addEventListener("keydown", e => {
            this.keys[e.key] = true;
        });

        document.addEventListener("keyup", e => {
            this.keys[e.key] = false;
        });
    }

    getInverseCollision = (object1, object2) => {
        const bound1 = object1.bounds;
        const bound2 = object2.bounds;
        const velocityX = object1.velocityX;
        const velocityY = object1.velocityY;
        return {
            "top": bound1.y1 + velocityY * this.#deltaT <= bound2.y1,
            "bottom": bound1.y2 + velocityY * this.#deltaT >= bound2.y2,
            "left": bound1.x1 + velocityX * this.#deltaT <= bound2.x1,
            "right": bound1.x2 + velocityX * this.#deltaT >= bound2.x2,
        }
    }

    getCollision = (object1, object2) => {
        const bound1 = object1.bounds;
        const bound2 = object2.bounds;
        const velocityX = object1.velocityX;
        const velocityY = object1.velocityY;
        const above = bound1.x2 > bound2.x1 && bound1.x1 < bound2.x2;
        const beside = bound1.y2 > bound2.y1 && bound1.y1 < bound2.y2;
        return {
            "top": bound1.y1 + velocityY * this.#deltaT <= bound2.y2 && bound1.y1 + velocityY * this.#deltaT >= bound2.y1 && above,
            "bottom": bound1.y2 + velocityY * this.#deltaT >= bound2.y1 && bound1.y2 + velocityY * this.#deltaT <= bound2.y2 && above,
            "left": bound1.x2 + velocityX * this.#deltaT >= bound2.x1 && bound1.x2 + velocityX * this.#deltaT <= bound2.x2 && beside,
            "right": bound1.x1 + velocityX * this.#deltaT <= bound2.x2 && bound1.x1 + velocityX * this.#deltaT >= bound2.x1 && beside,
        }
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