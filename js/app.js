// Declare global variables to avoid no-undef errors from Eslint:
/*global explosions players detectCollision ion Explosion Level Bomber1 Bomber2 Bomber3:true*/

// CREATE GLOBAL VARIABLES

// Declares the level (will be an instance of the class Level) and the levelNumber
var level;
var levelNumber = 0;

// Declares the variable gameInterval in order to be able to clear it when you finish a level
var gameInterval;

// canvas variables
var canvas, ctx;

// defines the position of the player in the viewport (viewX and viewY), the number of tiles in the
// viewport (vWidth + 1, vHeight + 1) and the size of the tiles
var viewX, viewY;


// Declares the frames per second and the time to use as interval for rendering
var fps = 24;
var timeRender = 1 / fps;

// Create a variable to prevent bombs from being thrown with a single click of the button. You must
// release it and click it again in order to throw a second bomb
var isBombPressed = false;

// Create canvas. As canvas elements are not focusable by default you set a tabIndex for it first.
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.tabIndex = 0;
canvas.focus();

// Create an array to keep the keys that are pressed
var keyMap = [];

// Use the onkeydown and onkeyup events to modify the values on the keyMap array:
// onkeydown turns it true and onkeyup turns it false. Otherwise it is undefined
window.onkeydown = function(e) {
    e = e || event; // to deal with IE
    keyMap[e.keyCode] = e.type == "keydown";

    // If the key is the "B" used to throw bombs...
    if (e.keyCode === 66) {
        if (!isBombPressed) {
            isBombPressed = true;
        } else {
            keyMap[e.keyCode] = false;
        }
    }
    keyMap[e.keyCode]
}

window.onkeyup = function(e) {
    e = e || event; // to deal with IE
    keyMap[e.keyCode] = e.type == "keydown";

    // If the key is the "B" used to throw bombs...
    if (e.keyCode === 66) {
        isBombPressed = false;
    }
}



