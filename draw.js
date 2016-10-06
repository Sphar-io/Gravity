var canvas = document.getElementById("canvasA");
var ctx = canvas.getContext("2d");
canvas.width = Math.floor(.80*window.innerHeight);
canvas.height = Math.floor(.80*window.innerHeight);

function defaultValObj(){
	this.numParticles = 10;
	this.pause = function(){pauseGame();};
	this.reset = function(){reset();};
	//initializes game
}

//creates gui items
window.onload = function() {
	//create objects for gui
	var menu = new defaultValObj();
	gui = new dat.GUI();
	//start adding to gui

	//Folder for simulation settings
	var f1 = gui.addFolder('Simulation Settings');
		f1.add(menu, 'numParticles', 1, 200).onFinishChange(generateBalls);
	//folder for controls
	var f2 = gui.addFolder('Controls');
		f2.add(menu, 'pause');
		f2.add(menu, 'reset');
	//end adding to gui


	//opens menus
	f1.open();
	f2.open();
}

function drawBall(r,g,b,a,x,y,rad){
	ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
	//console.log(ctx.fillStyle);
	ctx.beginPath();
	ctx.arc(x,y,rad,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
}

function drawTrails(thisBall){
	var queue = thisBall.posQueue;
	for(var i = 0; i < queue.length; i++){
		var posObj = queue[i];
		var alpha = (i+1)/queue.length;
		var radius = thisBall.radius;
		var trailRad = (radius-(radius/2.5)) * Math.sin(i/trailsLength * (Math.PI/2)) + (radius/2.5);
		ctx.fillStyle = "rgba(" + thisBall.r + "," + thisBall.g + "," + thisBall.b +"," + alpha/10 + ")";
		drawBall(thisBall.r, thisBall.g, thisBall.b, alpha/2, posObj.x,posObj.y,trailRad);
	}
}

function update(){
	ctx.clearRect(0,0,w,h);
	for(var i=0; i<ballsArray.length; i++){
		thisBall = ballsArray[i];
		bounce();
		thisBall.moveBall();
		drawBall(thisBall.r, thisBall.g, thisBall.b, 1, thisBall.x, thisBall.y, thisBall.radius);
		drawTrails(thisBall);
	}
	requestAnimationFrame(update);
}