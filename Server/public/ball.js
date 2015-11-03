
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

function moveBall() {

  for (var i=balls.length; i--;) {
    balls[i]._x += balls[i]._vX;
    balls[i]._y += balls[i]._vY;
    balls[i].style.left = balls[i]._x+'px';
    balls[i].style.top = balls[i]._y+'px';
    ballX = balls[i]._x;
    ballY = balls[i]._y;
}
loop:
for (var i=balls.length; i--;) {
    for(var k=1; k < box.length; k++){
        boxX = box[k]._x;
        boxY = box[k]._y;

        var str = box[k].src;
  	var res = str.split("/");

  	  //if(ballX + ballsWidth/2 < boxX + boxWidth && ballX - ballsWidth/2 > boxX && ballY < boxY + boxWidth && ballY + ballsWidth > boxY){
      if(balls[i]._x + ballsWidth/2 < box[k]._x + boxWidth && balls[i]._x - ballsWidth/2 > box[k]._x &&
        balls[i]._y < box[k]._y + boxWidth && balls[i]._y + ballsWidth > box[k]._y){
  	  	if(res[res.length-1] === "Edelstein_schwarz.png" /*|| res[res.length-1] == "Edelstein_orange.png"*/){
          if(balls[i]._vX < 0){
            balls[i].style.left = balls[i]._x+'px';
          }
  	  		document.getElementById('ball-container').removeChild(balls[i]);
  	  		document.getElementById('box-container').removeChild(box[k]);
  	  		points++;
  	  		document.getElementById('points').innerHTML = "" + points;
  	  	}if(res[res.length-1] === "Edelstein_blau.png"){
  	  		document.getElementById('ball-container').removeChild(balls[i]);
          box[k].src = "Edelstein_schwarz.png";
  	  	}else if(res[res.length-1] === "Edelstein_rot.png"){
  	  		gameOver();
  	  	}

        break loop;
  	  }/*else if(ballX - ballsWidth/2 < boxX + boxWidth*3 && ballX + ballsWidth/2 > boxX - boxWidth*2 && ballY < boxY + boxWidth*2 && ballY + ballsWidth > boxY - boxWidth){
        if(res[res.length-1] == "Edelstein_orange.png"){

          if(balls[i]._vX < 0){
            //balls[i]._vX = -speed;
          }else{
            balls[i]._vX = speed/5;
            balls[i].src = "Edelstein_orange.png";
          }
        }
      }*/
  	}

    if(balls[i]._x > borderRight || balls[i]._x < borderLeft){
  		document.getElementById('ball-container').removeChild(balls[i]);
  	}
  }
}

function createBall(oParent, direction) {
  oParent.appendChild(document.getElementById('ball').cloneNode(true));
  ball[ball.length - 1].classList.remove("hidden");
  initBall(balls[balls.length - 1], direction);
}
