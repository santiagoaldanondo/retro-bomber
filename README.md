# Retro bomber game

## Introduction

Retro bomber is a 2D game built with Javascript and Jquery. It uses a canvas to draw the bomber that the player will use to destroy all the enemies in the battlefield.

## Main functionalities implemented

* Use of a big image and creation of a viewport that shows only part of it, depending on the position of the player. The player will be in the center of the viewport unless it is too close to the borders.
* Use of a parent class (Drawable) from which all other classes inherit (Background, Bomber, Base, Bomb and Bullet). Each class has its own Javascript file. 
* Apart from the Javascript for the classes, there are two more Javascript files, game.js with the functions that are not related to the view and app.js with the functions that manage the view.
* Draw method using setTransform from HTML5 canvas, allowing to draw rotated images.
* Physics concepts used for acceleration, speed and position of the objects.
* Shooting methods allow one class to create objects of another class.
* A global collision function deals with all possible collisions between objects.
* The onkeyup and onkeydown events are used to manage an array with the keys that are pressed at any moment.
* The render function is used to run all that is required:
 * Check the keys that are pressed to run the corresponding methods
 * Check all the possible collision between objects (ally fire damage is prevented)  
 * Remove all the projectiles that is off screen in order to free memory.
 * Draw all the objects.
* Enemies shoot in auto mode aiming towards the player's position.

## Game commands

Use the following keys to play this game:
* Right key: accelerate
* Left key: brake
* Up key: head up
* Down key: head down
* B key: throw bomb
* Space key: shoot bullet

## Bugs


## Next steps

* DONE: Create floor, walls and ceiling. ?? Maybe in the background object
* DONE: Check collision of bombs and bullets with bomber.
* DONE: Create score, health and number of lives, put it on the screen and update it.
* DONE: Create models for different bombers, bases, bombs and bullets.
* DONE: Create an html page to choose the models.
* DONE: Create levels with different backgrounds and modify methods to make it more difficult.
* DONE: Add sounds.
* DONE: Add transitions to collisions.
* DONE: Use browser localStorage to save information.
* DONE: Create a new property image for bombers and toggle the imageAlive and imageDead. Check sizes for the planes due to different widths and heights.
* DONE: Prevent bombs from being accidentaly thrown in a row 
* DONE: Forbid going backwards or otherwise change the bullets and bombs' direction.
* DONE: Change the document.ready from JQuery to window.onload from Javascript. Remove JQuery library from the project.
* DONE: Remove gravity from bullets. Only bombs will be affected by gravity. 
* NO: Create a small canvas to show the current viewport position in the whole map.
* NO: Refactorize classes, inheritance and methods. Maybe use functional programming.
* NO: Add gravity to Bomber.
* NO: Add friction and lift forces
* NO: Change the css of the board.
* Show the number of lives with a number of images instead of a number. 
* Create a bonus object that gives random prizes to the player.
* Create more random messages to toggle them in the start screen.

## Fixed bugs

1. Fix the delay when using multiple keys at the same time. When a key is pressed and a second key is pressed, there is a delay after which both keys work ok. __--> Fixed by taking the validation of the keys pressed outside of the onkeyup and onkeydown event. Instead, that validation is run inside the render function.__  

2. Fix the deletion of bullets and bombs after collision. Right now when the setTimeout is finished, it removes all the bullets after the one that collided. __--> Deleted the setTimeOut, so the element (bullet or bomb) is removed from its array as soon as it collides. However I need to find a way to show the explosion for a couple of seconds.__

3. Fix the collision to allow only one collision bewteen two objects. Right now one bullet will collide several times with an enemy. __--> Fixed by removing the element (bomb or bullet) from the array as soon as it collides. The problem is that I need to create an explosion object outside from bullets and bombs instead of using a dead image.__

4. Need to show the explosion of the bullets and bombs when they collide. __--> Fixed by creating an Explosion class. When a projectile collides, a new explosion is created. The explosions have a lifetime after which they are deleted.__

5. Explosions are very small after creating children classes for bombers. __--> Fixed by increasing the value by which their width and height are multiplied.__

6. Cannot remove keys from localStorage with localStorage.removeItem(key). __--> I was saving to localstorage when rendering, I fixed the conditions to set and get from/to localStorage.__

7. Multiple bombs can be thrown on a single click. __--> Include conditions for the key used to throw bombs, requiring a keyup event before the key can be set to true again and trigger a throw bomb.__


