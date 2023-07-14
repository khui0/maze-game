import "./style.css";
import * as engine from "./engine";
import * as ui from "./ui.js";

const game = new engine.Game(document.getElementById("game"), 400, 400, update);

// World constants
const world = new engine.Object(0, 0, game.width, game.height);
const speed = 0.25;
const friction = 0.005;

const player = new engine.Object(325, 25, 40, 40).setBackground("red");
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
        player.velocityY = -speed;
    }

    if (game.keys["a"]) {
        player.velocityX = -speed;
    }

    if (game.keys["s"]) {
        player.velocityY = speed;
    }

    if (game.keys["d"]) {
        player.velocityX = speed;
    }

    // Move player
    if (!hasCollision("left") && !hasCollision("right")) {
        const direction = player.velocityX / Math.abs(player.velocityX);
        player.velocityX = Math.abs(player.velocityX) - friction * deltaT;
        if (player.velocityX < 0) {
            player.velocityX = 0;
        }
        player.velocityX *= direction || 0;
        player.x += player.velocityX * deltaT;
    }

    if (!hasCollision("top") && !hasCollision("bottom")) {
        const direction = player.velocityY / Math.abs(player.velocityY);
        player.velocityY = Math.abs(player.velocityY) - friction * deltaT;
        if (player.velocityY < 0) {
            player.velocityY = 0;
        }
        player.velocityY *= direction || 0;
        player.y += player.velocityY * deltaT;
    }

    player.round();

    // Draw
    (() => {
        game.ctx.clearRect(world.x, world.y, world.width, world.height);

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