// canvas variables
var canvas, ctx;


// defines the position of the player in the viewport (viewX and viewY), the number of tiles in the
// viewport (vWidth + 1, vHeight + 1) and the size of the tiles
var viewX, viewY;

// Declares the players
var players = [];

// Declares the military bases
var bases = [];

// Declares the bombs
var bombs = [];

// Declares the bullets
var bullets = [];

// Declares the background
var backgroundImage;

// Declares the frames per second and the time to use as interval for rendering
var fps = 24;
var timeRender = 1 / fps;

// Dimensions in pixels for the world 
var worldWidth = 1920;
var worldHeight = 1080;

// Defines the gravity
var gravity = 100;


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
    players.push(new Bomber(0, 0, 80, 40, document.getElementById("bomber1"), 300, 300, 6));
    bases.push(new Base(400, 400, 100, 100, document.getElementById("base1")));

    var keyMap = [];
    onkeydown = onkeyup = function(e) {
        e = e || event; // to deal with IE
        keyMap[e.keyCode] = e.type == 'keydown';
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

    function render() {

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

        // Draws every object and check for collisions
        backgroundImage.draw();

        bases.forEach(function(base) {
            base.draw();
            players.forEach(function(player) {
                player.draw();
                if (detectCollision(base, player)) {
                    base.collide(player.damage);
                    player.collide(base.damage);
                }
            }, this);
            bombs.forEach(function(bomb, bombKey) {
                if (detectCollision(base, bomb)) {
                    base.collide(bomb.damage);
                    bomb.collide(base.damage);
                    setTimeout(function() {
                        bombs.splice(bombKey, 1);
                    }, 1000);
                }
                bomb.draw();
            }, this);
            bullets.forEach(function(bullet, bulletKey) {
                if (detectCollision(base, bullet)) {
                    base.collide(bullet.damage);
                    bullet.collide(base.damage);
                    setTimeout(function() {
                        bullets.splice(bulletKey, 1);
                    }, 1000);
                }
                bullet.draw();
            }, this);

        }, this);
    }

    // Starts rendering the game and keeps going with the given fps
    window.setInterval(render, timeRender * 1000);

});