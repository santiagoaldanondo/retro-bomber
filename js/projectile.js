// Declare global variables to avoid no-undef errors from Eslint:
/*global Drawable gravity ctx viewX viewY timeRender:true*/

function Projectile(x, y, width, height, direction, speed, imageLive) {
    Drawable.call(this, x, y);
    this.width = width;
    this.height = height;
    this.imageLive = imageLive;
    this.direction = direction;
    this.speed = speed;
    this.vx = this.speed * Math.cos(this.direction * Math.PI / 180);
    this.vy = this.speed * Math.sin(this.direction * Math.PI / 180);
    this.ax = 0;
    this.ay = gravity;
    this.damage = 5;
}
// Set the Projectile to inherit from Drawable
Projectile.prototype = Object.create(Drawable.prototype);
Projectile.prototype.constructor = Projectile;

// Overrides the draw method from the parent Drawable
Projectile.prototype.draw = function() {

    // Updates the speed and position for the object
    this.updateSpeed();
    this.updatePosition();
    this.updateDirection();

    // save the current co-ordinate system
    ctx.save();

    // move to the middle of where we want to draw our image. We have to substract the distances
    // of the viewport (viewX and viewY)
    ctx.translate(this.x +
        this.width / 2 - viewX,
        this.y + this.height / 2 - viewY);

    // rotate around that point, converting the angle from degrees to radians
    ctx.rotate(this.direction * Math.PI / 180);

    // draw it up and to the left by half the width and height of the image
    ctx.drawImage(this.imageLive, -this.width / 2, -this.height / 2, this.width, this.height);

    // Restore the co-ords to the way they were at the beginning
    ctx.restore();
}

// Create new methods for the Projectile class
Projectile.prototype.getSpeed = function() {
    this.speed = Math.pow(Math.pow(this.vx, 2) + Math.pow(this.vy, 2), 0.5);
    return this.speed;
}

Projectile.prototype.updatePosition = function() {
    this.x += this.vx * timeRender;
    this.y += this.vy * timeRender;
}

Projectile.prototype.updateSpeed = function() {
    this.vy += this.ay * timeRender;
    this.getSpeed();
}

Projectile.prototype.updateDirection = function() {
    if (this.vx >= 0) {
        this.direction = Math.atan(this.vy / this.vx) / Math.PI * 180;
    } else {
        this.direction = Math.atan(this.vy / this.vx) / Math.PI * 180 + 180;
    }
}

Projectile.prototype.collide = function() {
    delete this;
}
