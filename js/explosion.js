// Declare global variables to avoid no-undef errors from Eslint:
/*global Drawable Bullet ctx viewX viewY:true*/

// Create the class Explosion, that will inherit from the class Drawable
function Explosion(x, y, width, height, direction, image) {
    Drawable.call(this, x, y);
    this.width = width;
    this.height = height;
    this.initialWidth = width;
    this.initialHeight = height;
    this.image = image;
    this.direction = direction;
    this.lifeTime = 1;
    this.lifeLeft = this.lifeTime;
}

// Set the Explosion to inherit from Drawable
Explosion.prototype = Object.create(Drawable.prototype);
Explosion.prototype.constructor = Explosion;

// Overrides the draw method from the parent Drawable
// IMPORTANT: REMEMBER THAT THE DIRECTION TAKES WEIRD VALUES. IT GOES FROM ZERO CLOCKWISE INSTEAD
// OF ANTICLOCKWISE. THEREFORE 90 DEGREES AND 270 DEGREES ARE CONFUSED (90 IS THE USUAL 270 AND VS)
Explosion.prototype.draw = function() {

    // Calculates de vector of the Explosion's direction
    var xdx = Math.cos(this.direction * Math.PI / 180);
    var xdy = Math.sin(this.direction * Math.PI / 180);

    // set the 2D API to the Explosion location and rotation
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

// Create new methods for the Explosion class

Explosion.prototype.disappear = function() {
    delete this;
}

