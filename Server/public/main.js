var canvasX = 0;
var canvasY = 0;
var playerWidth = 30;
var points = 0;
var highscore;
var highscoreUser;
var counter;
var pause;
var gameLost;
var dynatable;
var socket;
var timerUpdateTable = null;
var timeStamp = 0;
var loadImages = false;
var loadGemArray = false;

var playerStartX = 165;
var playerStartY = 315;

var borderLeft = 10;
var borderRight = playerStartX * 2 + playerWidth - borderLeft;

var endBoxUp = 290;
var endBoxDown = 335;

var balls = [];
var balls2 = [];
var ballsWidth = 10;
var timer = null;
var timer2 = null;
var speed = 10;
var requestNrBalls = 0;

var box = [];
var box2 = [];
var boxWidth = 30;
var timerBox = null;
var timerBox2 = null;
var speedBox = 1;
var gemColor = [];
var gemColorIndex = 1;
var shootOnTime = [];

function gameOver(){
  gameLost = true;
	stopAnimation();

  socket.emit("gameOver", shootOnTime);

	for (var i = box.length - 1; i >= 1; i--) {
		document.getElementById('box-container').removeChild(box[i]);
	}

	for (var j = ball.length - 1; j >= 1; j--) {
		document.getElementById('ball-container').removeChild(ball[j]);
	}

}

function newGame(){
  resetGame();
	//startAnimation();
}

function animateStuff() {
  if(timeStamp%50===0){
    createNewBox();
  }
  if(!pause){
    timeStamp++;



    moveBall();

    for (var i=1; i < box.length; i++) {
      moveBox(box[i]);

      var str = box[i].src;
    	var res = str.split("/");
      if(box[i]._vY < 0){
  	  	if(box[i]._y - box[i]._vY <= endBoxUp){
  	  		if(res[res.length-1] == "Edelstein_rot.png"){
            document.getElementById('box-container').removeChild(box[i]);
  	  		}else {

  	  			gameOver();
  	  		}
  		  }
  	}else if(box[i]._vY > 0){
  	  	if(box[i]._y + box[i]._vY > endBoxDown){
  	  		if(res[res.length-1] == "Edelstein_rot.png"){
            document.getElementById('box-container').removeChild(box[i]);
  	  		}else {
  	  			gameOver();
  	  		}
  		  }
  	}
    /*
    var str = box[i].src;
  	var res = str.split("/");
      if(box[i]._vY < 0){
  	  	if(box[i]._y - box[i]._vY <= 290){
          console.log(gemColor[gemColorIndex] + " touched wall on time: " + timeStamp);
  	  		if(gemColor[gemColorIndex] == "Edelstein_rot.png"){
  	  			document.getElementById('box-container').removeChild(box[i]);
  	  		}else if(res[res.length-1] == "Edelstein_schwarz.png" || res[res.length-1] == "Edelstein_blau.png" || res[res.length-1] == "Edelstein_orange.png"){
  	  			gameOver();
  	  		}

  		  }
  	}else if(box[i]._vY > 0){
  	  	if(box[i]._y + box[i]._vY > 335){
          console.log(gemColor[gemColorIndex] + " touched wall on time: " + timeStamp);
  	  		if(gemColor[gemColorIndex] == "Edelstein_rot.png"){
  	  			document.getElementById('box-container').removeChild(box[i]);
  	  		}else if(gemColor[gemColorIndex] == "Edelstein_schwarz.png" || res[res.length-1] == "Edelstein_blau.png"){
  	  			gameOver();
  	  		}

  		  }
  	}*/
    }
  }
}

function startAnimation() {
  $('#startAnimationBtn').blur();
  if(!gameLost){
    pause = false;
    socket.emit("play");
    document.getElementById('pause').innerHTML = "";
    if (!timer) timer = setInterval(animateStuff,20);
    //if (!timerBox) timerBox = setInterval(createNewBox,20);
  }else{
    newGame();
  }
}

function stopAnimation() {
  $('#stopAnimationBtn').blur();
  pause = true;
  if(!gameLost){
    socket.emit("pause");
    document.getElementById('pause').innerHTML = "pause";
  }
  clearInterval(timer);
  timer = null;
  clearInterval(timerBox);
  timerBox = null;

}

function resetGame() {
  counter = 0;
  gameLost = false;
  points = 0;
  gemColorIndex = 1;
  timeStamp = 0;
  shootOnTime = [];

  socket.emit("restart");

  document.getElementById('points').innerHTML = points;
}

