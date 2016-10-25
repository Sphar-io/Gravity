//a particle "object" that has color, radius, density, mass, etc. It also holds it's own past positions for motion trails and its own move method. 
function Particle()
{	this.h = 20;
	this.s;
	this.l; //colors
	this.radius;
	this.density;
	this.mass;
	this.x;
	this.y;
	this.vx;
	this.vy;
	this.collided = false;
	
	this.posQueue = [];

	this.moveParticle = function(){
		this.vx *= frictionCoe;
		this.vy *= frictionCoe;

		this.x += this.vx;
		this.y += this.vy;

		//Adds position to motion trial queue, keeps trail at length specified in world.js
		this.posQueue.push({x: this.x, y: this.y});
		if(this.posQueue.length > trailsLength) this.posQueue.shift();
	}
}

