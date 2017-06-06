// Declare global variables to avoid no-undef errors from Eslint:
/*global ion Background Bomber Bomber1 Bomber2 Bomber3 Base Explosion explosions players bases detectCollision:true*/

//Initialize ion library, include sounds and set multiplay to true (so it can play multiple sounds at the same time)
ion.sound({
    sounds: [{
        name: "bomb-explode",
        volume: 0.3
    },
    {
        name: "base-explode",
        volume: 0.5
    },
    {
        name: "bullet-shot",
        volume: 0.2
    },
    {
        name: "missile-shot",
        volume: 0.2
    },
    ],
    path: "audios/",
    multiplay: true,
    preload: true
});

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
    canvas.width = Math.min(window.innerWidth * 0.95, worldWidth);
    canvas.height = Math.min(window.innerHeight * 0.95, worldHeight);

    // Set initial position in the viewport
    viewX = 0;
    viewY = 0;

    // Assign value to the backgroundImage, and populate players and bases
    backgroundImage = new Background(0, 0, document.getElementById("garden"));
    players.push(new Bomber2(40, worldHeight - 20));
    bases.push(new Base(400, worldHeight - 100, 100, 100, document.getElementById("base1"), 0.1));
    bases.push(new Base(600, worldHeight - 100, 100, 100, document.getElementById("base1"), 0.1));
    bases.push(new Base(800, worldHeight - 100, 100, 100, document.getElementById("base1"), 0.1));
    bases.push(new Base(1000, worldHeight - 100, 100, 100, document.getElementById("base1"), 0.1));
    bases.push(new Base(1200, worldHeight - 100, 100, 100, document.getElementById("base1"), 0.1));
    bases.push(new Base(1400, worldHeight - 100, 100, 100, document.getElementById("base1"), 0.1));
    bases.push(new Base(1600, worldHeight - 100, 100, 100, document.getElementById("base1"), 0.1));

    // Create an array to keep the keys that are pressed
    var keyMap = [];

    // Use the onkeydown and onkeyup events to modify the values on the keyMap array:
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

    // Checks if an object is outside of the world
    function isOutOfBorders(object) {
        return object.x < 0 || object.y < 0 || object.x > worldWidth || object.y > worldHeight;
    }

    // Determine the "best" viewport.
    // Ideally the viewport centers the player, if it is too close to the edge correct it to 0
    function determineViewport() {
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
    }

    // Draws every object and remove out of bounds projectiles
    function drawAllObjects() {
        bases.forEach(function(base) {
            base.draw();
            base.bombs.forEach(function(bomb, bombKey) {
                if (isOutOfBorders(bomb)) {
                    bomb.collide(base, undefined);
                    bomb = null;
                    base.bombs.splice(bombKey, 1);
                } else {
                    bomb.draw();
                }
            }, this);
            base.bullets.forEach(function(bullet, bulletKey) {
                if (isOutOfBorders(bullet)) {
                    bullet.collide(base, undefined);
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
            explosion.draw();
        }, this);
    }

    // Updates the explosion lifeLeft, width and height
    function explosionStatus() {
        explosions.forEach(function(explosion, explosionKey) {
            explosion.lifeLeft -= 1 / fps;
            if (explosion.lifeLeft > explosion.lifeTime / 2) {
                explosion.width = explosion.initialWidth * (2 + 4 * (0.5 - explosion.lifeLeft / explosion.lifeTime));
                explosion.height = explosion.initialHeight * (2 + 4 * (0.5 - explosion.lifeLeft / explosion.lifeTime));
            } else if (explosion.lifeLeft > 0) {
                explosion.width = explosion.initialWidth * 2 * explosion.lifeLeft / explosion.lifeTime;
                explosion.height = explosion.initialHeight * 2 * explosion.lifeLeft / explosion.lifeTime;
            } else {
                explosions.splice(explosionKey, 1);
                explosion.disappear();
            }
        }, this);
    }

    // Checks for collisions between the bases and the players' projectiles
    function checkBasesCollisions() {
        // Check for collisions for each base (between a base and a player's projectiles)
        // It also checks collisions between the base and the players
        bases.forEach(function(base) {

            // Shoot if the base is alive with its shooting pace
            if (base.alive && Math.random() < base.shootingPace) {
                base.shootBullet();
            }

            players.forEach(function(player) {
                if (detectCollision(base, player)) {
                    base.collide(player, player);
                    player.collide(base, base);
                }
                player.bombs.forEach(function(bomb, bombKey) {
                    if (detectCollision(base, bomb)) {
                        // Play sound
                        ion.sound.play("bomb-explode");

                        base.collide(bomb, player);
                        bomb.collide(base, undefined);
                        explosions.unshift(new Explosion(bomb.x,
                            bomb.y,
                            0.5 * bomb.width,
                            0.5 * bomb.height,
                            bomb.direction,
                            document.getElementById("bomb-explosion")));
                        bomb = null;
                        player.bombs.splice(bombKey, 1);
                    }

                }, this);
                player.bullets.forEach(function(bullet, bulletKey) {
                    if (detectCollision(base, bullet)) {
                        base.collide(bullet, player);
                        bullet.collide(base, undefined);
                        explosions.unshift(new Explosion(bullet.x,
                            bullet.y,
                            0.5 * bullet.width,
                            0.5 * bullet.height,
                            bullet.direction,
                            document.getElementById("bullet-explosion")));
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
            bases.forEach(function(base) {
                base.bombs.forEach(function(bomb, bombKey) {
                    if (detectCollision(player, bomb)) {

                        // Play sound
                        ion.sound.play("bomb-explode");

                        player.collide(bomb, base);
                        bomb.collide();
                        explosions.unshift(new Explosion(bomb.x,
                            bomb.y,
                            0.5 * bomb.width,
                            0.5 * bomb.height,
                            bomb.direction,
                            document.getElementById("bomb-explosion")));
                        bomb = null;
                        base.bombs.splice(bombKey, 1);
                    }

                }, this);
                base.bullets.forEach(function(bullet, bulletKey) {
                    if (detectCollision(player, bullet)) {
                        player.collide(bullet, base);
                        bullet.collide();
                        explosions.unshift(new Explosion(bullet.x,
                            bullet.y,
                            0.5 * bullet.width,
                            0.5 * bullet.height,
                            bullet.direction,
                            document.getElementById("bullet-explosion")));
                        bullet = null;
                        base.bullets.splice(bulletKey, 1);
                    }
                }, this);
            }, this);
        }, this);
    }

    // Updates the boards with the players information
    function updateBoards(player) {
        document.getElementById("lives-value").innerHTML = player.numOfLives;
        document.getElementById("health-value").value = player.health;
        document.getElementById("health-value").max = player.maxHealth;
        document.getElementById("health-value").style.width = player.maxHealth + "px";
        document.getElementById("score-value").innerHTML = player.score;
    }

    // Checks if the player is alive at the moment
    function playerIsAlive(player) {
        return player.alive;
    }

    // returns if a player has any life left
    function playerHasLives(player) {
        return player.numOfLives > 0;
    }

    // Checks if all enemies are dead
    function enemiesAreDead() {
        var areDead = true;
        bases.forEach(function(base) {
            if (base.alive) {
                areDead = false;
            }
        }, this);
        return areDead;
    }

    // Message printed when player loses one life
    function lostLifeMessage() {
        ctx.fillStyle = "darkred";
        ctx.font = 0.05 * canvas.width + "px Ubuntu";
        ctx.textAlign = "center";
        ctx.fillText("You lost one life", 0.5 * canvas.width, 0.4 * canvas.height);
        ctx.fillText("Press enter to continue", 0.5 * canvas.width, 0.6 * canvas.height);
    }

    // Message printed when player runs out of lives
    function gameOverMessage() {
        ctx.fillStyle = "darkred";
        ctx.font = 0.05 * canvas.width + "px Ubuntu";
        ctx.textAlign = "center";
        ctx.fillText("You lost all your lives", 0.5 * canvas.width, 0.4 * canvas.height);
        ctx.fillText("Press enter to start over", 0.5 * canvas.width, 0.6 * canvas.height);
    }

    // Message printed when player runs out of lives
    function levelFinishedMessage() {
        ctx.fillStyle = "darkblue";
        ctx.font = 0.05 * canvas.width + "px Ubuntu";
        ctx.textAlign = "center";
        ctx.fillText("You finished this level", 0.5 * canvas.width, 0.4 * canvas.height);
        ctx.fillText("Press enter to start next level", 0.5 * canvas.width, 0.6 * canvas.height);
    }

    // Puts the player back to its intial position to keep playing after losing one life
    function keepPlaying(player) {
        player.health = player.maxHealth;
        player.alive = true;
        player.image = document.getElementById("bomber1");
        player.x = player.initialX;
        player.y = player.initialY;
        player.direction = 0;
    }



    // Start over when player runs out of lives
    function startOver() {}

    // Start over when player runs out of lives
    function nextLevel() {}

    // Calls every function that requires to be updated
    function render() {

        if (playerIsAlive(players[0])) {
            if (enemiesAreDead()) {
                levelFinishedMessage();
                if (keyMap[13] === true) { // key = intro
                    nextLevel(players[0]);
                }
            } else {

                // Call the manageKeys function to run the methods corresponding to every key that is pressed
                manageKeys();

                // Clears the whole viewport
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Determines the best viewport
                determineViewport();

                // Draws the background
                backgroundImage.draw();

                // Check for collisions between the bases and the players' projectiles
                checkBasesCollisions();

                // Check for collisions between the players and the bases' projectiles
                checkPlayersCollisions();

                // Removes expired explosions
                explosionStatus();

                // draw all remaining objects
                drawAllObjects();

                // Update boards with health, lives and score
                updateBoards(players[0]);
            }
        } else if (playerHasLives(players[0])) {
            lostLifeMessage();
            if (keyMap[13] === true) { // key = intro
                keepPlaying(players[0]);
            }
        } else {
            gameOverMessage();
            if (keyMap[13] === true) { // key = intro
                startOver(players[0]);
            }
        }
    }

    // Starts rendering the game and keeps going with the given fps
    window.setInterval(render, timeRender * 1000);

});
