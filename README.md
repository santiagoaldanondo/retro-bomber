# Retro bomber game

## Introduction

Retro bomber is a 2D game built with Javascript and Jquery. It basically uses a canvas to draw the bomber that the player will use to destroy all the enemies in the battlefield.

## Game commands

Use the following keys to play this game:
* Right key: accelerate
* Left key: brake
* Up key: head up
* Down key: head down
* B key: throw bomb
* Space key: shoot bullet

## Bugs

* Fix the delay when using multiple keys at the same time. When a key is pressed and a second key is pressed, there is a delay after which both keys work ok.
* Fix the collision to allow only one collision bewteen two objects. Right now one bullet will collide several times with an enemy.
* Fix the deletion of bullets and bombs after collision. Right now when the setTimeout is over it removes all the bullets after the one that collided.

## Next steps

* Create floor, walls and ceiling. ?? Maybe in the background object
* ?? Check collision of bombs and bullets with bomber.
* Create score, put it on the screen and update it.
* ?? Create a small canvas to show the current viewport position in the whole map.
* Refactorize classes, inheritance and methods. Maybe use functional programming.
* Create models for different bombers, bases, bombs and bullets.
* Create an html page to chose the models.
* Create levels with different backgrounds and modify methods to make it more difficult.



