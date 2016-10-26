//Drawing related variables
var canvas = document.getElementById("canvasA");
var ctx = canvas.getContext("2d");
canvas.width = Math.floor(.80*window.innerHeight); //scales canvas to avoid stretching
canvas.height = Math.floor(.80*window.innerHeight);
var paused = false;
var maxMass; //these store the largest and smallest masses to scale the colors properly. Initialized with small and large numbers respectively
var minMass;

//Holds the values of the user's dat.gui input. Note: instance being used is the var "menu"
function guiObj(){
	this.addParticles = 10;
	this.addToSimulation = function(){generateParticles(menu.addParticles);};
	this.pause = function(){pauseGame();};
	this.reset = function(){reset();};
	this.xPosition = w/2;
	this.yPosition = h/2;
	this.density = 1;
	this.radius = 15;
	this.bounciness = .8;
	this.initialXVelocity = 5;
	this.initialYVelocity = 0;
	this.add = function(){createParticle();};
	this.step = function(){paused = true; step();};
	this.friction = 20;
	this.bounciness = 1;
	this.gravityAmount = 0;
}

//Initializes dat.gui object, adds menu options, then generates particles and starts simulation loop 
window.onload = function() {
	//create objects for gui
	menu = new guiObj();
	gui = new dat.GUI();
	//start adding to gui

	//Folder for simulation settings
	var f1 = gui.addFolder('Simulation Settings');
		f1.add(menu, 'addParticles', 1, 200);
		f1.add(menu, 'addToSimulation');
	//folder for controls
	var f2 = gui.addFolder('Controls');
		f2.add(menu, 'pause');
		f2.add(menu, 'reset');
		f2.add(menu, 'step');
		f2.add(menu, 'friction', 0, 100).onFinishChange(setFriction);
		f2.add(menu, 'bounciness', .5,1.5).onFinishChange(setBounce);
		var f22 = f2.addFolder('Beta controls');
			f22.add(menu, 'gravityAmount',0,5).step(.25).onFinishChange(setGravity);
		//Folder for creating a custom particle
		var f21 = gui.addFolder('Add Particle');
			f21.add(menu,'xPosition',0,w);
			f21.add(menu,'yPosition',0,h);
			f21.add(menu,'density',0,10);
			f21.add(menu,'radius',0,100);
			f21.add(menu,'initialXVelocity',-50,50);
			f21.add(menu,'initialYVelocity',-50,50);
			f21.add(menu,'add');
	//end adding to gui

	//opens menus
	f1.open();
	f2.open();

	//starts simulation
	generateParticles(10);
	update();
}

//"Self documenting code"
function pauseGame(){
	paused = !paused;
}

function setFriction(){
	frictionCoe = 1 - (.0001*menu.friction);
}

function setBounce(){
	bounceFactor = menu.bounciness;
}

function setGravity(){
	gravity = menu.gravityAmount;
}

//Creates a new particle given the information stored in the menu. Calls seperate to make sure it has a legal position
function createParticle(){
	var thisParticle = new Particle();
	thisParticle = new Particle();
	thisParticle.density = menu.density;
	thisParticle.radius = menu.radius;
	thisParticle.mass = thisParticle.density*pi*thisParticle.radius*thisParticle.radius;
	thisParticle.x = menu.xPosition;
	thisParticle.y = menu.yPosition;
	thisParticle.vx = menu.initialXVelocity;
	thisParticle.vy = menu.initialYVelocity;
	particlesArray.push(thisParticle);
	colorScaler();
	drawParticle(thisParticle.h, thisParticle.s, thisParticle.l, 1, thisParticle.x, thisParticle.y, thisParticle.radius);
	separateParticles();

}

//Drawing method given a color (in HSLA), radius, and coordinates for center
function drawParticle(h,s,l,a,x,y,r){
	ctx.fillStyle = "hsla(" + h + "," + s + "%," + l + "%," + a + ")";
	ctx.beginPath();
	ctx.arc(x,y,r,0,2*Math.PI);
	ctx.closePath();
	ctx.fill();
}

//Given one particle object, draws all of it's trails. Uses Robert Penner's ease out function to make a natural size decrease in the trails
//Alpha is also scaled from 1 (most recent trail) to 0 (last trail in the position queue)
//Calls the draw particle method for each trail 
function drawTrails(thisParticle){
	var queue = thisParticle.posQueue;
	for(var i = 0; i < queue.length; i++){
		var posObj = queue[i];
		var alpha = (i+1)/queue.length;
		var radius = thisParticle.radius; //original radius of ball
		var trailRad = (radius-(radius/2.5)) * Math.sin(i/trailsLength * (Math.PI/2)) + (radius/2.5); //Ease out function
		drawParticle(thisParticle.h, thisParticle.s, thisParticle.l, alpha/4, posObj.x,posObj.y,trailRad);
	}
}

//Finds the maximum and minimum mass of all the particles on the screen to allow color scaling between them. Could be adapted to use momentum instead
//If there is only one particle, sets it to green
function colorScaler(){
	maxMass = 0;
	minMass = Infinity; 
	for (var i = 0; i < particlesArray.length; i++) {
		if(particlesArray[i].mass > maxMass){
			maxMass = particlesArray[i].mass;
		}
		if(particlesArray[i].mass < minMass){
			minMass = particlesArray[i].mass;
		}
	}
	//Once the max and min are found, sets each particle's color
	for (var i = 0; i < particlesArray.length; i++) {
		setColor(particlesArray[i]);
	}
	if(particlesArray.length === 1){
		particlesArray[0].h = 100;
		particlesArray[0].s = 100;
		particlesArray[0].l = 50;
	}
}

//Sets the color of a particle. Uses a mapping function to change it's relative mass to a relative color (currently lightest to heaviest is from green to red)
//The HSL color scheme allows the hue to be changed with one value rather than three (RBG) so it's ideal for creating a spectrum/gradient
function setColor(thisParticle){
	thisParticle.h = 100-mapValue(thisParticle.mass, minMass, maxMass, 0, 100);
	thisParticle.s = 100;
	thisParticle.l = 50;
}

 //A simple JS implementation of arduino "map" function. Scales an input value between two input bounds to an output value between two output bounds
function mapValue(value, inMin, inMax, outMin, outMax){
	return (value - inMin)*(outMax - outMin) / (inMax - inMin) + outMin;
}

//Main simulation loop - steps forward if the simulation is unpaused, otherwise tries again
function update(){
	if(!paused){
		step();
	}
	requestAnimationFrame(update);
}

//Main simulation logic. Clears the screen, uses bounce to check for collisions, then goes through each particle moving, drawing, and drawing trails.
function step(){
	ctx.clearRect(0,0,w,h);
	bounce();
	for(var i=0; i<particlesArray.length; i++){
		thisParticle = particlesArray[i];
		thisParticle.moveParticle();
		drawParticle(thisParticle.h, thisParticle.s, thisParticle.l, 1, thisParticle.x, thisParticle.y, thisParticle.radius);
		drawTrails(thisParticle);
	}
}
