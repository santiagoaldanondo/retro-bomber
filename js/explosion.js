// Declare global variables to avoid no-undef errors from Eslint:
/*global Drawable Bullet ctx viewX viewY:true*/

// Create the class Base, that will inherit from the class Drawable
function Base(x, y, width, height, image) {
    Drawable.call(this, x, y);
    this.width = width;
    this.height = height;
    this.image = image;
    this.bombs = [];
    this.bullets = [];
    this.direction = 0;
    this.dead = document.getElementById("base1-dead");
    this.alive = true;
    this.damage = 10000;
    this.life = 200
    this.worth = 100;
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

Base.prototype.shootBullet = function() {
    var bulletX;
    var bulletY;
    if (this.direction >= 0 && this.direction < 90) {
        bulletX = 2 / 3 * this.width * (1 - this.direction / 90);
        bulletY = 2 / 3 * this.width * this.direction / 90;
    } else if (this.direction >= 90 && this.direction < 180) {
        bulletX = -2 / 3 * this.width * (this.direction - 90) / 90;
        bulletY = 2 / 3 * this.width * (1 - (this.direction - 90) / 90);
    } else if (this.direction >= 180 && this.direction < 270) {
        bulletX = -2 / 3 * this.width * (1 - (this.direction - 180) / 90);
        bulletY = -2 / 3 * this.width * (this.direction - 180) / 90;
    } else if (this.direction >= 270 && this.direction < 360) {
        bulletX = 2 / 3 * this.width * (this.direction - 270) / 90;
        bulletY = -2 / 3 * this.width * (1 - (this.direction - 270) / 90);
    }
    this.bullets.push(new Bullet(this.x + this.width / 3 + bulletX,
        this.y + this.height / 3 + bulletY,
        this.width / 5, this.height / 5 * 2 / 3,
        this.direction,
        1000,
        document.getElementById("bullet")));
}

Base.prototype.collide = function(collidedWith, originCollision) {
    if (this.alive) {
        this.life -= collidedWith.damage;
        if (this.life <= 0) {
            this.alive = false;
            this.image = this.dead;
            originCollision.score += this.worth;
        }
    }
}
