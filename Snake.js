function loadMenu(){
  //create the whole menu

  //delete what was here before
  document.getElementById("game").textContent = "";
  document.getElementById("menu").textContent = "";

  //add all button with eventListener
  let el = document.createElement("div");
  el.setAttribute("id", "js-Menu");
  let title = "<h1>Welcome to Snake!</h1>";
  let button = "<input type='button' name='start' value='Start new Game' id='start'>";
  let text = "<p id='choice'>Choose your level :</p>";
  let combo = "<select><option>1</option><option>2</option></select>"
  el.innerHTML = title + button + text + combo;
  document.getElementById("menu").appendChild(el);
  document.getElementById("start")
    .addEventListener('click', startclicked);
}

// wait for window to load
window.addEventListener("load", loadMenu);

//catch correct input
document.addEventListener('keydown', function(event) {
  if(event.keyCode == 37) {
      key = LEFT;
  }
  else if(event.keyCode == 38) {
    key = UP;
  }
  else if(event.keyCode == 39) {
    key = RIGHT;
  }
  else if(event.keyCode == 40) {
    key = DOWN;
  }
});

function startclicked(){
  //delete the menu
  document.getElementById("menu").textContent = "";

  //go get the data and use them before callin new game
  getJSONContentMap(1);
}

function playGame(){
  if(!dead) step();
  else clearInterval(loop);
}

function newGame(){
  dead = false; //not dead when starting
  // Delete canvas from last game if exist
  let oldCan = document.getElementById("myCanvas");
  if(oldCan != null){
    let abc = document.getElementById("game")
    abc.textContent = ""; //clear everything, Not the best way but, hey, it works.
  }

  // Create a new canvas according to the size of the world
  let el = document.createElement("div");
  let width = world[0].length * spaceSize;
  let height = world.length*spaceSize;
  let can =  "<canvas id='myCanvas' width='"+ width
    + "' height='"+ height +"'></canvas>";
  let score = "<p>Score: <span id='score'>0</span></p>";
  el.innerHTML = score + can;
  document.getElementById("game").appendChild(el);
  //Reset snake
  score = 0;
  key = null;
  newApple();

  drawBoard();
  loop = setInterval(playGame,gameSpeed);
}

