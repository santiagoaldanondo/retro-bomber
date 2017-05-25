function Background(x, y, image) {
    Drawable.call(this, x, y);
    this.image = image;
}
// Set the Background to inherit from Drawable
Background.prototype = Object.create(Drawable.prototype);
Background.prototype.constructor = Background;

// Overrides the draw method from the parent Drawable
Background.prototype.draw = function() {
    // Move the position of the background according to the viewport
    this.x = -viewX;
    this.y = -viewY
    ctx.drawImage(this.image, this.x, this.y, worldWidth, worldHeight);
}