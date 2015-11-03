var canvasX = 0;
var canvasY = 0;

var points = 0;
var counter;
var pause;
var gameLost;
var dynatable;
var socket;
var timerUpdateTable = null;
var timeStamp = 0;

var playerWidth = 30;
var playerStartX = 165;
var playerStartY = 315;

var borderLeft = 10;
var borderRight = playerStartX * 2 + playerWidth - borderLeft;

var endBoxUp = 290;
var endBoxDown = 335;

var startBoxUpX = 290;
var startBoxUpY = 450;

var balls = [];
var balls2 = [];
var ballsWidth = 10;
var timer = null;
var timer2 = null;
var speed = 10;

var box = [];
var box2 = [];
var boxWidth = 30;
var timerBox = null;
var timerBox2 = null;
var speedBox = 1;
var gemColor = [];
var gemColorIndex = 0;
var shootOnTime = [];
var shootOnTimeIndex = 0;
var client;
var userID = null;

var highscore = require('./highscore');

module.exports =
  {
    init: init,
    saveHighscore:saveHighscore
  };

function init(io) {

  io.on('connection', function(socket){
    client = socket;
    socket.on('init', function () {
      userID = null;
      gemColor = [];
      generateColor(30);
      socket.emit("gemColorStart", gemColor);
      clearInterval(timer);
      timer = setInterval(sendNewColors,5000);
    });
    socket.on('restart', function () {
      userID = null;
      gemColor = [];
      generateColor(30);
      socket.emit("gemColorRestart", gemColor);
      clearInterval(timer);
      timer = setInterval(sendNewColors,5000);
    });
    socket.on('user', function (user) {
      userID = user;
      console.log("userID: " + userID);
      if(userID && gameLost){
        console.log("saveHighscore " + userID + " " + points);

        highscore.setHighscore(
          {
            username:userID,
            points:points
          });

          /*.then(() => {
            console.log("true");
            client.emit("highscore", points);
          }).catch(err =>
            console.error(err)));*/

      }
    });/*
   socket.on('pushLeft', function (timeStamp) {
     createBall("left");
     if(gemColorIndex%50===0){
       generateColor(100);
       socket.emit("gemColor", gemColor);
     }
   });
   socket.on('pushRight', function () {
     createBall("right");
     if(gemColorIndex%50===0){
       generateColor(100);
       socket.emit("gemColor", gemColor);
     }
   });*/
   socket.on('gameOver', function (time) {
     clearInterval(timer);
     initVariables();
     shootOnTime = time;
     if(shootOnTime.length === 0){
       gameOver();
     }
     while (!gameLost) {
       animateStuff();
     }
   });
   socket.on('pause', function () {
     clearInterval(timer);
     timer = null;
   });
   socket.on('play', function () {
       if(!timer) {
         sendNewColors();
         timer = setInterval(sendNewColors,5000);
       }
   });
  });
}

function sendNewColors() {
  generateColor(10);
  client.emit("gemColor", gemColor);
}

function startTimer() {
  pause = false;
  timer = setInterval(animateStuff,20);
  timerBox = setInterval(createNewBox,20);
  console.log("startTimer");
}

function stopTimer() {
  pause = true;
  clearInterval(timer);
  clearInterval(timerBox);
  console.log("stopTimer");
}

function initVariables() {
  balls = [];
  balls[0] = {};
  box = [];
  box[0] = {};
  counter = 0;
  pause = false;
  gameLost = false;
  timeStamp = 0;
  points = 0;
  shootOnTimeIndex = 0;
  gemColorIndex = 1;
}

function animateStuff() {
  if(gameLost){
    console.log("eigentlich ist es fertig");
  }
  if(timeStamp%50===0){
    createNewBox();
  }
  timeStamp++;
  moveBall();
  moveBox();
  if(shootOnTime[shootOnTimeIndex].timeStamp == timeStamp){
    createBall(shootOnTime[shootOnTimeIndex].direction);
    if(shootOnTimeIndex < shootOnTime.length - 1){
      shootOnTimeIndex++;
    }
  }
}

function gameOver() {
  gameLost = true;
  console.log("gameOver at: " + timeStamp);
  console.log("points: "+points);
  client.emit("gameOver", points);

}

function saveHighscore() {
  var username = this.request.body.username;
  console.log("saveHighscore " + username + " " + points);

  return highscore.setHighscore(
    {
      username:username,
      points:points
    });

}

// ------------------- box ------------------------

function generateColor(count) {
  var color;
  var index;
  var length = gemColor.length + count;
  for (var i = gemColor.length; i < length; i++) {
    index = Math.round((Math.random() * 100));
    color = "Edelstein_schwarz.png";

    if(i < 50){
        if(index >= 0 && index < 50){
          color = "Edelstein_rot.png";
      }
    }else if(i < 100 /*|| direction=="down"*/){
      if(index >= 0 && index < 45){
          color = "Edelstein_rot.png";
      }else if(index >= 45 && index < 55){
        color = "Edelstein_blau.png";
      }
    }/*else{
      if(index >= 0 && index < 20){
          color = "Edelstein_rot.png";
      }else if(index >= 20 && index < 35){
        color = "Edelstein_blau.png";
      }else if(index >= 35 && index < 40){
        color = "Edelstein_orange.png";
      }
    }*/
    gemColor[i] = color;
    gemColor[0] = "Edelstein_schwarz.png";
    gemColor[1] = "Edelstein_schwarz.png";
  }
}

