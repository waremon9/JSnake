//Some usefull variable

var nbLevel = 6; //The number of level for the combobox
var selectedLevel; //keep in memory the selected level in case of restart
var key; // last key key pressed by user
var direction; //direction the snake is facing
var score = 0; //user score

//variables for direction
var UP = 0;
var RIGHT = 1;
var DOWN = 2;
var LEFT = 3;
var dead = false;//if the player is dead or alive
var gameSpeed; //interval in ms for step()
var loop; //value from setInterval(step)

//list for the element in each level
var listWall = [];
var listIce = [];
var listGrass = [];
var listPortal = [];
var listFood = [];
var Snake = [[0,0],[1,0],[2,0]]; // Array of the actual snake position from back to head
var world = []; //state of the game. and the size
var worldHeight;
var worldWidth;
spaceSize = 50;//size of each cells
var positionType;//type of cells the snake head is on

// Define the space variable
var EMPTY = 0;
var SNAKE_BODY = 1;
var SNAKE_HEAD = 2;
var FOOD = 3;
var WALL = 4;
var ICE = 5;
var PORTAL = 6;
var GRASS = 7;
var ICE_FOOD = 8;
var GRASS_FOOD = 9;

//sounds and music variables
var audioEat = new Audio("SFX/yoshi-tongue.mp3");
var audioGameOver = new Audio("SFX/GameOver.mp3");
var musicMenu = new Audio("SFX/StageSelect.mp3");
musicMenu.loop = true;
var musicGame = new Audio("SFX/GamePlay.mp3");
musicGame.loop = true;

//image
var imgApple = new Image();
imgApple.src = 'Images/Apple.png';
var imgPortal = new Image();
imgPortal.src = 'Images/Portal.png';
var imgWall = new Image();
imgWall.src = 'Images/Wall.png';
var imgGrass = new Image();
imgGrass.src = 'Images/Grass.png';
var imgIce = new Image();
imgIce.src = 'Images/Ice.png';
var imgSnakeHead = new Image();
var imgSnakeBody = new Image();
var imgSnakeTurn = new Image();
var imgSnakeEnd = new Image();
imgSnakeHead.src = 'Images/Snake_Head.png';
imgSnakeBody.src = 'Images/Snake_Body.png';
imgSnakeTurn.src = 'Images/Snake_Turn.png';
imgSnakeEnd.src = 'Images/Snake_End.png';

//define some color (with the image, some of them might be unused)
var BLACK = "#000000";
var RED = "#FF0000";
var GREEN = "#00FF00";
var DARK_GREEN = "#00AA00";
var BROWN = "#582900";
var LIGHT_GREY = "rgba(200, 200, 200, 0.3)";
var LIGHT_BLUE = "#AAAAFF";
var DARK_BLUE = "#2000AA";
var PINK = "#FE7E9C";
var LIGHT_ORANGE = "#FFA356";


// wait for window to load
window.addEventListener("load", loadButton);


function loadButton(){
  //Creates the start button

  //Delete what was there before
  document.getElementById("button").textContent = "";

  //Add button
  let el = document.createElement("div");
  el.setAttribute("id", "js-Button");
  let button = "<a href='#' id='open'><span></span><span></span><span></span><span></span>Start playing</a>";
  el.innerHTML = button;
  document.getElementById("button").appendChild(el);
  document.getElementById("open").addEventListener('click', loadMenu);
}


function loadMenu(){
  //create the whole menu

  //delete what was here before
  document.getElementById("button").textContent = "";
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

  //Play the music
  musicGame.pause();
  musicMenu.currentTime = 0;
  musicMenu.play();
}


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


function playGame(){
  if(!dead) step();
  else clearInterval(loop);
}


