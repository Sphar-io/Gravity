//Universe related variables
var frictionCoe = .998 //vi*friction = vf. 1 is no friction 
var trailsLength = 10; //Number of "trails" each particle will draw
var bounceFactor = 1; //The restitution factor of each Particle. 1 is perfectly elastic
var gravity = 2;

var pi = Math.PI; 
var w = canvas.width; 
var h = canvas.height; 
var particlesArray = []; //holds all Particle objects

//On method call, checks every particle for collisions against walls, then against other particles
function bounce(){
	for(var i=0 ; i<particlesArray.length ; i++){ //goes through every particle
		var thisParticle = particlesArray[i]; //QOL
		var nextX = thisParticle.x + thisParticle.vx; //calculates next positions - Using current positions would let balls get stuck inside each other
		var nextY = thisParticle.y + thisParticle.vy 
		//checks for world collisions
		if(nextX > w-thisParticle.radius || nextX < 0+thisParticle.radius){ //horizontal world collision
			xWallBounce(thisParticle);
			thisParticle.x = (nextX > w-thisParticle.radius) ? w-thisParticle.radius : thisParticle.radius;
		}
		if(nextY > h-thisParticle.radius || nextY < 0+thisParticle.radius){ //vertical world collision
			yWallBounce(thisParticle);
			thisParticle.y = (nextY > h-thisParticle.radius) ? h-thisParticle.radius :  thisParticle.radius;
		}
		//end of world collision checking
		//check for other particle collisions. Goes through every future particle (so two particles don't "collide twice" in one frame).
		for(var j=i+1; j<particlesArray.length; j++){
			var otherParticle = particlesArray[j]; //QOL and next positions for the particle being checked against
			var nextX1 = otherParticle.x + otherParticle.vx;
			var nextY1 = otherParticle.y + otherParticle.vy;
			//the distance formula - if the distance between both particles (in the next frame) is less than their combined radii, they should "bounce"
			//to stop two balls from repeatedly colliding in the same frame and getting stuck, the particle.collided flag is used. A particle will only be checked if it hasn't already collided
			if( (nextX1-nextX)*(nextX1-nextX) + (nextY1-nextY)*(nextY1-nextY) <= (otherParticle.radius+thisParticle.radius)*(otherParticle.radius+thisParticle.radius) && thisParticle.collided === false){
				particleBounce(thisParticle, otherParticle); //Perform the actual bounce - uses conservation of momentum formulae. See method
				thisParticle.collided = true; 
			}else{
				thisParticle.collided = false;
			}
		}
	}
}

//This method is called whenever two particles will colide in the next frame. It uses conservation of momentum formlae to find the new x and y velocities based on mass and velocity
function particleBounce(thisParticle, otherParticle){
	var m1 = thisParticle.mass;
	var m2 = otherParticle.mass;
	//These 4 lines are the actual calculations. Formulae are 60% hyperphysics.com 40% magic. 
	var thisParticleTempX = bounceFactor*( ((m1-m2)/(m1+m2))*thisParticle.vx + ((2*m2)/(m1+m2))*otherParticle.vx );
	var otherParticleTempX = bounceFactor*( ((2*m1)/(m1+m2))*thisParticle.vx - ((m1-m2)/(m1+m2))*otherParticle.vx );
	var thisParticleTempY = bounceFactor*( ((m1-m2)/(m1+m2))*thisParticle.vy + ((2*m2)/(m1+m2))*otherParticle.vy );
	var otherParticleTempY = bounceFactor*( ((2*m1)/(m1+m2))*thisParticle.vy - ((m1-m2)/(m1+m2))*otherParticle.vy );
	//Sets temp variables
	thisParticle.vx = thisParticleTempX;
	thisParticle.vy = thisParticleTempY;
	otherParticle.vx = otherParticleTempX;
	otherParticle.vy = otherParticleTempY;
	// These lines were a temporary workaround to stop particles from getting stuck in each other but they might not be necessary
	// thisParticle.x += thisParticle.vx; These lines were a temporary workaround to stop particles from getting stuck in each other but they might not be necessary
	// thisParticle.y += thisParticle.vy;
	// otherParticle.x += otherParticle.vx;
	// otherParticle.y += otherParticle.vy;
}

//Given a number, generates particles randomly inside the canvas. Calls the seperate method to ensure they aren't drawn overlapping
//Also calls the color scaler method. Sets the heaviest particle as red, the lighest as green, and the rest somewhere in between
//Currently only mass is used for color but could also be adapted for momentum, density, etc.
function generateParticles(number){
	for(var i=0;i<number; i++){ 
		thisParticle = new Particle();
		thisParticle.density = Math.random()+1;
		thisParticle.radius = Math.random()*15+10;
		thisParticle.mass = thisParticle.density*pi*thisParticle.radius*thisParticle.radius;
		thisParticle.x = thisParticle.radius + Math.random()*(w-thisParticle.radius);
		thisParticle.y = thisParticle.radius + Math.random()*(h-thisParticle.radius);
		var initDirection = Math.floor(Math.random()*-180)*pi/180;
		var speedMult = (Math.random()*10)+2;
		thisParticle.vx = speedMult*Math.cos(initDirection);
		thisParticle.vy = speedMult*Math.sin(initDirection);
		particlesArray.push(thisParticle);
	}
	separateParticles();
	colorScaler();
}

//If a particle is spawned on top of another particle, the particle being added will be moved to a random position. The method is then called again to ensure the new location isn't also on top of a particle
function separateParticles(){
	for (var i = 0; i < particlesArray.length; i++) {
		var thisParticle = particlesArray[i];
		for(var j=i+1; j<particlesArray.length; j++){
			var otherParticle = particlesArray[j];
			if( (otherParticle.x-thisParticle.x)*(otherParticle.x-thisParticle.x) + (otherParticle.y-thisParticle.y)*(otherParticle.y-thisParticle.y) < (otherParticle.radius+thisParticle.radius)*(otherParticle.radius+thisParticle.radius)){
				thisParticle.x = thisParticle.radius + Math.random()*(w-thisParticle.radius);
				thisParticle.y = thisParticle.radius + Math.random()*(h-thisParticle.radius);
				separateParticles(); //This was bounce() before
			}
		}
	}
}

function xWallBounce(thisParticle){ //These wallbounce methods simply reverse the given particle's respective velocity
	thisParticle.vx *= -1*bounceFactor;
}

function yWallBounce(thisParticle){
	thisParticle.vy *= -1*bounceFactor;
}

//Clears the screen and the array of particles
function reset(){
	particlesArray = [];
	ctx.clearRect(0,0,w,h);
}