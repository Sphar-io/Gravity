var bounceFactor = .85;
var gravity = .3;
var friction = .05;

var pi = Math.PI;
var w = canvas.width;
var h = canvas.height;
var ballsArray = [];
var trailsLength = 10;


function bounce(){
	for(var i=0 ; i<ballsArray.length ; i++){
	//check for world collisions
	var thisBall = ballsArray[i];
	var nextX = thisBall.x + thisBall.vx;
	var nextY = thisBall.y + thisBall.vy
	if(nextX > w-thisBall.radius || nextX < 0+thisBall.radius){ //horizontal world collision
		thisBall.bounceX();
		alert("ding");
	}
	if(nextY > h-thisBall.radius || nextY < 0+thisBall.radius){ //vertical world collision
		thisBall.bounceY();
	}

	//check for ball positions
	}
}

function generateBalls(number){
	for(var i=0;i<number; i++){
		thisBall = new ball();
		thisBall.r = 52;
		thisBall.g = 73;
		thisBall.b = 94;
		thisBall.x = w/2;
		thisBall.y = h/2;
		thisBall.radius = Math.random()*20+5;
		var initDirection = Math.floor(Math.random()*-180)*pi/180; //creates balls all going upwards
		var speedMult = (Math.random()*15)+2;
		thisBall.vx = speedMult*Math.cos(initDirection);
		thisBall.vy = speedMult*Math.sin(initDirection);
		ballsArray.push(thisBall);
	}
}

generateBalls(5);
update();