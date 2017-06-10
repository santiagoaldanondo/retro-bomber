// Declare global variables to avoid no-undef errors from Eslint:
/*global Background Base:true*/

// Create the class Level
function Level(levelNumber) {
    this.levelNumber = levelNumber;
    this.maxLevel = 0;
    if (this.levelNumber < 7) {
        this.levelImage = this.levelNumber;
    } else {
        this.levelImage = Math.floor(Math.random() * 6 + 1);
    }
    this.backgroundImage = new Background(0, 0, document.getElementById("backgroundImage" + this.levelImage));
    this.worldWidth = document.getElementById("backgroundImage" + this.levelImage).naturalWidth;
    this.worldHeight = document.getElementById("backgroundImage" + this.levelImage).naturalHeight;
    this.bases = [];
}

// Sets the level prototype
Level.prototype.constructor = Level;

// Create new methods for the Level class
Level.prototype.start = function() {

    // Sets the number of bases for the level
    var basesPerLevel = 2 + Math.floor(Math.random() * 2) + this.levelNumber;

    // populates the bases depending on the level
    for (var i = 0; i < basesPerLevel; i++) {

        // Gets a random number for the image
        var imageNumber = Math.floor(Math.random() * 3) + 1;

        // Sets properties for each base, dependant on the level
        var baseShootingPace = Math.floor(Math.random() * 100) / 10000 + this.levelNumber * 0.01;
        var baseHealth = 50 + Math.floor(Math.random() * 30) + this.levelNumber * 40;
        var baseWorth = 50 + Math.floor(Math.random() * 30) + this.levelNumber * 40;
        var baseAccuracy = Math.floor(Math.random() * 100) / 10000 + this.levelNumber * 0.01;
        var baseRotationSpeed = Math.random() * 2;

        this.bases[i] = new Base(Math.random() * (this.worldWidth - 80) + 40,
            Math.random() * (this.worldHeight - 40) + 20,
            100,
            100,
            document.getElementById("base" + imageNumber),
            document.getElementById("base" + imageNumber + "-dead"),
            baseShootingPace,
            baseHealth,
            baseWorth,
            baseAccuracy,
            baseRotationSpeed);
    }
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