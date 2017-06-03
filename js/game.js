// Declare global variables to avoid no-undef errors from Eslint:
/*global players bases gravity detectCollision ctx:true*/

// Declares the players
var players = [];

// Declares the military bases
var bases = [];

// Declares the explosions
var explosions = [];

// Defines the gravity
var gravity = 100;

function detectCollision(obj1, obj2) {
    //  x, y, r for obj1
    //  obj2.x, obj2.y for obj2.

    // create a vector aligned to obj1's direction

    var xdx = Math.cos(obj1.direction * Math.PI / 180);
    var xdy = Math.sin(obj1.direction * Math.PI / 180);

    // transform to obj1's location and rotation
    ctx.setTransform(xdx, xdy, -xdy, xdx, obj1.x, obj1.y);

    // create inverted matrix for obj1
    // Only invert obj1 matrix once per frame

    var d = xdx * xdx + xdy * xdy;
    var xIx = xdx / d;
    var xIy = -xdy / d;
    // I am skipping c,d of the matrix as it is perpendicular to a,b
    // thus c = -b and d = a
    var ix = (-xdy * obj1.y - xdx * obj1.x) / d;
    var iy = -(xdx * obj1.y - xdy * obj1.x) / d;

    // For each obj2 per obj1
    // multiply the obj2 with the inverted obj1 matrix
    // obj2 local x & y
    var blx = obj2.x * xIx - obj2.y * xIy + ix;
    var bly = obj2.x * xIy + obj2.y * xIx + iy;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // and you are done.
    if (blx > -obj1.width / 2 && blx < obj1.width / 2 && bly > -obj1.height / 2 && bly < obj1.height / 2) {
        return true;
    }
    return false;
}
