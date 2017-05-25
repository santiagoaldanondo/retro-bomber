function Drawable(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.width = 0;
    this.height = 0;
}

// Define draw method to be implemented in child objects
Drawable.prototype.draw = function() {};