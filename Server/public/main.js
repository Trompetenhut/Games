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

function gameOver(){
  gameLost = true;
	stopAnimation();

  $('#modalGameOver').modal('show');
  if(sessionStorage.getItem('token') && points > sessionStorage.getItem("highscore")){
    document.getElementById("modalMessage").innerHTML = "<b>New Highscore!</b><br>Points: " + points;
    $("#gotoLogin").removeClass('hide');
    $('#modalGameOver').on('shown.bs.modal', function () {
      document.getElementById("closeGameOver").focus();
  	});
    setHighscore();
  }else{
    document.getElementById("modalMessage").innerHTML = "Points: " + points;
    $("#gotoLogin").addClass('hide');
    $('#modalGameOver').on('shown.bs.modal', function () {
      document.getElementById("closeGameOver").focus();
    })
  }

	for (var i = box.length - 1; i >= 1; i--) {
		document.getElementById('box-container').removeChild(box[i]);
	};

	for (var i = ball.length - 1; i >= 1; i--) {
		document.getElementById('ball-container').removeChild(ball[i]);
	};

}

function newGame(){
  resetGame();
	startAnimation();
}

function animateStuff() {
  if(!pause){
    for (var i=balls.length; i--;) {
      moveBall(balls[i]);
    }
    for (var i=0; i < box.length; i++) {
      moveBox(box[i]);

      var str = box[i].src;
  	var res = str.split("/");
      if(box[i]._vY < 0){
  	  	if(box[i]._y - box[i]._vY <= 290){
  	  		if(res[res.length-1] == "Edelstein_rot.png"){
  	  			document.getElementById('box-container').removeChild(box[i]);
  	  		}else if(res[res.length-1] == "Edelstein_schwarz.png" || res[res.length-1] == "Edelstein_blau.png"){
  	  			gameOver();
  	  		}

  		  }
  	}else if(box[i]._vY > 0){
  	  	if(box[i]._y + box[i]._vY > 335){
  	  		if(res[res.length-1] == "Edelstein_rot.png"){
  	  			document.getElementById('box-container').removeChild(box[i]);
  	  		}else if(res[res.length-1] == "Edelstein_schwarz.png" || res[res.length-1] == "Edelstein_blau.png" || res[res.length-1] == "Edelstein_orange.png"){
  	  			gameOver();
  	  		}

  		  }
  	}
    }
  }
}

function startAnimation() {
  $('#startAnimationBtn').blur();
  if(!gameLost){
    pause = false;
    document.getElementById('pause').innerHTML = "";
    if (!timer) timer = setInterval(animateStuff,20);
    if (!timerBox) timerBox = setInterval(createNewBox,20);
  }else{
    newGame();
  }
}

function stopAnimation() {
  $('#stopAnimationBtn').blur();
  pause = true;
  if(!gameLost){
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

  document.getElementById('points').innerHTML = "" + points;

  initBall(balls[0], "");
}

function init() {
  balls = document.getElementById('ball-container').getElementsByTagName('img');
  box = document.getElementById('box-container').getElementsByTagName('img');
  moment.tz.setDefault("Europe/Berlin");

  pause = true;
  getWindowCoords();
  updateHighscoreList(false);
  setInterval( function() { updateHighscoreList(true) }, 5000 );

  if(sessionStorage.getItem('token')){
    logedIn();
  }else{
    logout();
  }
  resetGame();
}

function checkKeyPressed(e) {
    if (e.keyCode == "37") {
        createBall(document.getElementById('ball-container'), "left");
    }else if (e.keyCode == "39") {
        createBall(document.getElementById('ball-container'), "right");
    }else if (e.keyCode == "40") {
        createBall(document.getElementById('ball-container'), "down");
    }else if (e.keyCode == "38") {
        createBall(document.getElementById('ball-container'), "up");
    }else if (e.keyCode == "32") {
      if(!gameLost){
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

});

window.addEventListener('blur', function() {
    stopAnimation();
});
window.addEventListener("keydown", checkKeyPressed, false);
window.onload = init;
getWindowCoords = (navigator.userAgent.toLowerCase().indexOf('opera')>0||navigator.appVersion.toLowerCase().indexOf('safari')!=-1)?function() {
  canvasX = window.innerWidth;
  canvasY = 100;
}:function() {
  canvasX = document.documentElement.clientWidth||document.body.clientWidth||document.body.scrollWidth;
  canvasY = document.documentElement.clientHeight||document.body.clientHeight||document.body.scrollHeight;
}

window.onresize = getWindowCoords;
