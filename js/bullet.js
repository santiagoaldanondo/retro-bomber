// Declare global variables to avoid no-undef errors from Eslint:
/*global Projectile gravity ctx viewX viewY timeRender:true*/

function Bullet(x, y, width, height, direction, speed, damage, imageLive) {
    Projectile.call(this, x, y);
    this.width = width;
    this.height = height;
    this.imageLive = imageLive;
    this.direction = direction;
    this.speed = speed;
    this.vx = this.speed * Math.cos(this.direction * Math.PI / 180);
    this.vy = this.speed * Math.sin(this.direction * Math.PI / 180);
    this.ax = 0;
    this.ay = 0;
    this.damage = damage;
}
// Set the Bullet to inherit from Projectile
Bullet.prototype = Object.create(Projectile.prototype);
Bullet.prototype.constructor = Bullet;
