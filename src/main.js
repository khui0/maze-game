import "./style.css";
import * as engine from "./engine";

const game = new engine.Game(document.getElementById("game"), update);
const camera = new engine.Camera(game.ctx.canvas, 0, 0, 200, 0.05);

const world = new engine.Object(0, 0, 400, 400);
const speed = 0.2;
const friction = 0.001;

const player = new engine.Object(325, 25, 40, 40).setBackground("red");
const finish = new engine.Object(15, 390, 75, 10);
const walls = [
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
const draw = [
    player,
    ...walls,
    finish,
];

let fpsCounter = true;
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

    // Friction
    player.velocityX = engine.clamp(Math.abs(player.velocityX) - (friction * deltaT), 0, Infinity) * Math.sign(player.velocityX);
    player.velocityY = engine.clamp(Math.abs(player.velocityY) - (friction * deltaT), 0, Infinity) * Math.sign(player.velocityY);

    // Collisions
    (() => {
        const collisions = [engine.getInverseCollision(player, world)];
        walls.forEach(object => {
            collisions.push(engine.getCollision(player, object, player.velocityX * deltaT, player.velocityY * deltaT));
        });

        if (hasCollision("top") != -1) {
            player.velocityY = engine.clamp(player.velocityY, 0, Infinity);
            player.y = collisions[hasCollision("top")].contact.top;
        }
        else if (hasCollision("bottom") != -1) {
            player.velocityY = engine.clamp(player.velocityY, -Infinity, 0);
            player.y = collisions[hasCollision("bottom")].contact.bottom;
        }
        if (hasCollision("left") != -1) {
            player.velocityX = engine.clamp(player.velocityX, 0, Infinity);
            player.x = collisions[hasCollision("left")].contact.left;
        }
        else if (hasCollision("right") != -1) {
            player.velocityX = engine.clamp(player.velocityX, -Infinity, 0);
            player.x = collisions[hasCollision("right")].contact.right;
        }

        function hasCollision(direction) {
            return collisions.findIndex(item => item[direction]);
        }
    })();

    // Move player
    player.x += player.velocityX * deltaT;
    player.y += player.velocityY * deltaT;

    // Move camera
    camera.x = player.x + player.width / 2;
    camera.y = player.y + player.height / 2;

    // Collision events
    (() => {
        if (engine.getCollision(player, finish).bottom && !hasWon) {
            hasWon = true;
            walls.forEach(wall => {
                wall.setBackground("lime");
            });
        }
    })();

    // Draw frame
    (() => {
        // Clear canvas
        game.ctx.clearRect(0, 0, game.ctx.canvas.width, game.ctx.canvas.height);

        // Draw text
        game.ctx.font = `${20 * camera.ratio}px monospace, monospace`;
        game.ctx.textAlign = "center";
        game.ctx.textBaseline = "alphabetic";
        game.ctx.fillStyle = "black";
        const startCoords = camera.toScreen(345, 20);
        const endCoords = camera.toScreen(50, 395);
        game.ctx.fillText("Start", startCoords.x, startCoords.y);
        game.ctx.fillText("End", endCoords.x, endCoords.y);

        // Draw objects
        draw.forEach(object => {
            const bounds = object.bounds;
            const a = camera.toScreen(bounds.x1, bounds.y1);
            const b = camera.toScreen(bounds.x2, bounds.y2);
            bounds.x1 = a.x;
            bounds.y1 = a.y;
            bounds.x2 = b.x;
            bounds.y2 = b.y;
            game.ctx.fillStyle = object.background || "transparent";
            game.ctx.fillRect(bounds.x1, bounds.y1, bounds.x2 - bounds.x1, bounds.y2 - bounds.y1);
        });

        // Draw fps
        if (fpsCounter) {
            const fps = (1000 / deltaT).toFixed(2);
            game.ctx.font = `20px monospace, monospace`;
            game.ctx.textAlign = "left";
            game.ctx.textBaseline = "hanging";
            game.ctx.fillStyle = "lime";
            game.ctx.fillText(`${fps} FPS`, 10, 10);
        }
    })();
}