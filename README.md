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
 * Check all the possible collision between objects.
 * Draw all the objects.


## Game commands

Use the following keys to play this game:
* Right key: accelerate
* Left key: brake
* Up key: head up
* Down key: head down
* B key: throw bomb
* Space key: shoot bullet

## Bugs
4. Need to show the explosion of the bullets and bombs when they collide.

## Next steps

* Create floor, walls and ceiling. ?? Maybe in the background object
* ?? Check collision of bombs and bullets with bomber.
* Create score, put it on the screen and update it.
* ?? Create a small canvas to show the current viewport position in the whole map.
* Refactorize classes, inheritance and methods. Maybe use functional programming.
* Create models for different bombers, bases, bombs and bullets.
* Create an html page to chose the models.
* Create levels with different backgrounds and modify methods to make it more difficult.
* Add sounds.
* Add transitions to collisions.
* Add gravity to Bomber.
* Forbid going backwards or otherwise change the bullets and bombs' direction.
* Add friction and lift forces

## Fixed bugs

1. Fix the delay when using multiple keys at the same time. When a key is pressed and a second key is pressed, there is a delay after which both keys work ok. __--> Fixed by taking the validation of the keys pressed outside of the onkeyup and onkeydown event. Instead, that validation is run inside the render function.__  

2. Fix the deletion of bullets and bombs after collision. Right now when the setTimeout is finished, it removes all the bullets after the one that collided. __--> Deleted the setTimeOut, so the element (bullet or bomb) is removed from its array as soon as it collides. However I need to find a way to show the explosion for a couple of seconds.__

3. Fix the collision to allow only one collision bewteen two objects. Right now one bullet will collide several times with an enemy. __--> Fixed by removing the element (bomb or bullet) from the array as soon as it collides. The problem is that I need to create an explosion object outside from bullets and bombs instead of using a dead image.__


