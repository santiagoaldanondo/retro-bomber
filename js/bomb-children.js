// Declare global variables to avoid no-undef errors from Eslint:
/*global Bomb gravity ctx viewX viewY timeRender:true*/

function Bomb1(x, y, width, height, direction, speed) {
    Bomb.call(this, x, y);
    this.width = width;
    this.height = height;
    this.imageLive = document.getElementById("bomb1");
    this.direction = direction;
    this.speed = speed;
    this.vx = this.speed * Math.cos(this.direction * Math.PI / 180);
    this.vy = this.speed * Math.sin(this.direction * Math.PI / 180);
    this.ax = 0;
    this.ay = gravity;
    this.damage = 150;
}

// Set the Bomb1 to inherit from Bomb
Bomb1.prototype = Object.create(Bomb.prototype);
Bomb1.prototype.constructor = Bomb;

function Bomb2(x, y, width, height, direction, speed) {
    Bomb.call(this, x, y);
    this.width = width;
    this.height = height;
    this.imageLive = document.getElementById("bomb2");
    this.direction = direction;
    this.speed = speed;
    this.vx = this.speed * Math.cos(this.direction * Math.PI / 180);
    this.vy = this.speed * Math.sin(this.direction * Math.PI / 180);
    this.ax = 0;
    this.ay = gravity;
    this.damage = 200;
}

// Set the Bomb2 to inherit from Bomb
Bomb2.prototype = Object.create(Bomb.prototype);
Bomb2.prototype.constructor = Bomb;

function Bomb3(x, y, width, height, direction, speed) {
    Bomb.call(this, x, y);
    this.width = width;
    this.height = height;
    this.imageLive = document.getElementById("bomb3");
    this.direction = direction;
    this.speed = speed;
    this.vx = this.speed * Math.cos(this.direction * Math.PI / 180);
    this.vy = this.speed * Math.sin(this.direction * Math.PI / 180);
    this.ax = 0;
    this.ay = gravity;
    this.damage = 120;
}

// Set the Bomb3 to inherit from Bomb
Bomb3.prototype = Object.create(Bomb.prototype);
Bomb3.prototype.constructor = Bomb;
