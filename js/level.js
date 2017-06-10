// Declare global variables to avoid no-undef errors from Eslint:
/*global Background Base:true*/

// Create the class Level
function Level(levelNumber) {
    this.levelNumber = levelNumber;
    this.maxLevel = 0;
    this.backgroundImage = new Background(0, 0, document.getElementById("backgroundImage" + this.levelNumber));
    this.worldWidth = document.getElementById("backgroundImage" + this.levelNumber).naturalWidth;
    this.worldHeight = document.getElementById("backgroundImage" + this.levelNumber).naturalHeight;
    this.bases = [];
}

// Sets the level prototype
Level.prototype.constructor = Level;

// Create new methods for the Level class
Level.prototype.start = function() {

    // populates the bases depending on the level
    this.bases.push(new Base(400, this.worldHeight - 100, 100, 100, document.getElementById("base1"), 0.01, 100, 100));
    this.bases.push(new Base(600, this.worldHeight - 100, 100, 100, document.getElementById("base1"), 0.01, 100, 100));
    this.bases.push(new Base(800, this.worldHeight - 100, 100, 100, document.getElementById("base1"), 0.01, 100, 100));
    this.bases.push(new Base(1000, this.worldHeight - 100, 100, 100, document.getElementById("base1"), 0.01, 100, 100));
    this.bases.push(new Base(1200, this.worldHeight - 100, 100, 100, document.getElementById("base1"), 0.01, 100, 100));
    this.bases.push(new Base(1400, this.worldHeight - 100, 100, 100, document.getElementById("base1"), 0.01, 100, 100));
    this.bases.push(new Base(1600, this.worldHeight - 100, 100, 100, document.getElementById("base1"), 0.01, 100, 100));
}

// save maxLevel to local storage
Level.prototype.saveToLocal = function() {
    if (this.levelNumber > this.maxLevel) {
        this.maxLevel = this.levelNumber;
        localStorage.setItem("maxLevel", this.maxLevel);
    }
}

// get maxLevel from local storage if it exists
Level.prototype.getFromLocal = function() {
    if (localStorage.maxLevel) {
        this.maxLevel = parseInt(localStorage.maxLevel);
    }
}