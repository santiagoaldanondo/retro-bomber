// Declare global variables to avoid no-undef errors from Eslint:
/*global Drawable Bomb Bullet ctx viewX viewY timeRender ion:true*/

// Create the class Bomber, that will inherit from the class Drawable
function Bomber(x, y, width, height, imageLive, imageDead, acceleration, maxSpeed, agility, bombType, bulletType) {
    Drawable.call(this, x, y);
    this.initialX = this.x;
    this.initialY = this.y;
    this.imageLive = imageLive;
    this.imageDead = imageDead;
    this.width = width;
    this.height = height;
    this.acceleration = acceleration;
    this.maxSpeed = maxSpeed;
    this.agility = agility;
    this.direction = 0;
    this.speed = 0;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.alive = true;
    this.damage = 10000;
    this.health = 400;
    this.maxHealth = this.health;
    this.numOfLives = 3;
    this.score = 0;
    this.bombs = [];
    this.bullets = [];
    this.numOfBombs = 1000;
    this.bombType = bombType;
    this.bulletType = bulletType;
}

// Set the Bomber to inherit from Drawable
Bomber.prototype = Object.create(Drawable.prototype);
Bomber.prototype.constructor = Bomber;

// Overrides the draw method from the parent Drawable
// IMPORTANT: REMEMBER THAT THE DIRECTION TAKES WEIRD VALUES. IT GOES FROM ZERO CLOCKWISE INSTEAD
// OF ANTICLOCKWISE. THEREFORE 90 DEGREES AND 270 DEGREES ARE CONFUSED (90 IS THE USUAL 270 AND VS)
Bomber.prototype.draw = function() {

    // Updates the speed and position for the object
    this.updateSpeed();
    this.updatePosition();

    // Calculates de vector of the Bomber's direction
    var xdx = Math.cos(this.direction * Math.PI / 180);
    var xdy = Math.sin(this.direction * Math.PI / 180);

    // set the 2D API to the Bomber location and rotation
    // setTransform(h scaling, h skewing, v skewing, v scaling, h moving, v moving)
    // it multiplies by a matrix:
    // a	c	e
    // b	d	f
    // 0	0	1

    ctx.setTransform(xdx, xdy, -xdy, xdx, this.x - viewX, this.y - viewY);

    ctx.drawImage(this.imageLive, -this.width / 2, -this.height / 2, this.width, this.height);

    // reset the transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

// Create new methods for the Bomber class

Bomber.prototype.setSpeed = function() {
    this.speed = Math.pow(Math.pow(this.vx, 2) + Math.pow(this.vy, 2), 0.5);
    return this.speed;
}

Bomber.prototype.updatePosition = function() {
    if (this.alive) {
        this.x += this.vx * timeRender;
        this.y += this.vy * timeRender;
    }
}

Bomber.prototype.updateSpeed = function() {
    if (this.alive) {
        this.vx += this.ax * timeRender;
        this.vy += this.ay * timeRender;
        this.setSpeed();

        // Sets accelerations to zero, so it doen't keep accelerating
        this.ax = 0;
        this.ay = 0;
    }
}

Bomber.prototype.accelerate = function() {
    if (this.alive) {
        if ((this.setSpeed() >= this.maxSpeed) &&
            (this.vx * Math.cos((this.direction) * Math.PI / 180) > 0 ||
                this.vy * Math.sin((this.direction) * Math.PI / 180) > 0)) {
            return;
        }
        this.ax = this.acceleration * Math.cos(this.direction * Math.PI / 180);
        this.ay = this.acceleration * Math.sin(this.direction * Math.PI / 180);
    }
}

Bomber.prototype.brake = function() {
    if (this.alive) {
        if (!(this.vx * Math.cos((this.direction) * Math.PI / 180) > 0 ||
                this.vy * Math.sin((this.direction) * Math.PI / 180) > 0)) {
            this.vx = 0;
            this.vy = 0;
            return;
        } else if (this.setSpeed() < 0.2 * this.maxSpeed) {
            return;
        } else {
            this.ax = -this.acceleration * Math.cos(this.direction * Math.PI / 180);
            this.ay = -this.acceleration * Math.sin(this.direction * Math.PI / 180);
        }
    }
}

Bomber.prototype.turn = function(angle) {
    if (this.alive) {
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
}

Bomber.prototype.throwBomb = function() {
    if (this.alive && this.numOfBombs > 0) {
        this.numOfBombs--;
        var bombX;
        var bombY;

        // The following is required to keep the same relative position of the bomb regardless
        // the direction of the bomber
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

        // Distance between the origin and the center of the bomber
        bombX -= this.width / 2;
        bombY -= this.height / 2;

        // Creates a new bullet in the given coordinates
        this.bombs.push(new Bomb(this.x + this.width / 3 + bombX,
            this.y + this.height / 3 + bombY,
            this.width / 3, this.height / 3,
            this.direction,
            this.speed,
            this.bombType));
    }
}

Bomber.prototype.shootBullet = function() {
    if (this.alive) {
        var bulletX;
        var bulletY;

        // The following is required to keep the same relative position of the bullet regardless
        // the direction of the bomber
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

        // Distance between the origin and the center of the bomber
        bulletX -= this.width / 2;
        bulletY -= this.height / 2;

        // Creates a new bullet in the given coordinates

        // Play sound
        ion.sound.play("bullet-shot");
        this.bullets.push(new Bullet(this.x + this.width / 3 + bulletX,
            this.y + this.height / 3 + bulletY,
            this.width / 5, this.height / 5 * 2 / 3,
            this.direction,
            1000,
            this.bulletType));
    }
}

Bomber.prototype.collide = function(collidedWith, originCollision) {
    if (this.alive) {
        this.health -= collidedWith.damage;
        if (this.health <= 0) {
            this.alive = false;

            // Correct width and height due to different sizes of dead and alive images
            // this.width *= (this.imageDead.naturalWidth / this.imageLive.naturalWidth);
            // this.height *= (this.imageDead.naturalHeight / this.imageLive.naturalHeight);

            this.imageLive = this.imageDead;
            this.numOfLives -= 1;
            this.speed = 0;
            this.vx = 0;
            this.vy = 0;
            this.ax = 0;
            this.ay = 0;
        }
    }
}