// When document is ready
window.onload = function() {

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

            // Prevent to throw several bombs on a key down
            keyMap[66] = false;
        }
        if (keyMap[32] === true) { // key = left arrow
            players[0].shootBullet();
        }
    }

    // Checks if an object is outside of the world
    function isOutOfBorders(object) {
        return object.x < 0 || object.y < 0 || object.x > level.worldWidth || object.y > level.worldHeight;
    }

    // Determine the "best" viewport.
    // Ideally the viewport centers the player, if it is too close to the edge correct it to 0
    function determineViewport() {
        viewX = players[0].x - 0.5 * canvas.width;
        if (viewX < 0) {
            viewX = 0;
        }
        if (viewX + canvas.width > level.worldWidth) {
            viewX = level.worldWidth - canvas.width;
        }

        viewY = players[0].y - 0.5 * canvas.height;
        if (viewY < 0) {
            viewY = 0;
        }
        if (viewY + canvas.height > level.worldHeight) {
            viewY = level.worldHeight - canvas.height;
        }
    }

    // Draws every object, remove out of bounds projectiles and remove explosions
    function drawAllObjects() {
        level.bases.forEach(function(base) {
            base.draw();
            base.bombs.forEach(function(bomb, bombKey) {
                if (isOutOfBorders(bomb)) {
                    bomb.collide();
                    bomb = null;
                    base.bombs.splice(bombKey, 1);
                } else {
                    bomb.draw();
                }
            }, this);
            base.bullets.forEach(function(bullet, bulletKey) {
                if (isOutOfBorders(bullet)) {
                    bullet.collide();
                    bullet = null;
                    base.bullets.splice(bulletKey, 1);
                } else {
                    bullet.draw();
                }
            }, this);
        }, this);

        players.forEach(function(player) {
            player.draw();
            player.bombs.forEach(function(bomb, bombKey) {
                if (isOutOfBorders(bomb)) {
                    bomb.collide();
                    bomb = null;
                    player.bombs.splice(bombKey, 1);
                } else {
                    bomb.draw();
                }
            }, this);
            player.bullets.forEach(function(bullet, bulletKey) {
                if (isOutOfBorders(bullet)) {
                    bullet.collide();
                    bullet = null;
                    player.bullets.splice(bulletKey, 1);
                } else {
                    bullet.draw();
                }
            }, this);
        }, this);

        explosions.forEach(function(explosion) {
            explosion.statusUpdate();
            explosion.draw();
        }, this);
    }

    // Checks for collisions between the bases and the players' projectiles
    function checkBasesCollisions() {
        // Check for collisions for each base (between a base and a player's projectiles)
        // It also checks collisions between the base and the players
        level.bases.forEach(function(base) {

            // Shoot if the base is alive with its shooting pace
            if (base.alive && Math.random() < base.shootingPace) {
                base.shootBullet();
            }

            players.forEach(function(player) {
                if (detectCollision(base, player)) {
                    base.collide(player, player);
                    player.collide(base);
                }
                player.bombs.forEach(function(bomb, bombKey) {
                    if (detectCollision(base, bomb)) {
                        // Play sound
                        ion.sound.play("bomb-explode");

                        base.collide(bomb, player);
                        explosions.unshift(new Explosion(bomb.x,
                            bomb.y,
                            0.5 * bomb.width,
                            0.5 * bomb.height,
                            bomb.direction,
                            document.getElementById("bomb-explosion")));
                        bomb.collide();
                        bomb = null;
                        player.bombs.splice(bombKey, 1);
                    }

                }, this);
                player.bullets.forEach(function(bullet, bulletKey) {
                    if (detectCollision(base, bullet)) {
                        base.collide(bullet, player);
                        explosions.unshift(new Explosion(bullet.x,
                            bullet.y,
                            0.5 * bullet.width,
                            0.5 * bullet.height,
                            bullet.direction,
                            document.getElementById("bullet-explosion")));
                        bullet.collide();
                        bullet = null;
                        player.bullets.splice(bulletKey, 1);
                    }
                }, this);
            }, this);
        }, this);
    }

    // Checks for collisions between the players and the enemies' projectiles
    function checkPlayersCollisions() {
        // Check for collisions for each player (between a player and a base's projectiles)
        players.forEach(function(player) {
            level.bases.forEach(function(base) {
                base.bombs.forEach(function(bomb, bombKey) {
                    if (detectCollision(player, bomb)) {

                        // Play sound
                        ion.sound.play("bomb-explode");

                        player.collide(bomb);
                        explosions.unshift(new Explosion(bomb.x,
                            bomb.y,
                            0.5 * bomb.width,
                            0.5 * bomb.height,
                            bomb.direction,
                            document.getElementById("bomb-explosion")));
                        bomb.collide();
                        bomb = null;
                        base.bombs.splice(bombKey, 1);
                    }

                }, this);
                base.bullets.forEach(function(bullet, bulletKey) {
                    if (detectCollision(player, bullet)) {
                        player.collide(bullet);
                        explosions.unshift(new Explosion(bullet.x,
                            bullet.y,
                            0.5 * bullet.width,
                            0.5 * bullet.height,
                            bullet.direction,
                            document.getElementById("bullet-explosion")));
                        bullet.collide();
                        bullet = null;
                        base.bullets.splice(bulletKey, 1);
                    }
                }, this);
            }, this);
        }, this);
    }

    // Updates the boards with the players information
    function updateBoards(player) {
        document.getElementById("score-value").innerHTML = player.score;
        document.getElementById("max-score-value").innerHTML = player.maxScore;
        document.getElementById("health-value").value = player.health;
        document.getElementById("health-value").max = player.maxHealth;
        document.getElementById("health-value").style.width = player.maxHealth + "px";
        document.getElementById("lives-value").innerHTML = player.numOfLives;
        document.getElementById("num-of-bombs-value").innerHTML = player.numOfBombs;
    }

    // Checks if all enemies are dead
    function enemiesAreDead() {
        var areDead = true;
        level.bases.forEach(function(base) {
            if (base.alive) {
                areDead = false;
            }
        }, this);
        return areDead;
    }

    // Message printed when player loses one life
    function lostLifeMessage() {
        ctx.fillStyle = "darkred";
        ctx.font = "bolder " + 0.05 * canvas.width + "px Indie Flower";
        ctx.textAlign = "center";
        ctx.fillText("You lost one life", 0.5 * canvas.width, 0.4 * canvas.height);
        ctx.fillText("Press enter to continue", 0.5 * canvas.width, 0.6 * canvas.height);
    }

    // Message printed when player runs out of lives
    function gameOverMessage() {
        ctx.fillStyle = "darkred";
        ctx.font = "bolder " + 0.05 * canvas.width + "px Indie Flower";
        ctx.textAlign = "center";
        ctx.fillText("You lost all your lives", 0.5 * canvas.width, 0.4 * canvas.height);
        ctx.fillText("Press enter to start over", 0.5 * canvas.width, 0.6 * canvas.height);
    }

    // Message printed when player runs out of lives
    function levelFinishedMessage() {
        ctx.fillStyle = "darkblue";
        ctx.font = "bolder " + 0.05 * canvas.width + "px Indie Flower";
        ctx.textAlign = "center";
        ctx.fillText("You finished this level", 0.5 * canvas.width, 0.4 * canvas.height);
        ctx.fillText("Press enter to start next level", 0.5 * canvas.width, 0.6 * canvas.height);
    }

    // Start over when player runs out of lives
    function startOver() {

        // Clears interval
        clearInterval(gameInterval);

        // Deletes players and level
        players = [];
        level = {};
        levelNumber = 0;

        // Hide and show elements
        document.getElementById("canvas").style.display = "none";
        [].forEach.call(document.getElementsByClassName("board"), function(element) {
            element.style.display = "none";
        }, this);
        document.querySelector(".board:first-of-type").style.display = "block";
        document.getElementById("start-screen").style.display = "block";

        // Remove selected class from the previous selected bomber
        document.getElementsByClassName("selected")[0].classList.remove("selected");

    }

    function playLevel() {

        // Clears interval
        clearInterval(gameInterval);

        // Sets the initial attributes for the player
        players[0].clean();

        // Set the size of the canvas.
        canvas.width = Math.min(window.innerWidth * 0.9, level.worldWidth);
        canvas.height = Math.min(window.innerHeight * 0.9, level.worldHeight);

        // Sets the position of the player to the bottom left of the world
        players[0].x = 40;
        players[0].y = level.worldHeight - 20;

        // Removes the bullets and bombs from their arrays

        level.bases.forEach(function(base) {
            base.bombs = [];
            base.bullets = [];
        }, this);

        players.forEach(function(player) {
            player.bombs = [];
            player.bullets = [];
        }, this);

        // Starts rendering the game and keeps going with the given fps
        gameInterval = window.setInterval(render, timeRender * 1000);
    }

    function increaseLevel() {

        // Updates the levelNumber
        levelNumber++;

        // Create new level and populate it with bases
        level = new Level(levelNumber);
        level.start();
    }

    // Calls every function that requires to be updated
    function render() {

        // First gets the values from local storage and then saves the current status of the game
        players[0].getFromLocal();
        level.getFromLocal();
        players[0].saveToLocal();
        level.saveToLocal();

        if (players[0].alive) {
            if (enemiesAreDead()) {

                // Prints message and waits for intro to be pressed
                levelFinishedMessage();
                if (keyMap[13] === true) { // key = intro

                    increaseLevel();
                    playLevel();
                }
            } else {

                // Call the manageKeys function to run the methods corresponding to every key that is pressed
                manageKeys();

                // Clears the whole viewport
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Determines the best viewport
                determineViewport();

                // Draws the background
                level.backgroundImage.draw();

                // Check for collisions between the bases and the players' projectiles
                checkBasesCollisions();

                // Check for collisions between the players and the bases' projectiles
                checkPlayersCollisions();

                // Draw all remaining objects
                drawAllObjects();

                // Update boards with health, lives and score
                updateBoards(players[0]);
            }
        } else if (players[0].numOfLives > 0) {

            // Prints message and waits for intro to be pressed
            lostLifeMessage();
            if (keyMap[13] === true) { // key = intro
                playLevel();
            }
        } else {

            // Prints message and waits for intro to be pressed
            gameOverMessage();
            if (keyMap[13] === true) { // key = intro
                startOver(players[0]);
            }
        }
    }

    // Get the attributes from the bombers to print them in the start screen
    function printToStartScreen() {

        // First set the max score from the value saved in local storage
        if (localStorage.maxScore) {
            document.getElementById("max-score-value").innerHTML = parseInt(localStorage.maxScore);
        }

        // Instantiate classes to get their properties
        var bomber1 = new Bomber1();
        var bomber2 = new Bomber2();
        var bomber3 = new Bomber3();

        // Give name and values to the properties that will be shown in the start screen
        document.getElementById("bomber1-name").innerHTML = bomber1.name;
        document.getElementById("bomber1-speed-value").value = bomber1.maxSpeed / 100;
        document.getElementById("bomber1-acceleration-value").value = bomber1.acceleration / 100;
        document.getElementById("bomber1-agility-value").value = bomber1.agility;
        document.getElementById("bomber1-num-bombs-value").value = bomber1.maxBombs;
        document.getElementById("bomber1-bomb-damage-value").value = new bomber1.bombType().damage / 20;
        document.getElementById("bomber1-bullet-damage-value").value = new bomber1.bulletType().damage / 2;

        document.getElementById("bomber2-name").innerHTML = bomber2.name;
        document.getElementById("bomber2-speed-value").value = bomber2.maxSpeed / 100;
        document.getElementById("bomber2-acceleration-value").value = bomber2.acceleration / 100;
        document.getElementById("bomber2-agility-value").value = bomber2.agility;
        document.getElementById("bomber2-num-bombs-value").value = bomber2.maxBombs;
        document.getElementById("bomber2-bomb-damage-value").value = new bomber2.bombType().damage / 20;
        document.getElementById("bomber2-bullet-damage-value").value = new bomber2.bulletType().damage / 2;

        document.getElementById("bomber3-name").innerHTML = bomber3.name;
        document.getElementById("bomber3-speed-value").value = bomber3.maxSpeed / 100;
        document.getElementById("bomber3-acceleration-value").value = bomber3.acceleration / 100;
        document.getElementById("bomber3-agility-value").value = bomber3.agility;
        document.getElementById("bomber3-num-bombs-value").value = bomber3.maxBombs;
        document.getElementById("bomber3-bomb-damage-value").value = new bomber3.bombType().damage / 20;
        document.getElementById("bomber3-bullet-damage-value").value = new bomber3.bulletType().damage / 2;
    }

    printToStartScreen();


    // Chooses a player in the start-screen
    document.getElementById("choose-bomber1").onclick = function() {

        // Remove selected class from the previous selected bomber
        if (document.getElementsByClassName("selected")[0] !== undefined) {
            document.getElementsByClassName("selected")[0].classList.remove("selected");
        }

        // Add the selected class to the chosen bomber
        document.getElementById("choose-bomber1").classList.add("selected");

        // Hide the error message
        document.getElementById("error-message").style.display = "none";

        // Set players[0] to the chosen bomber class
        players[0] = new Bomber1();
    };

    document.getElementById("choose-bomber2").onclick = function() {

        // Remove selected class from the previous selected bomber
        if (document.getElementsByClassName("selected")[0] !== undefined) {
            document.getElementsByClassName("selected")[0].classList.remove("selected");
        }

        // Add the selected class to the chosen bomber
        document.getElementById("choose-bomber2").classList.add("selected");

        // Set players[0] to the chosen bomber class
        players[0] = new Bomber2();

        // Hide the error message
        document.getElementById("error-message").style.display = "none";
    };

    document.getElementById("choose-bomber3").onclick = function() {

        // Remove selected class from the previous selected bomber
        if (document.getElementsByClassName("selected")[0] !== undefined) {
            document.getElementsByClassName("selected")[0].classList.remove("selected");
        }

        // Add the selected class to the chosen bomber
        document.getElementById("choose-bomber3").classList.add("selected");

        // Set players[0] to the chosen bomber class
        players[0] = new Bomber3();

        // Hide the error message
        document.getElementById("error-message").style.display = "none";
    };

    // Start game if click on start game and there is a selected player
    document.getElementById("start-game").onclick = function() {
        if (players[0] !== undefined) {

            // Hide and show elements
            document.getElementById("canvas").style.display = "block";
            [].forEach.call(document.getElementsByClassName("board"), function(element) {
                element.style.display = "block";
            }, this);
            document.getElementById("start-screen").style.display = "none";
            document.getElementById("error-message").style.display = "none";

            // Increase level from 0 to 1
            increaseLevel()

            // Starts level
            playLevel();

        } else {
            document.getElementById("error-message").style.display = "block";
        }
    };
};