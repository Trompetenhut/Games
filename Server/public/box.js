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
		box[box.length-1].src = gemColor[gemColorIndex];
		gemColorIndex++;
	}

	function createNewBox(){
		createBox(document.getElementById('box-container'), "up");
		createBox(document.getElementById('box-container'), "down");
		/*
		if(!pause){
			counter++;
			if(counter >= 50){
				counter = 0;
				createBox(document.getElementById('box-container'), "up");
				wcreateBox(document.getElementById('box-container'), "down");
			}
		}*/
	}
