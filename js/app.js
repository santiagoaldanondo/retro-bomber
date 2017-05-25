// canvas variables
var canvas, ctx;


// defines the position of the player in the viewport (vX and vY), the number of tiles in the
// viewport (vWidth + 1, vHeight + 1) and the size of the tiles
var vX, vY, vTileSize;

// Declares the players
var players = [];

// Declares the frames per second and the time to use as interval for rendering
var fps = 60;
var timeRender = 1 / fps;

// Dimensions in pixels for the world 
var worldWidth = 300;
var worldHeight = 1200;


// When document is ready
$(document).ready(function() {

    // Create canvas
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    // Canvas elements are not focusable by default. You need to set a tabIndex for it first.
    canvas.tabIndex = 0;
    canvas.focus();

    // Set the size of the tiles in the viewport
    vTileSize = 35;

    // Set the size of the canvas.
    canvas.width = 600;
    canvas.height = 300;

    // The number of tiles in the viewport depend on the canvas size through the size of each tile
    // vWidth = Math.floor(canvas.width / vTileSize - 1);
    // vHeight = Math.floor(canvas.height / vTileSize - 1);


    // Set initial position in the viewport
    vX = 0;
    vY = 0;

    // Push a new player into the array
    players.push(new Bomber(0, 0, document.getElementById("airplane1"), 100, 5));


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
            players[0].accelerate();
        }

    }

    function render() {

        // Clears the whole viewport
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Determine the "best" viewport.
        // Ideally the viewport centers the player, if it is too close to the edge correct it to 0
        console.log(vX + "-" + vY);
        vX = players[0].x - 0.5 * canvas.width;
        if (vX < 0) {
            vX = 0;
        }
        if (vX + canvas.width > worldWidth) {
            vX = worldWidth - canvas.width;
        }

        vY = players[0].y - canvas.height;
        if (vY < 0) {
            vY = 0;
        }
        if (vY + canvas.height > worldHeight) {
            vY = worldHeight - canvas.height;
        }

        // Draws the players after updating speed and position
        players[0].updateSpeed();
        players[0].updatePosition();
        drawRotatedImage(players[0]);
    }

    function drawRotatedImage(bomber) {

        // save the current co-ordinate system
        ctx.save();

        // move to the middle of where we want to draw our image
        ctx.translate(bomber.x +
            vTileSize / 2 - vX,
            bomber.y + vTileSize / 2 - vY);

        // rotate around that point, converting the angle from degrees to radians
        ctx.rotate(bomber.direction * Math.PI / 180);

        // draw it up and to the left by half the width and height of the image
        ctx.drawImage(bomber.image, -vTileSize / 2, -vTileSize / 2, vTileSize * 2, vTileSize);

        // Restore the co-ords to how they were before
        ctx.restore();
    }

    // Starts rendering the game and keeps going with the given fps
    window.setInterval(render, timeRender * 1000);

});