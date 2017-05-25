function Drawable(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 0;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    // Define abstract function to be implemented in child objects
    this.draw = function() {};
}