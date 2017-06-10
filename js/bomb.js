// Declare global variables to avoid no-undef errors from Eslint:
/*global Projectile gravity ctx viewX viewY timeRender:true*/

function Bomb(x, y, width, height, direction, speed, damage, imageLive) {
    Projectile.call(this, x, y);
    this.width = width;
    this.height = height;
    this.imageLive = imageLive;
    this.direction = direction;
    this.speed = speed;
    this.vx = this.speed * Math.cos(this.direction * Math.PI / 180);
    this.vy = this.speed * Math.sin(this.direction * Math.PI / 180);
    this.ax = 0;
    this.ay = gravity;
    this.damage = damage;
}
// Set the Bomb to inherit from Projectile
Bomb.prototype = Object.create(Projectile.prototype);
Bomb.prototype.constructor = Bomb;