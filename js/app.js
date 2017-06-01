// Declare global variables to avoid no-undef errors from Eslint:
/*global Background Bomber Base players bases detectCollision:true*/

// canvas variables
var canvas, ctx;

// defines the position of the player in the viewport (viewX and viewY), the number of tiles in the
// viewport (vWidth + 1, vHeight + 1) and the size of the tiles
var viewX, viewY;

// Declares the background
var backgroundImage;

// Declares the frames per second and the time to use as interval for rendering
var fps = 24;
var timeRender = 1 / fps;

// Dimensions in pixels for the world
var worldWidth = 1920;
var worldHeight = 1080;

// When document is ready
$(document).ready(function() {

    // Create canvas
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    // Canvas elements are not focusable by default. You need to set a tabIndex for it first.
    canvas.tabIndex = 0;
    canvas.focus();

    // Set the size of the canvas.
    canvas.width = 1300;
    canvas.height = 650;

    // Set initial position in the viewport
    viewX = 0;
    viewY = 0;

    // Assign value to the backgroundImage, and populate players and bases
    backgroundImage = new Background(0, 0, document.getElementById("garden"));
    players.push(new Bomber(40, worldHeight - 20, 80, 40, document.getElementById("bomber1"), 600, 600, 6));
    bases.push(new Base(400, worldHeight - 100, 100, 100, document.getElementById("base1")));
    bases.push(new Base(600, worldHeight - 100, 100, 100, document.getElementById("base1")));
    bases.push(new Base(800, worldHeight - 100, 100, 100, document.getElementById("base1")));
    bases.push(new Base(1000, worldHeight - 100, 100, 100, document.getElementById("base1")));
    bases.push(new Base(1200, worldHeight - 100, 100, 100, document.getElementById("base1")));
    bases.push(new Base(1400, worldHeight - 100, 100, 100, document.getElementById("base1")));
    bases.push(new Base(1600, worldHeight - 100, 100, 100, document.getElementById("base1")));

    // Create an array to keep the keys that are pressed
    var keyMap = [];

    // Use the onkeydown and onkeup events to modify the values on the keyMap array:
    // onkeydown turns it true and onkeyup turns it false. Otherwise it is undefined

    window.onkeydown = window.onkeyup = function(e) {
        e = e || event; // to deal with IE
        keyMap[e.keyCode] = e.type == "keydown";

    }

    // Check the values of the keyMap array. It will be called inside the render function.
    // Calling it inside the onkeydown or onkeyup generated some bugs when pressing multiple keys
    // and releasing one of them
    function manageKeys() {
        if (keyMap[38] === true) { // key = up arrow
            players[0].turn(players[0].agility);
        }
        if (keyMap[40] === true) { // key = down arrow
            players[0].turn(-players[0].agility);
        }
        if (keyMap[39] === true) { // key = right arrow
            players[0].accelerate();
        }
        if (keyMap[37] === true) { // key = left arrow
            players[0].brake();
        }
        if (keyMap[66] === true) { // key = left arrow
            players[0].throwBomb();
        }
        if (keyMap[32] === true) { // key = left arrow
            players[0].shootBullet();
        }
    }

    function isOutOfBorders(object) {
        return object.x < 0 || object.y < 0 || object.x > worldWidth || object.y > worldHeight;
    }

    function render() {

        // Call the manageKeys function to run the methods corresponding to every key that is pressed
        manageKeys();

        // Clears the whole viewport
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Determine the "best" viewport.
        // Ideally the viewport centers the player, if it is too close to the edge correct it to 0
        viewX = players[0].x - 0.5 * canvas.width;
        if (viewX < 0) {
            viewX = 0;
        }
        if (viewX + canvas.width > worldWidth) {
            viewX = worldWidth - canvas.width;
        }

        viewY = players[0].y - 0.5 * canvas.height;
        if (viewY < 0) {
            viewY = 0;
        }
        if (viewY + canvas.height > worldHeight) {
            viewY = worldHeight - canvas.height;
        }

        // Draws the background
        backgroundImage.draw();

        // Check for collisions for each base
        bases.forEach(function(base) {
            base.shootBullet();

            players.forEach(function(player) {
                if (detectCollision(base, player)) {
                    base.collide(player, undefined);
                    player.collide(base, undefined);
                }
                player.bombs.forEach(function(bomb, bombKey) {
                    if (isOutOfBorders(bomb)) {
                        bomb.collide(base, undefined);
                        bomb = null;
                        player.bombs.splice(bombKey, 1);
                    } else if (detectCollision(base, bomb)) {
                        base.collide(bomb, player);
                        bomb.collide(base, undefined);
                        bomb = null;
                        player.bombs.splice(bombKey, 1);
                    }

                }, this);
                player.bullets.forEach(function(bullet, bulletKey) {
                    if (isOutOfBorders(bullet)) {
                        bullet.collide(base, undefined);
                        bullet = null;
                        player.bullets.splice(bulletKey, 1);
                    } else if (detectCollision(base, bullet) || isOutOfBorders(bullet)) {
                        base.collide(bullet, player);
                        bullet.collide(base, undefined);
                        bullet = null;
                        player.bullets.splice(bulletKey, 1);
                    }
                }, this);
            }, this);
        }, this);

        // Draws every object
        bases.forEach(function(base) {
            base.draw();
            base.bombs.forEach(function(bomb) {
                bomb.draw();
            }, this);
            base.bullets.forEach(function(bullet) {
                bullet.draw();
            }, this);
        }, this);

        players.forEach(function(player) {
            player.draw();
            player.bombs.forEach(function(bomb) {
                bomb.draw();
            }, this);
            player.bullets.forEach(function(bullet) {
                bullet.draw();
            }, this);
        }, this);

    }

    // Starts rendering the game and keeps going with the given fps
    window.setInterval(render, timeRender * 1000);

});