function init() {
  socket = io();
  getSockets();

  balls = document.getElementById('ball-container').getElementsByTagName('img');
  box = document.getElementById('box-container').getElementsByTagName('img');



  moment.tz.setDefault("Europe/Berlin");

  pause = true;
  getWindowCoords();
  updateHighscoreList(false);

  if(sessionStorage.getItem('token')){
    logedIn();
  }else{
    logout();
  }
  socket.emit("init");

  var loaders = [];
  loaders.push(loadSprite('Edelstein_schwarz.png'));
  loaders.push(loadSprite('Edelstein_orange.png'));
  loaders.push(loadSprite('Edelstein_green.png'));
  loaders.push(loadSprite('Edelstein_blau.png'));
  $.when.apply(null, loaders).done(function() {
    loadImages = true;
    readyToStart();
  });
}

function loadSprite(src) {
    var deferred = $.Deferred();
    var sprite = new Image();
    sprite.onload = function() {
        deferred.resolve();
    };
    sprite.src = src;
    return deferred.promise();
}

function readyToStart() {
  if(loadImages && loadGemArray){
    pause = true;
    document.getElementById('pause').innerHTML = "pause";
  }
}

function getSockets() {

  socket.on('gemColorStart', function (newColors) {
    gemColor = JSON.parse(JSON.stringify(newColors));
    loadGemArray = true;
    readyToStart();
  });
  socket.on('gemColorRestart', function (newColors) {
    gemColor = JSON.parse(JSON.stringify(newColors));
    loadGemArray = true;
    startAnimation();
  });
  socket.on('gemColor', function (newColors) {
    gemColor = JSON.parse(JSON.stringify(newColors));
  });
  socket.on('highscore', function (highscore) {
    console.log("highscore: " + highscore);
    document.getElementById('highscore').innerHTML = highscore;
    updateHighscoreList(true);
  });
  socket.on('gameOver', function (points) {
    $('#modalGameOver').modal('show');
    if(sessionStorage.getItem('token') && points > sessionStorage.getItem("highscore")){
      document.getElementById("modalMessage").innerHTML = "<b>New Highscore!</b><br>Points: " + points;
      $("#gotoLogin").removeClass('hide');
      $('#modalGameOver').on('shown.bs.modal', function () {
        document.getElementById("closeGameOver").focus();
    	});
      if(sessionStorage.getItem('token')){
        socket.emit("user", sessionStorage.getItem('username'));
        for (var i = 0; i < 5; i++) {
          setTimeout('updateHighscore()', (500 * i));
          setTimeout('updateHighscoreList(true)', (500 * i));
        }
      }
      //setHighscore();
    }else{
      document.getElementById("modalMessage").innerHTML = "Points: " + points;
      $("#gotoLogin").addClass('hide');
      $('#modalGameOver').on('shown.bs.modal', function () {
        document.getElementById("closeGameOver").focus();
      });
    }
  });
}

function checkKeyPressed(e) {
    if (e.keyCode == "37") {
        //socket.emit("pushLeft", timeStamp);
        createBall(document.getElementById('ball-container'), "left");
        shootOnTime[shootOnTime.length] = {
          direction: "left",
          timeStamp: timeStamp
        };

    }else if (e.keyCode == "39") {
        //socket.emit("pushRight", timeStamp);
        createBall(document.getElementById('ball-container'), "right");
        shootOnTime[shootOnTime.length] = {
          direction: "right",
          timeStamp: timeStamp
        };
    }else if (e.keyCode == "32") {
      if(!gameLost && loadImages && loadSprite){
        if(pause){
          startAnimation();
        }else{
          stopAnimation();
        }
      }
    }
}

function myFunction(e) {
    var x = e.clientX;
    var y = e.clientY;
    if(x >= document.getElementById("player").offsetLeft){
      createBall(document.getElementById('ball-container'), "right");
    }
    if(x < document.getElementById("player").offsetLeft){
      createBall(document.getElementById('ball-container'), "left");
    }
}



$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    $('#modalGameOver').on('hide.bs.modal', function () {
      newGame();
  	});
});


window.addEventListener('focus', function() {
  timerUpdateTable = setInterval( function() { updateHighscoreList(true); }, 5000 );
});

window.addEventListener('blur', function() {
    stopAnimation();
    clearInterval(timerUpdateTable);
    timerUpdateTable = null;
});
window.addEventListener("keydown", checkKeyPressed, false);
window.onload = init;
getWindowCoords = (navigator.userAgent.toLowerCase().indexOf('opera')>0||navigator.appVersion.toLowerCase().indexOf('safari')!=-1)?function() {
  canvasX = window.innerWidth;
  canvasY = 100;
}:function() {
  canvasX = document.documentElement.clientWidth||document.body.clientWidth||document.body.scrollWidth;
  canvasY = document.documentElement.clientHeight||document.body.clientHeight||document.body.scrollHeight;
};

window.onresize = getWindowCoords;
