// Create the class Bomber, that will inherit from the class Drawable
function Bomber(x, y, width, height, image, acceleration, maxSpeed, agility) {
    Drawable.call(this, x, y);
    this.width = width;
    this.height = height;
    this.image = image;
    this.acceleration = acceleration;
    this.maxSpeed = maxSpeed;
    this.agility = agility;
    this.direction = 0;
    this.speed = 0;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.bombs = [];
}

// Set the Bomber to inherit from Drawable
Bomber.prototype = Object.create(Drawable.prototype);
Bomber.prototype.constructor = Bomber;

// Overrides the draw method from the parent Drawable
// IMPORTANT: REMEMBER THAT THE DIRECTION TAKES WEIRD VALUES. IT GOES FROM ZERO CLOCKWISE INSTEAD
// OF ANTICLOCKWISE. THEREFORE 90 DEGREES AND 270 DEGREES ARE CONFUSED (90 IS THE USUAL 270 AND VS)
Bomber.prototype.draw = function() {

    // Updates the spedd and position for the object
    this.updateSpeed();
    this.updatePosition();

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

// Create new methods for the Bomber class
Bomber.prototype.setSpeed = function() {
    this.speed = Math.pow(Math.pow(this.vx, 2) + Math.pow(this.vy, 2), 0.5);
    return this.speed;
}

Bomber.prototype.updatePosition = function() {
    this.x += this.vx * timeRender;
    this.y += this.vy * timeRender;
}
Bomber.prototype.updateSpeed = function() {
    this.vx += this.ax * timeRender;
    this.vy += this.ay * timeRender;
    this.setSpeed();

    // Sets accelerations to zero, so it doen't keep accelerating
    this.ax = 0;
    this.ay = 0;
}
Bomber.prototype.accelerate = function() {
    if ((this.setSpeed() >= this.maxSpeed) &&
        (this.vx * Math.cos((this.direction) * Math.PI / 180) > 0 ||
            this.vy * Math.sin((this.direction) * Math.PI / 180) > 0)) {
        return;
    }
    this.ax = this.acceleration * Math.cos(this.direction * Math.PI / 180);
    this.ay = this.acceleration * Math.sin(this.direction * Math.PI / 180);
}
Bomber.prototype.brake = function() {
    if ((this.setSpeed() >= this.maxSpeed) &&
        !(this.vx * Math.cos((this.direction) * Math.PI / 180) > 0 ||
            this.vy * Math.sin((this.direction) * Math.PI / 180) > 0)) {
        return;
    }
    this.ax = -this.acceleration * Math.cos(this.direction * Math.PI / 180);
    this.ay = -this.acceleration * Math.sin(this.direction * Math.PI / 180);
}

Bomber.prototype.turn = function(angle) {
    this.direction += angle;

    // Set direction between 0 and 360 degrees (360 is not included)
    this.direction = (this.direction + 360) % 360;

    // Gets the current speed to project it with the new angle 
    this.setSpeed();

    // Checks if the plane is going forward or backward in order to give a sign to the speed vx and vy
    if (this.vx * Math.cos((this.direction - angle) * Math.PI / 180) > 0 ||
        this.vy * Math.sin((this.direction - angle) * Math.PI / 180) > 0) {
        this.vx = this.speed * Math.cos(this.direction * Math.PI / 180);
        this.vy = this.speed * Math.sin(this.direction * Math.PI / 180);
    } else {
        this.vx = -this.speed * Math.cos(this.direction * Math.PI / 180);
        this.vy = -this.speed * Math.sin(this.direction * Math.PI / 180);
    }
}

Bomber.prototype.throwBomb = function() {
    var bombX;
    var bombY;
    if (this.direction >= 0 && this.direction < 90) {
        bombX = (-1 / 3 * this.width) * (1 - this.direction / 90) - (2 / 3 * this.height * this.direction / 90);
        bombY = (2 / 3 * this.height) * (1 - this.direction / 90) - (1 / 3 * this.width * this.direction / 90);
    } else if (this.direction >= 90 && this.direction < 180) {
        bombX = (-2 / 3 * this.height) * (1 - (this.direction - 90) / 90) + (1 / 3 * this.width * (this.direction - 90) / 90);
        bombY = (-1 / 3 * this.width) * (1 - (this.direction - 90) / 90) - (2 / 3 * this.height * (this.direction - 90) / 90);
    } else if (this.direction >= 180 && this.direction < 270) {
        bombX = (1 / 3 * this.width) * (1 - (this.direction - 180) / 90) + (2 / 3 * this.height * (this.direction - 180) / 90);
        bombY = (-2 / 3 * this.height) * (1 - (this.direction - 180) / 90) + (1 / 3 * this.width * (this.direction - 180) / 90);
    } else if (this.direction >= 270 && this.direction < 360) {
        bombX = (2 / 3 * this.height) * (1 - (this.direction - 270) / 90) - (1 / 3 * this.width * (this.direction - 270) / 90);
        bombY = (1 / 3 * this.width) * (1 - (this.direction - 270) / 90) + (2 / 3 * this.height * (this.direction - 270) / 90);
    }

    this.bombs.push(new Bomb(this.x + this.width / 3 + bombX,
        this.y + this.height / 3 + bombY,
        this.width / 3, this.height / 3,
        this.direction,
        this.speed,
        document.getElementById("bomb")));
}