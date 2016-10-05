var canvas = document.getElementById("canvasA");
var ctx = canvas.getContext("2d");
canvas.width = Math.floor(.80*window.innerHeight);
canvas.height = Math.floor(.80*window.innerHeight);

function defaultValObj(){
	this.numParticles = 10;
	this.pause = function(){pauseGame();};
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
		f1.add(menu, 'numParticles', 1, 200).onChange(generateBalls);
	//folder for controls
	var f2 = gui.addFolder('Controls');
		f2.add(menu, 'pause');
	//end adding to gui


	//opens menus
	f1.open();
	f2.open();
}

function drawBall(r,g,b,a,x,y,rad){
	ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")"; 
	var x = thisBall.x;
	var y = thisBall.y;
	var rad = thisBall.radius;
	ctx.beginPath();
	ctx.arc(x,y,rad,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
}

function drawTrails(thisBall){
	for(var i = 0; i < thisBall.posQueue.length; i++){
		var queue = thisBall.posQueue[i];
		var alpha = (i+1)/queue.length;
		var radius = thisBall.radius;
		var trailRad = (radius-(radius/2.5)) * Math.sin(i/trailsLength * (Math.PI/2)) + (radius/2.5);
		ctx.fillStyle = "rgba(" + thisBall.r + "," + thisBall.g + "," + thisBall.b +"," + alpha/10 + ")";
		drawBall(thisBall.r, thisBall.g, thisBall.b, thisBall.alpha/10, queue.x,queue.y,radius);
	}
}

function update(){
	ctx.clearRect(0,0,w,h);
	for(var i=0; i<ballsArray.length; i++){
		thisBall = ballsArray[i];
		thisBall.moveBall();
		drawBall(thisBall.r, thisBall.g, thisBall.b, 1, thisBall.x, thisBall.y, thisBall.radius);
		drawTrails(thisBall);
	}
	requestAnimationFrame(update);
}