function create_sub() {
  // sub all buttons to event
    document.getElementById("start")
      .addEventListener('click', startclicked)
  }
// wait for window to load
window.addEventListener("load", create_sub);

function startclicked(){
  // Click on start button and make it disapear and start the game
  document.getElementById("menu").removeChild
    (document.getElementById("start"));
  newGame();
  drawBoard();
}

function newGame(){
  // Delete canvas from last game if exist
  let oldCan = document.getElementById("myCanvas");
  if(oldCan != null){
    let abc = document.getElementById("game")
    abc.textContent = ""; //clear everything, Not the best way but, hey, it works.
  }
  // Create a new canvas according to the size of the world
  let el = document.createElement("div");
  let width = world[1].length*spaceSize;
  let height = world.length*spaceSize;
  let can =  "<canvas id='myCanvas' width='"+ width
    + "' height='"+ height +"'>";
  el.innerHTML = can;
  document.getElementById("game").appendChild(el);
  //Reset snake
  Snake = [[0,0],[1,0],[2,0]];
  direction = RIGHT;
}

function step(){
  //main function of the game. advance the game step by step.

  //Set the new direction taken by the snake according to last key pressed
  //The snake cannot do 180° and will continue forward
  switch(key){
    case UP:
      if(direction!=DOWN) direction = UP;
      break;
    case DOWN:
      if(direction!=UP) direction = DOWN;
      break;
    case RIGHT:
      if(direction!=LEFT) direction = RIGHT;
      break;
    case LEFT:
      if(direction!=RIGHT) direction = LEFT;
      break;
    default:
      break;
  }
}

//Some usefull variable
var key;
var direction;
var score;
var UP = 0;
var RIGHT = 1;
var DOWN = 2;
var LEFT = 3;

// Define the space state
var EMPTY = 0;
var SNAKE_BODY = 1;
var SNAKE_HEAD = 2;
var FOOD = 3;
var WALL = 4;

// Array containing the actual state of the game
var world = [
  [SNAKE_BODY, SNAKE_BODY, SNAKE_HEAD, EMPTY, EMPTY, EMPTY],
  [EMPTY, WALL, EMPTY, FOOD,  EMPTY, EMPTY],
  [EMPTY, WALL, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, WALL, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, WALL, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, WALL, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, WALL, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, WALL, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, WALL, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
];

// Array of the actual snake position from back to head
var Snake = [[0,0],[1,0],[2,0]];

// global size of each space
spaceSize = 50;

//define some color
var BLACK = "#000000";
var RED = "#FF0000";
var GREEN = "#00FF00";
var DARK_GREEN = "#00AA00";
var BROWN = "#582900";
var LIGHT_GREY = "#AAAAAA";

function drawBoard(){
  // Draw the whole game on the canvas

  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");

  // Define useful variable.
  canHeight = canvas.height;
  canWidth = canvas.width;

  //coloring space acording to what they contain
  var x = 0;
  var y = 0;
  world.forEach(line => { //for every line

    line.forEach(space => { //for every space in the line
      switch(space){ //set the color
        case EMPTY:
          ctx.fillStyle = LIGHT_GREY;
          break;
        case SNAKE_BODY:
          ctx.fillStyle = GREEN;
          break;
        case SNAKE_HEAD:
          ctx.fillStyle = DARK_GREEN;
          break;
          case FOOD:
            ctx.fillStyle = RED;
            break;
        case WALL:
          ctx.fillStyle = BROWN;
          break;
        default:
          break;
      }
      //fill the space with the color
      ctx.fillRect(x*spaceSize, y*spaceSize,x*spaceSize+spaceSize-1,
                  y*spaceSize+spaceSize-1)
      x++;
    })
    x=0;
    y++;
  });

  //draw the grid
  ctx.beginPath();
  ctx.strokeStyle = BLACK;
  for(var i = 0; i<world[1].length+1; i++){
    ctx.moveTo(spaceSize*i,0);
    ctx.lineTo(spaceSize*i,canHeight);
  }
  for(var j = 0; j<world.length+1; j++){
    ctx.moveTo(0,spaceSize*j);
    ctx.lineTo(canWidth,spaceSize*j);
  }
  ctx.stroke();
}