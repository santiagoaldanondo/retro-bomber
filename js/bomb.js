function Bomb(x, y, width, height, direction, speed, image) {
    Drawable.call(this, x, y);
    this.width = width;
    this.height = height;
    this.image = image;
    this.direction = direction;
    this.speed = speed;
    this.vx = this.speed * Math.cos(this.direction * Math.PI / 180);
    this.vy = this.speed * Math.sin(this.direction * Math.PI / 180);
    this.ax = 0;
    this.ay = gravity;
    this.dead = document.getElementById("bomb-dead");
    this.alive = true;
    this.damage = 100;
    this.life = 0;
}
// Set the Background to inherit from Drawable
Bomb.prototype = Object.create(Drawable.prototype);
Bomb.prototype.constructor = Bomb;

// Overrides the draw method from the parent Drawable
Bomb.prototype.draw = function() {

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
    ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);

    // Restore the co-ords to the way they were at the beginning
    ctx.restore();
}

// Create new methods for the Bomb class
Bomb.prototype.getSpeed = function() {
    this.speed = Math.pow(Math.pow(this.vx, 2) + Math.pow(this.vy, 2), 0.5);
    return this.speed;
}

Bomb.prototype.updatePosition = function() {
    if (this.alive) {
        this.x += this.vx * timeRender;
        this.y += this.vy * timeRender;
    }
}
Bomb.prototype.updateSpeed = function() {
    if (this.alive) {
        this.vy += this.ay * timeRender;
        this.getSpeed();
    }
}
Bomb.prototype.updateDirection = function() {
    if (this.alive) {
        if (this.vx >= 0) {
            this.direction = Math.atan(this.vy / this.vx) / Math.PI * 180;
        } else {
            this.direction = Math.atan(this.vy / this.vx) / Math.PI * 180 + 180;
        }
    }
}

Bomb.prototype.collide = function(damageTaken) {
    if (this.alive) {
        this.life -= damageTaken;
        if (this.life <= 0) {
            this.alive = false;
            this.image = this.dead;
            this.speed = 0;
            this.vx = 0;
            this.vy = 0;
            this.ax = 0;
            this.ay = 0;
            this.width *= 2;
            this.height *= 3;
        }
    }
}