import "./style.css";
import * as engine from "./engine";

const game = new engine.Game(document.getElementById("game"), 400, 400, update);

const world = new engine.Object(0, 0, 400, 400);
const speed = 0.2;
const friction = 0.001;

const player = new engine.Object(325, 25, 40, 40).setBackground("red");
const finish = new engine.Object(15, 390, 75, 10);
const objects = [
    new engine.Object(10, 10, 300, 5)
        .setBackground("black"),
    new engine.Object(10, 10, 5, 380)
        .setBackground("black"),
    new engine.Object(385, 10, 5, 380)
        .setBackground("black"),
    new engine.Object(90, 385, 300, 5)
        .setBackground("black"),
    new engine.Object(150, 15, 5, 100)
        .setBackground("black"),
    new engine.Object(185, 255, 5, 130)
        .setBackground("black"),
    new engine.Object(15, 310, 80, 5)
        .setBackground("black"),
    new engine.Object(100, 195, 185, 5)
        .setBackground("black"),
    new engine.Object(285, 145, 5, 110)
        .setBackground("black"),
    new engine.Object(290, 145, 95, 5)
        .setBackground("black"),
    new engine.Object(290, 250, 95, 5)
        .setBackground("black"),
];

let hasWon = false;

function update(deltaT) {
    let x = 0;
    let y = 0;

    // Get player input direction
    if (game.keys["w"]) {
        y += -1
    }
    if (game.keys["a"]) {
        x += -1;
    }
    if (game.keys["s"]) {
        y += 1;
    }
    if (game.keys["d"]) {
        x += 1;
    }

    // Set player velocity
    if (x != 0 || y != 0) {
        const vector = engine.normalize(x, y);
        player.velocityX = vector.x * speed;
        player.velocityY = vector.y * speed;
    }

    // Horizontal friction
    (() => {
        const sign = Math.sign(player.velocityX);
        player.velocityX = Math.abs(player.velocityX) - (friction * deltaT);
        if (player.velocityX < 0) {
            player.velocityX = 0;
        }
        player.velocityX *= sign;
    })();

    // Vertical friction
    (() => {
        const sign = Math.sign(player.velocityY);
        player.velocityY = Math.abs(player.velocityY) - (friction * deltaT);
        if (player.velocityY < 0) {
            player.velocityY = 0;
        }
        player.velocityY *= sign;
    })();

    (() => {
        if (hasCollision("top") !== false) {
            player.velocityY = engine.clamp(player.velocityY, 0, Infinity);
            player.y -= hasCollision("top");
        }
        if (hasCollision("bottom") !== false) {
            player.velocityY = engine.clamp(player.velocityY, -Infinity, 0);
            player.y -= hasCollision("bottom");
        }
        if (hasCollision("left") !== false) {
            player.velocityX = engine.clamp(player.velocityX, 0, Infinity);
            player.x -= hasCollision("left");
        }
        if (hasCollision("right") !== false) {
            player.velocityX = engine.clamp(player.velocityX, -Infinity, 0);
            player.x -= hasCollision("right");
        }

        function hasCollision(direction) {
            const collisions = [engine.getInverseCollision(player, world)];
            objects.forEach(object => {
                collisions.push(engine.getCollision(player, object));
            });

            const value = collisions.find(item => item[direction] !== null);
            if (value) {
                return value[direction];
            }
            return false;
        }
    })();

    // Move player
    player.x += player.velocityX * deltaT;
    player.y += player.velocityY * deltaT;

    // Collision events
    (() => {
        if (engine.getCollision(player, finish).bottom && !hasWon) {
            hasWon = true;
            objects.forEach(wall => {
                wall.setBackground("lime");
            });
        }
    })();

    // Draw frame
    (() => {
        // Clear canvas
        game.ctx.clearRect(world.x, world.y, world.width, world.height);

        // Draw text
        (() => {
            game.ctx.font = "20px Arial, sans-serif";
            game.ctx.textAlign = "center";
            game.ctx.fillStyle = "black";
            game.ctx.fillText("Start", 345, 20);
            game.ctx.fillText("End", 50, 395);
        })();

        // Draw player
        game.ctx.fillStyle = player.background;
        game.ctx.fillRect(player.x, player.y, player.width, player.height);

        // Draw objects
        objects.forEach(object => {
            game.ctx.fillStyle = object.background;
            game.ctx.fillRect(object.x, object.y, object.width, object.height);
        });
    })();
}