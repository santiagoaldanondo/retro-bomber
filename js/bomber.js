// Create the class Bomber, that will inherit from the class Drawable
var Bomber = function(x, y, image, acceleration, agility) {
    Drawable.call(this, x, y);
    this.speed = 0;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
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
Bomber.prototype = new Drawable();

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
Bomber.prototype.turn = function(angle) {
    this.direction += angle;
    this.speed = Math.pow(Math.pow(this.vx, 2) + Math.pow(this.vy, 2), 0.5);
    this.vx = this.speed * Math.cos(this.direction * Math.PI / 180);
    this.vy = this.speed * Math.sin(this.direction * Math.PI / 180);
}