function step(){
  //main function of the game. advance the game step by step.

  //get future position of head and what it encounter

  let nextHeadPosition = Snake[Snake.length-1].slice();//actual, updated after switch
  let actualPositionType = world[nextHeadPosition[1]][nextHeadPosition[0]];

  //Set the new direction taken by the snake according to last key pressed
  //The snake cannot do 180° and will continue forward
  //it cannot change if on ice
  if(actualPositionType != ICE){
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

  //update the position of the head
  switch(direction){
    case UP:
      nextHeadPosition[1]--;
      break;
    case DOWN:
      nextHeadPosition[1]++;
      break;
    case RIGHT:
      nextHeadPosition[0]++;
      break;
    case LEFT:
      nextHeadPosition[0]--;
      break;
  }
  Snake.push(nextHeadPosition);
  

  //offmap? (dead then)
  if(world[0].length<=nextHeadPosition[0] || nextHeadPosition[0]<0
    || world.length<=nextHeadPosition[1] || nextHeadPosition[1]<0) dead = true;

  //Then check collision with items on map
  if(!dead){
    let nextPositionType = world[nextHeadPosition[1]][nextHeadPosition[0]];
    //not a switch because we can't check all case at once since snake's butt's last
    //space isn't empty yet and we need to keep it until we checked if food is eaten.
    if(nextPositionType==FOOD){ //check for food first
      world[nextHeadPosition[1]][nextHeadPosition[0]] = EMPTY;
      score+=10;
      document.getElementById("score").textContent = score;//update score display
      newApple();
    }else{
      //delete current butt and update world
      var xy = Snake.shift();
    }
    if(nextPositionType==WALL){ //then check for wall
      dead=true;
    }
    Snake.forEach(bodyPart => { //or body part
      if (Snake[Snake.length-1] != bodyPart){  //exclude the head 
        if (bodyPart[0] == nextHeadPosition[0] && bodyPart[1] == nextHeadPosition[1]) dead = true;
        //parceque bodyPart == nextHeadPosition ca marche pas, c'est pas le même tableau
      }   
    });
  }

  //draw the new state
  if(!dead) drawBoard();
  else gameOver();
}

function newApple(){
  //make a new apple appear on the map
  //We get all the empty space to not spawn the apple in a wall or in the snake
  let possibleSpace = [];
  let x = 0;
  let y = 0;
  world.forEach(line => {
    line.forEach(space => {
      if(space == EMPTY){
        //check if space not occupied by snake
        if(!Snake.some(e => e[0]==x && e[1]==y)) possibleSpace.push([x,y]);
      }
      x++;
    })
    y++;
    x=0;
  });
  //choose a random one
  let min=0; 
  let max=possibleSpace.length-1;  
  let random = Math.round(Math.random() * (+max - +min) + +min);
  Math.round
  //put food on it
  let foodSpace = possibleSpace[random];
  world[foodSpace[1]][foodSpace[0]] = FOOD;
}

//Some usefull variable
var key;
var direction;
var score = 0;
var UP = 0;
var RIGHT = 1;
var DOWN = 2;
var LEFT = 3;
var dead = false;
var gameSpeed = 500;
var loop;

// Define the space state
var EMPTY = 0;
var SNAKE_BODY = 1;
var SNAKE_HEAD = 2;
var FOOD = 3;
var WALL = 4;
var ICE = 5;

// Array containing the actual state of the game. content added when JSON file is read. (see line ~330)
var world;

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
var LIGHT_GREY = "rgba(200, 200, 200, 0.5)";
var LIGHT_BLUE = "#AAAAFF";
var PINK = "#FE7E9C";
var LIGHT_ORANGE = "#FFA356";

function gameOver(){
  //game-over screen

  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");

  //Draw a black rectangle with 50% transparency
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  //Then add "Game Over" at the center of the canvas
  ctx.fillStyle = BLACK;
  ctx.font = "40px Algerian";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER",canvas.width/2,canvas.height/2);

  //Add 2 button to restart a game or go back to menu
  let el = document.createElement("div");
  let butMenu = "<input type='button' name='menu' value='Go back to menu' id='menuBut'>";
  let butAgain = "<input type='button' name='again' value='New game' id='againBut'>";
  el.innerHTML = butMenu +  "<br>" + butAgain;
  document.getElementById("menu").appendChild(el);

  //event listener
  document.getElementById("menuBut")
    .addEventListener('click', loadMenu);
  document.getElementById("againBut")
    .addEventListener('click', startclicked);
}

function drawBoard(){
  // Draw the whole game on the canvas

  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");

  //erase
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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
        case FOOD:
          ctx.fillStyle = RED;
          break;
        case WALL:
          ctx.fillStyle = BROWN;
          break;
        case ICE:
          ctx.fillStyle = LIGHT_BLUE;
          break;
        default:
          break;
      }
      //fill the space with the color
      ctx.fillRect(x*spaceSize, y*spaceSize, 
                  spaceSize, spaceSize)
      x++;
    })
    x=0;
    y++;
  });



  //draw the snake on top of the space
  Snake.forEach(position => {
    if(position != Snake[Snake.length-1]) ctx.fillStyle = PINK;
    else ctx.fillStyle = LIGHT_ORANGE;

    ctx.fillRect(position[0]*spaceSize, position[1]*spaceSize,
      spaceSize, spaceSize)
  });

  //draw the grid
  ctx.beginPath();
  ctx.strokeStyle = BLACK;
  for(var i = 0; i<world[0].length+1; i++){
    ctx.moveTo(spaceSize*i,0);
    ctx.lineTo(spaceSize*i,canHeight);
  }
  for(var j = 0; j<world.length+1; j++){
    ctx.moveTo(0,spaceSize*j);
    ctx.lineTo(canWidth,spaceSize*j);
  }
  ctx.stroke();
}

function getJSONContentMap(nb){
  //Get the content of JSON file for map
  var req = new XMLHttpRequest();
  req.open("GET", "JSON/Map"+nb+".json");
  req.onerror = function() {
      console.log("Échec de chargement "+url);
  };
  req.onload = function() {
      if (req.status === 200) {
        var data = JSON.parse(req.responseText);
        //use the data 
        updateVariable(data);
      } else {
        console.log("Erreur " + req.status);
      }
  };
  req.send();
}

function updateVariable(data){
  world = data.map; //new world created from data
  snakeStart = data.startPoint; //initialise snake position and direction
  switch(data.startDirection){
    case "UP":
      Snake = [snakeStart, [snakeStart[0],snakeStart[1]-1] ,[snakeStart[0],snakeStart[1]-2]];
      direction = UP;
      break;
    case "DOWN":
      Snake = [snakeStart, [snakeStart[0],snakeStart[1]+1] ,[snakeStart[0],snakeStart[1]+2]];
      direction = DOWN;
      break;
    case "RIGHT":
      Snake = [snakeStart, [snakeStart[0]+1,snakeStart[1]] ,[snakeStart[0]+2,snakeStart[1]]];
      direction = RIGHT;
      break;
    case "LEFT":
      Snake = [snakeStart, [snakeStart[0]-1,snakeStart[1]] ,[snakeStart[0]-2,snakeStart[1]]];
      direction = LEFT;
      break;
    default:
      console.log("Error data direction")
      break;
  }
  newGame();
}