function moveBox() {
  for (var i=1; i < box.length; i++) {
    box[i]._x += box[i]._vX;
    box[i]._y += box[i]._vY;

      if(box[i]._vY < 0){
  	  	if(box[i]._y - box[i]._vY <= endBoxUp){
          console.log(box[i].gem + " nr: (" + gemColorIndex + ") touched wall on time: " + timeStamp);
  	  		if(box[i].gem == "Edelstein_rot.png"){
            box = removeItem(box, i);
  	  		}else {

  	  			gameOver();
  	  		}
  		  }
  	}else if(box[i]._vY > 0){
  	  	if(box[i]._y + box[i]._vY > endBoxDown){
          console.log(box[i].gem + " nr: (" + gemColorIndex + ") touched wall on time: " + timeStamp);
  	  		if(box[i].gem == "Edelstein_rot.png"){
            box = removeItem(box, i);
  	  		}else {
  	  			gameOver();
  	  		}
  		  }
  	}
  }
}

function createNewBox(){
  createBox("up");
  createBox("down");
  /*
  if(!pause){
    counter++;
    if(counter >= 50){
      counter = 0;
      createBox("up");
      createBox("down");
    }
  }*/
}

function createBox(direction) {
  box[box.length] = JSON.parse(JSON.stringify(box[0]));
  initBox(box[box.length-1], direction);
  box[box.length-1].gem = gemColor[gemColorIndex];
  console.log("box: " + gemColorIndex + " hat die farbe: " + gemColor[gemColorIndex]);
  gemColorIndex++;
}

function initBox(oBox, direction) {
  if(direction == "down"){
    oBox._x = 40;
    oBox._y = 175;
    oBox._vX = 0;
    oBox._vY = speedBox;
  }else if(direction == "up"){
    oBox._x = 290;
    oBox._y = 450;
    oBox._vX = 0;
    oBox._vY = -speedBox;
  }
}

// ------------------- ball ------------------------
function moveBall() {

  for (var k = balls.length - 1; k > 0; k--) {
    balls[k]._x += balls[k]._vX;
    balls[k]._y += balls[k]._vY;
}
loop:
    for (var i = balls.length - 1; i > 0; i--) {


    for(var j=1; j < box.length; j++){
      if(balls[i]._x + ballsWidth/2 < box[j]._x + boxWidth && balls[i]._x - ballsWidth/2 > box[j]._x &&
        balls[i]._y < box[j]._y + boxWidth && balls[i]._y + ballsWidth > box[j]._y){
        console.log("hit gem: " + box[j].gem+ " nr: (" + gemColorIndex + ") time: " + timeStamp);
  	  	if(box[j].gem === "Edelstein_schwarz.png" /*|| box[j].gem == "Edelstein_orange.png"*/){
          balls = removeItem(balls, i);
          box = removeItem(box, j);
  	  		points++;
          console.log("points: " + points);
  	  	}else if(box[j].gem === "Edelstein_blau.png"){
          console.log("blau");
  	  		balls = removeItem(balls, i);
          box[j].gem = "Edelstein_schwarz.png";
  	  	}else if(box[j].gem === "Edelstein_rot.png"){
          console.log("war en roter");
  	  		gameOver();
  	  	}
        break loop;
  	  }/*else if(balls[i]._x - ballsWidth/2 < box[j]._x + boxWidth*3 && balls[i]._x + ballsWidth/2 > box[j]._x - boxWidth*2 &&
        balls[i]._y < box[j]._y + boxWidth*2 && balls[i]._y + ballsWidth > box[j]._y - boxWidth){
        if(box[j].gem == "Edelstein_orange.png"){

          if(oBall._vX < 0){
            //oBall._vX = -speed;
          }else{
            oBall._vX = speed/5;
            oBall.src = "Edelstein_orange.png";
          }
        }
      }*/
    }

    if(balls[i]._x > borderRight || balls[i]._x < borderLeft){
      balls = removeItem(balls, i);
      console.log("ball hit corner: on time: " + timeStamp);

  	}
  }
}

function removeItem(element, index) {
  var array = [];
  array[0] = {};
  for (var j = 0; j < element.length - 1; j++) {
    if(j < index){
      array[j] = element[j];
    }else{
      array[j] = element[j + 1];
    }
  }
  return array;
}

function createBall(direction) {
  console.log("create ball "+direction+" on time: " + timeStamp);
  balls[balls.length] = JSON.parse(JSON.stringify(balls[0]));
  initBall(balls[balls.length - 1], direction);
}

function initBall(oBall, direction) {
  oBall._x = playerStartX + playerWidth/2 - ballsWidth/2;
  oBall._y = playerStartY + playerWidth/2 - ballsWidth/2;

  if(direction == "left"){
      oBall._vX = -speed/4;
      oBall._vY = 0;
  }else if(direction == "right"){
      oBall._vX = speed;
      oBall._vY = 0;
  }
}
