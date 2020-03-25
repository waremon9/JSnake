function create_sub() {
    document.getElementById("start")
      .addEventListener('click', startclicked)
  }
window.addEventListener("load", create_sub);

function startclicked(){
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
}

var EMPTY = 0;
var SNAKE_BODY = 1;
var SNAKE_HEAD = 2;
var FOOD = 3;
var WALL = 4;

var world = [
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [SNAKE_BODY, WALL, EMPTY, FOOD,  EMPTY, EMPTY],
  [SNAKE_BODY, WALL, EMPTY, EMPTY, EMPTY, EMPTY],
  [SNAKE_BODY, SNAKE_BODY, EMPTY, EMPTY, WALL, EMPTY],
  [EMPTY, SNAKE_BODY, SNAKE_BODY, EMPTY, WALL, EMPTY],
  [EMPTY, EMPTY, SNAKE_HEAD, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, WALL, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, WALL, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, WALL, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, WALL, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
];
  
spaceSize = 50;

//define color
var BLACK = "#000000";
var RED = "#FF0000";
var GREEN = "#00FF00";
var DARK_GREEN = "#00AA00";
var BROWN = "#582900";
var LIGHT_GREY = "#AAAAAA";

function drawBoard(){
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
      //color the space
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