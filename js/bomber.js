// Create the class Bomber, that will inherit from the class Drawable
function Bomber(x, y, width, height, image, acceleration, agility) {
    Drawable.call(this, x, y);
    this.speed = 0;
    this.width = width;
    this.height = height;
    this.direction = 0;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.image = image;
    this.acceleration = acceleration;
    this.agility = agility;
}

// Set the Bomber to inherit from Drawable
Bomber.prototype = Object.create(Drawable.prototype);
Bomber.prototype.constructor = Bomber;

// Overrides the draw method from the parent Drawable
Bomber.prototype.draw = function() {

    // save the current co-ordinate system
    ctx.save();

    // move to the middle of where we want to draw our image
    ctx.translate(this.x +
        this.width / 2 - viewX,
        this.y + this.height / 2 - viewY);

    // rotate around that point, converting the angle from degrees to radians
    ctx.rotate(this.direction * Math.PI / 180);

    // draw it up and to the left by half the width and height of the image
    ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);

    // Restore the co-ords to how they were before
    ctx.restore();
}

// Create new methods for the Bomber class
Bomber.prototype.updatePosition = function() {
    this.x += this.vx * timeRender;
    this.y += this.vy * timeRender;
}
Bomber.prototype.updateSpeed = function() {
    this.vx += this.ax * timeRender;
    this.vy += this.ay * timeRender;
    this.speed = Math.pow(Math.pow(this.vx, 2) + Math.pow(this.vy, 2), 0.5);
    this.ax = 0;
    this.ay = 0;
}
Bomber.prototype.accelerate = function() {
    this.ax = this.acceleration * Math.cos(this.direction * Math.PI / 180);
    this.ay = this.acceleration * Math.sin(this.direction * Math.PI / 180);
}
Bomber.prototype.brake = function() {
    this.ax = -this.acceleration * Math.cos(this.direction * Math.PI / 180);
    this.ay = -this.acceleration * Math.sin(this.direction * Math.PI / 180);
}

// I need to correct the direction of the speed when going backwards
Bomber.prototype.turn = function(angle) {
    this.direction += angle;
    this.speed = Math.pow(Math.pow(this.vx, 2) + Math.pow(this.vy, 2), 0.5);
    this.vx = this.speed * Math.cos(this.direction * Math.PI / 180);
    this.vy = this.speed * Math.sin(this.direction * Math.PI / 180);
}