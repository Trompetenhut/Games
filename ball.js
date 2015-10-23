
function initBall(oBall, direction) {
  oBall._x = document.getElementById("player").offsetLeft + playerWidth/2 - ballsWidth/2;
  oBall._y = document.getElementById("player").offsetTop + playerWidth/2 - ballsWidth/2;

  if(direction == "left"){

    /*if(points >= 50 && points < 70){
      oBall._vX = -speed;
      oBall._vY = 0;
    }else if(points >= 100 && points < 120){
      oBall._vX = -speed;
      oBall._vY = 0;
    }else if(points >= 250 && points < 270){
      oBall._vX = speed;
      oBall._vY = 0;
    }else if(points >= 300 && points < 1000){
      oBall._vX = speed/4;
      oBall._vY = 0;
    }else{*/
      oBall._vX = -speed/4;
      oBall._vY = 0;
    //}  	
  }else if(direction == "right"){
  	/*if(points >= 50 && points < 70){
      oBall._vX = speed;
      oBall._vY = 0;
    }else if(points >= 100 && points < 120){
      oBall._vX = speed/4;
      oBall._vY = 0;
    }else if(points >= 250 && points < 270){
      oBall._vX = -speed;
      oBall._vY = 0;
    }else if(points >= 300 && points < 1000){
      oBall._vX = -speed;
      oBall._vY = 0;
    }else{*/
      oBall._vX = speed;
      oBall._vY = 0;
    //} 
  }/*else if(direction == "up"){
  	oBall._vX = 0;
  	oBall._vY = -speed;
  }else if(direction == "down"){
  	oBall._vX = 0;
  	oBall._vY = speed;
  }*/
  
}

function moveBall(oBall) {
  oBall._x += oBall._vX;
  oBall._y += oBall._vY;
  oBall.style.left = oBall._x+'px';
  oBall.style.top = oBall._y+'px';

  ballX = oBall._x + oBall._vX;
  ballY = oBall._y + oBall._vY;

  for(var k=0; k < box.length; k++){
      boxX = box[k]._x;
      boxY = box[k]._y;

      var str = box[k].src;
	var res = str.split("/");

	  if(ballX < boxX + boxWidth && ballX + ballsWidth > boxX && ballY < boxY + boxWidth && ballY + ballsWidth > boxY){
	  	if(res[res.length-1] == "Edelstein_schwarz.png"){
        no();          
        highscoreUser++;
	  		document.getElementById('ball-container').removeChild(oBall);
	  		document.getElementById('box-container').removeChild(box[k]);
	  		points++;
	  		document.getElementById('points').innerHTML = "" + points;
        //newAchievement();
	  	}if(res[res.length-1] == "Edelstein_blau.png"){	  		
	  		document.getElementById('ball-container').removeChild(oBall);
        box[k].src = "Edelstein_schwarz.png";
	  	}else if(res[res.length-1] == "Edelstein_rot.png"){
	  		gameOver();
	  	}
	  	
	  }  
	}
	if(ballX > 500 || ballY > 500 || ballX < 0 || ballY < 0){
		document.getElementById('ball-container').removeChild(oBall);
	}
}

function newAchievement(){
  if(points >= 50 && points < 70){
      document.getElementById("achievment1").style.color = "red";
      document.getElementById("points").style.color = "red";
    }else if(points >= 100 && points < 120){
      document.getElementById("achievment2").style.color = "red";
      document.getElementById("points").style.color = "red";
    }else if(points >= 200){
      document.getElementById("achievment3").style.color = "red";
      document.getElementById("points").style.color = "red";
    }else if(points >= 250 && points < 270){
      document.getElementById("achievment4").style.color = "red";
      document.getElementById("points").style.color = "red";
    }else if(points >= 300 && points < 1000){
      document.getElementById("achievment5").style.color = "red";
      document.getElementById("points").style.color = "red";
    }else{
      document.getElementById("achievment1").style.color = "black";
      document.getElementById("achievment2").style.color = "black";
      document.getElementById("achievment4").style.color = "black";
      document.getElementById("achievment5").style.color = "black";
      document.getElementById("points").style.color = "black";
    } 
}

function createBall(oParent, direction) {
  oParent.appendChild(document.getElementById('ball').cloneNode(true));
  initBall(balls[balls.length-1], direction);
  balls[balls.length-1].classList.remove("hidden");
  
}
