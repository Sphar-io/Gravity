function ball()
{	this.r;
	this.g;
	this.b; //colors
	this.radius;
	this.x;
	this.y;
	this.vx;
	this.vy;
	this.bounceX = function(){
		this.vx *= -1*bounceFactor;
	}
	this.bounceY = function(){
		this.vy *= -1*bounceFactor;
	}
	this.posQueue = [];

	this.moveBall = function(){
		this.vx = (this.vx > 0) ? this.vx-friction : this.vx+friction;
		this.vy = (this.vy > 0) ? this.vy-friction : this.vy+friction;
		this.vy += gravity;

		this.x += this.vx;
		this.y += this.vy;
	}
}

