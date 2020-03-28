var nbLevel = 1; //used only for the comboBox level, up here for easy access
var selectedLevel; //keep in memory the selected level in case of restart

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
  let combo = "<select name='comboLevels'>";
  for (var i = 0; i<nbLevel; i++){
  	combo += "<option>"+(i+1)+"</option>";
  }
  combo+="</select>";
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
  //get level number
  let levelNumber;
  if(document.querySelector('[name=comboLevels]')==null){
    levelNumber = selectedLevel;
  } else {
    levelNumber = document.querySelector('[name=comboLevels]').value;
  }
  //delete the menu
  document.getElementById("menu").textContent = "";

  //go get the data and use them before callin new game
  selectedLevel = levelNumber;
  getJSONContentMap(levelNumber);
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
  el.setAttribute("id", "js-Canvas");
  let width = world[0].length * spaceSize;
  let height = world.length*spaceSize;
  let can =  "<canvas id='myCanvas' width='"+ width
    + "' height='"+ height +"'></canvas>";
  let score = "<p id='score2'>Score: <span id='score'>0</span></p>";
  el.innerHTML = score + can;
  document.getElementById("game").appendChild(el);
  //Reset snake
  score = 0;
  key = null;

  drawBoard();
  loop = setInterval(playGame, gameSpeed);
}

function step(){
  //main function of the game. advance the game step by step.

  //get future position of head and what it encounter
  let nextHeadPosition = Snake[Snake.length-1].slice();//actual, updated after switch
  //Set the new direction taken by the snake according to last key pressed
  //The snake cannot do 180° and will continue forward
  //it cannot change if on ice
  if(positionType != ICE && positionType != PORTAL){
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
  if(positionType == PORTAL){
    if(listPortal[0][0] == nextHeadPosition[0] && listPortal[0][1] == nextHeadPosition[1] ){
      nextHeadPosition[0] = listPortal[1][0];
      nextHeadPosition[1] = listPortal[1][1];
    }else{
      nextHeadPosition[0] = listPortal[0][0];
      nextHeadPosition[1] = listPortal[0][1];
    }
  }
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
    positionType = world[nextHeadPosition[1]][nextHeadPosition[0]];
    //not a switch because we can't check all case at once since snake's butt's last
    //space isn't empty yet and we need to keep it until we checked if food is eaten.
    if(positionType==FOOD){ //check for food first
      audioEat.play();//play sound
      gameSpeed = Math.round(gameSpeed/0.9);
      score+=10;
      document.getElementById("score").textContent = score;//update score display
      //delete the eaten food from the list (there can be multiple food at once)
      let i = 0;
      listFood.forEach(element => {
        if(element[0] == nextHeadPosition[0] && element[1] == nextHeadPosition[1]) index = i;
      });
      if (index > -1) {
        listFood.splice(index, 1);
      }
      newApple();
      var xy = [-1,-1];
    }else{
      //delete current butt
      var xy = Snake.shift();
    }
    if(positionType==WALL || positionType==SNAKE_BODY){//then check for wall or body part
      if(!(nextHeadPosition[0]==xy[0] && nextHeadPosition[1]==xy[1])){//except for the very last part. it move at the same time so they don't collide
        dead = true;
      }
    }
    
  }

  //update the world
  updateWorld();

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
  //add it to the list
  let foodSpace = possibleSpace[random];
  listFood.push([foodSpace[0],foodSpace[1]]);
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
var gameSpeed;
var loop;
var listWall = [];
var listIce = [];
var listPortal = [];
var listFood = [];
var world = [];
var worldHeight;
var worldWidth;
var positionType;

//sounds variables
var audioEat = new Audio("yoshi-tongue.mp3");

// Define the space state
var EMPTY = 0;
var SNAKE_BODY = 1;
var SNAKE_HEAD = 2;
var FOOD = 3;
var WALL = 4;
var ICE = 5;
var PORTAL = 6;

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
var DARK_BLUE = "#2000AA";
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
  el.setAttribute("id", "js-GameOver")
  let butMenu = "<input type='button' name='menu' value='Go back to menu' id='menuBut'>";
  let butAgain = "<input type='button' name='again' value='New game' id='againBut'>";
  el.innerHTML = butMenu +  butAgain;
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
        case SNAKE_BODY:
          ctx.fillStyle = PINK;
          break;
        case SNAKE_HEAD:
          ctx.fillStyle = LIGHT_ORANGE;
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
        case PORTAL:
          ctx.fillStyle = DARK_BLUE;
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

function updateWorld(){
  world = [];
  for(var y = 0; y<worldHeight; y++){
    let line = [];
    for(var x = 0; x<worldWidth; x++){
      if(listWall.some(e => e[0]==x && e[1]==y)) line.push(WALL);
      else if(listPortal.some(e => e[0]==x && e[1]==y)) line.push(PORTAL);
      else if(listFood.some(e => e[0]==x && e[1]==y)) line.push(FOOD);
      else if(Snake.some(e => e[0]==x && e[1]==y)){
        if(Snake[Snake.length-1][0] == x && Snake[Snake.length-1][1] == y) line.push(SNAKE_HEAD);
        else line.push(SNAKE_BODY);
      }
      else if(listIce.some(e => e[0]==x && e[1]==y)) line.push(ICE);
      else line.push(EMPTY);
    }
    world.push(line);
  }
}

function updateVariable(data){
  worldWidth = data.dimensions[0];
  worldHeight = data.dimensions[1];
  listWall = data.walls;
  listIce = data.ice;
  listPortal = data.portal;
  Snake = data.snake;
  listFood = data.food;
  updateWorld();
  gameSpeed = data.delay;
  switch(data.startDirection){
    case "UP":
      direction = UP;
      break;
    case "DOWN":
      direction = DOWN;
      break;
    case "RIGHT":
      direction = RIGHT;
      break;
    case "LEFT":
      direction = LEFT;
      break;
    default:
      console.log("Error data direction")
      break;
  }
  newGame();
}