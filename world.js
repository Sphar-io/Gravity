var bounceFactor = .9;
var gravity = .3;
var friction = .001;
var trailsLength = 10;
var ballBounceFactor = .7;

var pi = Math.PI;
var w = canvas.width;
var h = canvas.height;
var ballsArray = [];


function bounce(){
	for(var i=0 ; i<ballsArray.length ; i++){

		var thisBall = ballsArray[i];
		var nextX = thisBall.x + thisBall.vx;
		var nextY = thisBall.y + thisBall.vy

		//checks for world collisions
		if(nextX > w-thisBall.radius || nextX < 0+thisBall.radius){ //horizontal world collision
			thisBall.bounceX();
		}
		if(nextY > h-thisBall.radius || nextY < 0+thisBall.radius){ //vertical world collision
			thisBall.bounceY();
			thisBall.y = (nextY > h-thisBall.radius) ? h-thisBall.radius: 0+thisBall.radius;

		}
		//check for other particle collisions
		for(var j=i+1; j<ballsArray.length; j++){
			var otherBall = ballsArray[j];
			var nextX1 = otherBall.x + otherBall.vx;
			var nextY1 = otherBall.y + otherBall.vy;

			if( (nextX1-nextX)*(nextX1-nextX) + (nextY1-nextY)*(nextY1-nextY) < (otherBall.radius+thisBall.radius)*(otherBall.radius+thisBall.radius)){
				particleBounce(thisBall, otherBall);
				//Right now, the colision point is being found, but the centers are being set to the collision point, not the edge
				//The point on each ball that collided should be set equal. The distance from that point to the center is the radius
			}
		}

	}
}

function generateBalls(number){
	for(var i=0;i<number; i++){
		thisBall = new ball();
		thisBall.r = 52;
		thisBall.g = 73;
		thisBall.b = 94;
		thisBall.radius = Math.random()*20+5;
		thisBall.x = thisBall.radius + Math.random()*(w-thisBall.radius);
		thisBall.y = thisBall.radius + Math.random()*(h-thisBall.radius);
		var initDirection = Math.floor(Math.random()*-180)*pi/180; //creates balls all going upwards
		var speedMult = (Math.random()*15)+2;
		thisBall.vx = speedMult*Math.cos(initDirection);
		thisBall.vy = speedMult*Math.sin(initDirection);
		ballsArray.push(thisBall);
	}
}

function particleBounce(thisBall, otherBall){
	thisBall.bounceX();
	thisBall.bounceY();
	otherBall.bounceX();
	otherBall.bounceY();
	thisBall.vx *= ballBounceFactor;
	thisBall.vy *= ballBounceFactor;
	otherBall.vx *= ballBounceFactor;
	otherBall.vy *= ballBounceFactor;
	thisBall.x += thisBall.vx;
	thisBall.y += thisBall.vy;
	otherBall.x += otherBall.vx;
	otherBall.y += otherBall.vy;
}


function reset(){
	ballsArray = [];
}
generateBalls(5);
update();