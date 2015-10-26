	function initBox(oBox, direction) {

	if(direction == "up"){
		oBox._x = 40;
		oBox._y = 175;
		oBox._vX = 0;
		oBox._vY = speedBox;
	}else if(direction == "down"){
		oBox._x = 290;
		oBox._y = 450;
		oBox._vX = 0;
		oBox._vY = -speedBox;
	}

	}

	function moveBox(oBox) {
		oBox._x += oBox._vX;
		oBox._y += oBox._vY;
		oBox.style.left = oBox._x+'px';
		oBox.style.top = oBox._y+'px';
	}

	function createBox(oParent, direction) {
		oParent.appendChild(document.getElementById('box').cloneNode(true));
		initBox(box[box.length-1], direction);
		box[box.length-1].classList.remove("hidden");

		var index = Math.round((Math.random() * 100));
		document.getElementById("box").src = "Edelstein_schwarz.png";

		if(points < 30){
		  	if(index >= 0 && index < 30){
		  		document.getElementById("box").src = "Edelstein_rot.png";
			}else{
				document.getElementById("box").src = "Edelstein_schwarz.png";
			}
		}else if(points < 70 || direction=="down"){
			if(index >= 0 && index < 30){
		  		document.getElementById("box").src = "Edelstein_rot.png";
			}else if(index >= 30 && index < 90){
				document.getElementById("box").src = "Edelstein_schwarz.png";
			}else{
				document.getElementById("box").src = "Edelstein_blau.png";
			}
		}else{
			if(index >= 0 && index < 20){
	  			document.getElementById("box").src = "Edelstein_rot.png";
			}else if(index >= 20 && index < 80){
				document.getElementById("box").src = "Edelstein_schwarz.png";
			}else if(index >= 80 && index < 95){
				document.getElementById("box").src = "Edelstein_blau.png";
			}else{
				document.getElementById("box").src = "Edelstein_orange.png";
			}
		}
	}

	function createNewBox(){
		if(!pause){
			counter++;
			if(counter >= 50){
				counter = 0;
				createBox(document.getElementById('box-container'), "up");
				createBox(document.getElementById('box-container'), "down");
			}
		}

	}
