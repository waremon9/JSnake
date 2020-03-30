# JS project : Snake game

## How to play

To access the website, you'll need a http server.
You can do that easily by typing a command in a terminal :
- On windows : `python -m http.server`
- On linux : `python3.8 -m http.server`

Then entering `http://localhost:8000/` in a browser and choosing the `Snake.html` file.
Then just click on the **Start playing** button to get to the level selection menu.
Select the wanted level and press the **start new game** button.
If you loose, you can choose between 2 buttons :
- **Go back to menu**; that button will bring you back to the selection menu
- **New game**; that button will start a new game on the current level

## Level selection

You can choose between 5 levels :
- Level 1 : The basic; there is only the snake and food
- Level 2 : The maze; there is the snake, food and walls
- Level 3 : The ice-field; there is the snake, food and ice panels
- Level 4 : The portal remake; there is the snake, food and portals
- Level 5 : The test room; everything is available in this room

## Mechanics

The game implements the basic mechanics of snake and a few new ones :
- food : adds a block to the snake when eaten
- wall : game over if you crash against it
- ice : can't change direction while on it
- portal : teleports you to the other portal block

## Game over

If you die : by hitting a wall, a border or yourself, you'll have a choice between 2 buttons :
- `Go back to menu` --> it'll bring you back to the level selection menu
- `New game` --> it'll start a new game on the current map


### Authors : Verhille Thomas, Chausseau Daniel