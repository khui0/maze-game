import "./style.css";
import * as engine from "./engine";

const game = new engine.Game(document.getElementById("game"), 400, 400, update);

let hasWon = false;

const world = new engine.Object(0, 0, game.width, game.height);
const speed = 0.25;
const friction = 0.005;

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

function update(deltaT) {
    const collision = [game.getInverseCollision(player, world)];
    objects.forEach(object => {
        collision.push(game.getCollision(player, object));
    });

    player.velocityX = 0;
    player.velocityY = 0;

    // Player inputs
    if (game.keys["w"]) {
        player.velocityY += -speed;
    }

    if (game.keys["a"]) {
        player.velocityX += -speed;
    }

    if (game.keys["s"]) {
        player.velocityY += speed;
    }

    if (game.keys["d"]) {
        player.velocityX += speed;
    }

    const vector = engine.normalize(player.velocityX, player.velocityY);
    player.velocityX = vector.x * speed;
    player.velocityY = vector.y * speed;

    // Move player
    if (!hasCollision("left") && !hasCollision("right")) {
        const sign = Math.sign(player.velocityX)
        player.velocityX = Math.abs(player.velocityX) - friction * deltaT;
        if (player.velocityX < 0) {
            player.velocityX = 0;
        }
        player.velocityX *= sign || 0;
        player.x += player.velocityX * deltaT;
    }

    if (!hasCollision("top") && !hasCollision("bottom")) {
        const sign = Math.sign(player.velocityY);
        player.velocityY = Math.abs(player.velocityY) - friction * deltaT;
        if (player.velocityY < 0) {
            player.velocityY = 0;
        }
        player.velocityY *= sign || 0;
        player.y += player.velocityY * deltaT;
    }

    player.round();

    // Collision events
    (() => {
        if (game.getCollision(player, finish).bottom && !hasWon) {
            hasWon = true;
            objects.forEach(wall => {
                wall.setBackground("lime");
            });
            // Alert win
        }
    })();

    // Draw
    (() => {
        game.ctx.clearRect(world.x, world.y, world.width, world.height);

        // Draw text
        (() => {
            game.ctx.font = "20px Arial, sans-serif";
            game.ctx.textAlign = "center";
            game.ctx.fillStyle = "black";
            game.ctx.fillText("Start", 345, 20);
            game.ctx.fillText("End", 50, 395);
        })();

        game.ctx.fillStyle = player.background;
        game.ctx.fillRect(player.x, player.y, player.width, player.height);

        objects.forEach(object => {
            game.ctx.fillStyle = object.background;
            game.ctx.fillRect(object.x, object.y, object.width, object.height);
        });
    })();

    function hasCollision(direction) {
        return collision.some(item => item[direction] == true);
    }
}