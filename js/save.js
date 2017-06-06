// Declare global variables to avoid no-undef errors from Eslint:
/* global players bases explosions saveToLocal deleteFromLocal:true*/

// Use local storage to save the current status of the game.

// First add method to store arrays or objects to localStorage (that only works with strings)
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

// save to local storage
function saveToLocal() {
    localStorage.setItem("score", players[0].score)
    localStorage.setItem("numOfLives", players[0].numOfLives)
}

// delete from local storage
function deleteFromLocal() {
    localStorage.removeItem("score");
    localStorage.removeItem("numOfLives");
}