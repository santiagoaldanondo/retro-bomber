// Declare global variables to avoid no-undef errors from Eslint:
/*global Bullet gravity ctx viewX viewY timeRender:true*/

function Bullet1(x, y, width, height, direction) {
    Bullet.call(this, x, y);
    this.width = width;
    this.height = height;
    this.imageLive = document.getElementById("bullet1");
    this.direction = direction;
    this.speed = 1000;
    this.vx = this.speed * Math.cos(this.direction * Math.PI / 180);
    this.vy = this.speed * Math.sin(this.direction * Math.PI / 180);
    this.ax = 0;
    this.ay = 0;
    this.damage = 5;
}

// Set the Bullet1 to inherit from Bullet
Bullet1.prototype = Object.create(Bullet.prototype);
Bullet1.prototype.constructor = Bullet;

function Bullet2(x, y, width, height, direction) {
    Bullet.call(this, x, y);
    this.width = width;
    this.height = height;
    this.imageLive = document.getElementById("bullet2");
    this.direction = direction;
    this.speed = 800;
    this.vx = this.speed * Math.cos(this.direction * Math.PI / 180);
    this.vy = this.speed * Math.sin(this.direction * Math.PI / 180);
    this.ax = 0;
    this.ay = 0;
    this.damage = 15;
}

// Set the Bullet2 to inherit from Bullet
Bullet2.prototype = Object.create(Bullet.prototype);
Bullet2.prototype.constructor = Bullet;

function Bullet3(x, y, width, height, direction) {
    Bullet.call(this, x, y);
    this.width = width;
    this.height = height;
    this.imageLive = document.getElementById("bullet3");
    this.direction = direction;
    this.speed = 1200;
    this.vx = this.speed * Math.cos(this.direction * Math.PI / 180);
    this.vy = this.speed * Math.sin(this.direction * Math.PI / 180);
    this.ax = 0;
    this.ay = 0;
    this.damage = 10;
}

// Set the Bullet4 to inherit from Bullet
Bullet3.prototype = Object.create(Bullet.prototype);
Bullet3.prototype.constructor = Bullet;

function Missile1(x, y, width, height, direction) {
    Bullet.call(this, x, y);
    this.width = width;
    this.height = height;
    this.imageLive = document.getElementById("missile1");
    this.direction = direction;
    this.speed = 200;
    this.vx = this.speed * Math.cos(this.direction * Math.PI / 180);
    this.vy = this.speed * Math.sin(this.direction * Math.PI / 180);
    this.ax = 0;
    this.ay = 0;
    this.damage = 5;
}

// Set the Missile1 to inherit from Bullet
Missile1.prototype = Object.create(Bullet.prototype);
Missile1.prototype.constructor = Bullet;