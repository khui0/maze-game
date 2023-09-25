import "./style.css";
import * as engine from "./engine";

const game = new engine.Game(document.getElementById("game"), 400, 400, update);

const world = new engine.Object(0, 0, 400, 400);
const speed = 0.2;
const friction = 0.001;

const player = new engine.Object(325, 25, 40, 40).setBackground("red");
const finish = new engine.Object(15, 390, 75, 10).setBackground("blue");
const objects = [
    new engine.Object(150, 15, 5, 100)
        .setBackground("black"),
];
const draw = [
    player,
    ...objects,
    finish,
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

    // Friction
    player.velocityX = engine.clamp(Math.abs(player.velocityX) - (friction * deltaT), 0, Infinity) * Math.sign(player.velocityX);
    player.velocityY = engine.clamp(Math.abs(player.velocityY) - (friction * deltaT), 0, Infinity) * Math.sign(player.velocityY);

    // Collisions
    (() => {
        const collisions = [engine.getInverseCollision(player, world)];
        objects.forEach(object => {
            collisions.push(engine.getCollision(player, object));
        });

        // console.log(engine.getCollision(player, objects[0]));
        if (hasCollision("top")) {
            player.velocityY = engine.clamp(player.velocityY, 0, Infinity);
        }
        if (hasCollision("bottom")) {
            player.velocityY = engine.clamp(player.velocityY, -Infinity, 0);
        }
        if (hasCollision("left")) {
            player.velocityX = engine.clamp(player.velocityX, 0, Infinity);
        }
        if (hasCollision("right")) {
            player.velocityX = engine.clamp(player.velocityX, -Infinity, 0);
        }

        function hasCollision(direction) {
            return collisions.some(item => item[direction]);
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

        // Draw objects
        draw.forEach(object => {
            game.ctx.fillStyle = object.background;
            game.ctx.fillRect(object.x, object.y, object.width, object.height);
        });
    })();
}