// Declare global variables to avoid no-undef errors from Eslint:
/*global Drawable gravity ctx viewX viewY timeRender:true*/

function Bomb1(x, y, direction, speed) {
    Bomb.call(this, x, y, direction, speed);
    this.width = width;
    this.height = height;
    this.imageLive = document.getElementById("bomb1");
    this.direction = direction;
    this.speed = speed;
    this.vx = this.speed * Math.cos(this.direction * Math.PI / 180);
    this.vy = this.speed * Math.sin(this.direction * Math.PI / 180);
    this.ax = 0;
    this.ay = gravity;
    this.alive = true;
    this.damage = 100;
    this.life = 0;
}