function newGame(){
  //music
  musicMenu.pause();
  musicGame.currentTime = 0;
  musicGame.play();

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
  let scoreAffichage = "<p id='score2'>Score: <span id='score'>0</span></p>";
  el.innerHTML = scoreAffichage + can;
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
    if(positionType==FOOD || positionType==GRASS_FOOD || positionType==ICE_FOOD){ //check for food first
      audioEat.play();//play sound
      gameSpeed = Math.round(gameSpeed*0.975);
      clearInterval(loop);
      loop = setInterval(playGame, gameSpeed);
      score+=10;
      document.getElementById("score").textContent = score;//update score display
      //delete the eaten food from the list (there can be multiple food at once)
      listFood.forEach((element, i) => {
        console.log(element)
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

  for(let y = 0; y<worldHeight; y++){
    for(let x = 0; x<worldWidth; x++){
      if(world[y][x] == EMPTY || world[y][x] == ICE || world[y][x] == GRASS){
        possibleSpace.push([x,y]);
      }
    }
  }

  //choose a random one
  let min=0;
  let max=possibleSpace.length-1;
  let random = Math.round(Math.random() * (+max - +min) + +min);
  //add it to the list
  let foodSpace = possibleSpace[random];
  console.log([foodSpace[0], foodSpace[1], world[foodSpace[1]][foodSpace[0]] ])
  listFood.push([foodSpace[0], foodSpace[1], world[foodSpace[1]][foodSpace[0]] ]);//x, y, type of cell
}


function gameOver(){
  //game-over screen

  //sound
  musicGame.pause();
  audioGameOver.play();

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

  //coloring cells acording to what they contain
  for(let y = 0; y<worldHeight; y++){ //for every line
    for(let x = 0; x<worldWidth; x++){ //for every cells in the line
      ctx.fillStyle = LIGHT_GREY;
      ctx.fillRect(x*spaceSize, y*spaceSize,
        spaceSize, spaceSize);
      switch(world[y][x]){ //set the color or draw the image
        case EMPTY:
          //already done
          break;
        case SNAKE_BODY:
          ctx.drawImage(imgSnakeBody,x*spaceSize,y*spaceSize);
          break;
        case SNAKE_HEAD:
          ctx.drawImage(imgSnakeHead,x*spaceSize,y*spaceSize);
          break;
        case FOOD:
          ctx.drawImage(imgApple,x*spaceSize,y*spaceSize);
          break;
        case GRASS_FOOD:
          ctx.drawImage(imgGrass,x*spaceSize-3,y*spaceSize-3);
          ctx.drawImage(imgApple,x*spaceSize,y*spaceSize);
          break;
        case ICE_FOOD:
          ctx.drawImage(imgIce,x*spaceSize,y*spaceSize);
          ctx.drawImage(imgApple,x*spaceSize,y*spaceSize);
          break;
        case WALL:
          ctx.drawImage(imgWall,x*spaceSize,y*spaceSize);
          break;
        case ICE:
          ctx.drawImage(imgIce,x*spaceSize,y*spaceSize);
          break;
        case PORTAL:
          ctx.drawImage(imgPortal,x*spaceSize,y*spaceSize);
          break;
        case GRASS:
          ctx.drawImage(imgGrass,x*spaceSize-3,y*spaceSize-3);
          break;
        default:
          break;
      }
    }
  };

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


function updateVariable(data){
  worldWidth = data.dimensions[0];
  worldHeight = data.dimensions[1];
  listWall = data.walls;
  listIce = data.ice;
  listPortal = data.portal;
  listGrass = data.grass;
  Snake = data.snake;

  listFood = [];
  for(let i = 0; i<data.food.length; i++){
    listFood.push([data.food[i][0], data.food[i][1], EMPTY])
  }

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


function updateWorld(){
  world = [];
  for(var y = 0; y<worldHeight; y++){
    let line = [];
    for(var x = 0; x<worldWidth; x++){
      if(listWall.some(e => e[0]==x && e[1]==y)) line.push(WALL);
      else if(listPortal.some(e => e[0]==x && e[1]==y)) line.push(PORTAL);
      else if(listFood.some(e => e[0]==x && e[1]==y && e[2]==EMPTY)) line.push(FOOD);
      else if(listFood.some(e => e[0]==x && e[1]==y && e[2]==GRASS)) line.push(GRASS_FOOD);
      else if(listFood.some(e => e[0]==x && e[1]==y && e[2]==ICE)) line.push(ICE_FOOD);
      else if(listGrass.some(e => e[0]==x && e[1]==y)) line.push(GRASS);
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
