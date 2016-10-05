var bounceFactor = .85;
var gravity = .3;
var friction = .05;

var pi = Math.PI;
var w = canvas.width;
var h = canvas.height;
var ballsArray = [];
var trailsLength = 10;

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