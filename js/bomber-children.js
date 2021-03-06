// Declare global variables to avoid no-undef errors from Eslint:
/*global Bomber Bomb Bomb1 Bomb2 Bomb3 Bullet Bullet1 Bullet2 Bullet3 ctx viewX viewY timeRender ion:true*/

// Create children of the Bomber class. These children classes will be the ones chosen by the player

// Create the class Bomber1, that will inherit from the class Bomber
function Bomber1() {
    this.x = 0;
    this.y = 0;
    this.imageLive = document.getElementById("bomber1");
    this.imageDead = document.getElementById("bomber1-dead");
    this.currentImage = this.imageLive;
    this.width = 80;
    this.height = this.width * this.currentImage.naturalHeight / this.currentImage.naturalWidth;
    this.acceleration = 400;
    this.maxSpeed = 600;
    this.agility = 5;
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
    this.maxScore = 0;
    this.bombs = [];
    this.bullets = [];
    this.numOfBombs = 10;
    this.maxBombs = this.numOfBombs;
    this.bombType = Bomb1;
    this.bulletType = Bullet1;
    this.name = "Crazy Bomber"
}

// Set the Bomber1 to inherit from Bomber
Bomber1.prototype = Object.create(Bomber.prototype);
Bomber1.prototype.constructor = Bomber1;


// Create the class Bomber2, that will inherit from the class Bomber
function Bomber2() {
    this.x = 0;
    this.y = 0;
    this.imageLive = document.getElementById("bomber2");
    this.imageDead = document.getElementById("bomber2-dead");
    this.currentImage = this.imageLive;
    this.width = 80;
    this.height = this.width * this.currentImage.naturalHeight / this.currentImage.naturalWidth;
    this.acceleration = 700;
    this.maxSpeed = 800;
    this.agility = 6;
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
    this.maxScore = 0;
    this.bombs = [];
    this.bullets = [];
    this.numOfBombs = 3;
    this.maxBombs = this.numOfBombs;
    this.bombType = Bomb2;
    this.bulletType = Bullet2;
    this.name = "Angry Fighter";
}

// Set the Bomber2 to inherit from Bomber
Bomber2.prototype = Object.create(Bomber.prototype);
Bomber2.prototype.constructor = Bomber2;


// Create the class Bomber2, that will inherit from the class Bomber
function Bomber3() {
    this.x = 0;
    this.y = 0;
    this.imageLive = document.getElementById("bomber3");
    this.imageDead = document.getElementById("bomber3-dead");
    this.currentImage = this.imageLive;
    this.width = 80;
    this.height = this.width * this.currentImage.naturalHeight / this.currentImage.naturalWidth;
    this.acceleration = 800;
    this.maxSpeed = 400;
    this.agility = 10;
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
    this.maxScore = 0;
    this.bombs = [];
    this.bullets = [];
    this.numOfBombs = 4;
    this.maxBombs = this.numOfBombs;
    this.bombType = Bomb3;
    this.bulletType = Bullet3;
    this.name = "Deadly Acrobat";
}

// Set the Bomber3 to inherit from Bomber
Bomber3.prototype = Object.create(Bomber.prototype);
Bomber3.prototype.constructor = Bomber3;