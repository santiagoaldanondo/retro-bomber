// Declare global variables to avoid no-undef errors from Eslint:
/*global Drawable Bullet Missile1 players ctx viewX viewY ion:true*/

// Create the class Base, that will inherit from the class Drawable
function Base(x, y, width, height, image, shootingPace, health, worth, accuracy) {
    Drawable.call(this, x, y);
    this.width = width;
    this.height = height;
    this.image = image;
    this.shootingPace = shootingPace;
    this.bombs = [];
    this.bullets = [];
    this.direction = 0;
    this.dead = document.getElementById("base1-dead");
    this.alive = true;
    this.damage = 10000;
    this.health = health;
    this.worth = worth;
    this.bulletType = Missile1;
    this.accuracy = accuracy;
}

// Set the Base to inherit from Drawable
Base.prototype = Object.create(Drawable.prototype);
Base.prototype.constructor = Base;

// Overrides the draw method from the parent Drawable
// IMPORTANT: REMEMBER THAT THE DIRECTION TAKES WEIRD VALUES. IT GOES FROM ZERO CLOCKWISE INSTEAD
// OF ANTICLOCKWISE. THEREFORE 90 DEGREES AND 270 DEGREES ARE CONFUSED (90 IS THE USUAL 270 AND VS)
Base.prototype.draw = function() {

    // Calculates de vector of the Base's direction
    var xdx = Math.cos(this.direction * Math.PI / 180);
    var xdy = Math.sin(this.direction * Math.PI / 180);

    // set the 2D API to the Base location and rotation
    // setTransform(h scaling, h skewing, v skewing, v scaling, h moving, v moving)
    // it multiplies by a matrix:
    // a	c	e
    // b	d	f
    // 0	0	1

    ctx.setTransform(xdx, xdy, -xdy, xdx, this.x - viewX, this.y - viewY);

    ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);

    // reset the transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// Create new methods for the Base class

Base.prototype.directBullet = function(player) {
    var distanceX = player.x - this.x;
    var distanceY = player.y - this.y;
    var bulletDirection;
    if (distanceX >= 0) {
        bulletDirection = Math.atan(distanceY / distanceX) / Math.PI * 180;
    } else {
        bulletDirection = Math.atan(distanceY / distanceX) / Math.PI * 180 + 180;
    }
    return bulletDirection;
}

Base.prototype.shootBullet = function() {

    // Play sound
    ion.sound.play("missile-shot");

    var finalDirection = this.directBullet(players[0]) + (1 - this.accuracy) * Math.random() * 360;

    this.bullets.push(new this.bulletType(this.x,
        this.y,
        this.width / 4,
        this.height / 10,
        finalDirection,
        500));
}

Base.prototype.collide = function(collidedWith, originCollision) {
    if (this.alive) {
        this.health -= collidedWith.damage;
        if (this.health <= 0) {

            // Play sound
            ion.sound.play("base-explode");

            this.alive = false;
            this.image = this.dead;
            originCollision.score += this.worth;
        }
    }
}