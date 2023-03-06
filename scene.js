
const PACMAN_STOP_LEFT = 0;
const PACMAN_STOP_RIGHT = 1;
const PACMAN_STOP_UP = 2;
const PACMAN_STOP_DOWN = 3;

const PACMAN_EAT_LEFT = 4;
const PACMAN_EAT_RIGHT = 5;
const PACMAN_EAT_UP = 6;
const PACMAN_EAT_DOWN = 7;

const PACMAN_CADAVER = 8;


var pacmanDirection = 'left'

// Scene. Updates and draws a single scene of the game.

function Scene()
{
	// Loading texture to use in a TileMap
	var tilesheet = new Texture("imgs/blue_tilesheet.png");

	// Create tilemap
	this.map = new Tilemap(tilesheet, [16, 16], [16, 3], [0, 48], MAPA1);
	
	// Loading spritesheet
	var pacman = new Texture("imgs/pacman.png");

	// Prepare pacman sprites & its animations
	this.pacmanSprite = new Sprite(216, 344, 32, 32, 16, pacman);

// Add STOP ANIMATIONS
	// LEFT STOP
	this.pacmanSprite.addAnimation();
	this.pacmanSprite.addKeyframe(PACMAN_STOP_LEFT, [32, 32, 32, 32]);
	
	// RIGHT STOP
	this.pacmanSprite.addAnimation();
	this.pacmanSprite.addKeyframe(PACMAN_STOP_RIGHT, [32, 0, 32, 32]);

	// UP STOP
	this.pacmanSprite.addAnimation();
	this.pacmanSprite.addKeyframe(PACMAN_STOP_UP, [32, 64, 32, 32]);

	// DOWN STOP
	this.pacmanSprite.addAnimation();
	this.pacmanSprite.addKeyframe(PACMAN_STOP_DOWN, [32, 96, 32, 32]);


	// add EAT ANIMATIONS

	//EAT LEFT
	this.pacmanSprite.addAnimation();
	this.pacmanSprite.addKeyframe(PACMAN_EAT_LEFT, [0,  32, 32, 32]);
	this.pacmanSprite.addKeyframe(PACMAN_EAT_LEFT, [32, 32, 32, 32]);
	this.pacmanSprite.addKeyframe(PACMAN_EAT_LEFT, [64, 32, 32, 32]);
	this.pacmanSprite.addKeyframe(PACMAN_EAT_LEFT, [96, 32, 32, 32]);

	//EAT RIGHT
	this.pacmanSprite.addAnimation();
	this.pacmanSprite.addKeyframe(PACMAN_EAT_RIGHT, [0,  0, 32, 32]);
	this.pacmanSprite.addKeyframe(PACMAN_EAT_RIGHT, [32, 0, 32, 32]);
	this.pacmanSprite.addKeyframe(PACMAN_EAT_RIGHT, [64, 0, 32, 32]);
	this.pacmanSprite.addKeyframe(PACMAN_EAT_RIGHT, [96, 0, 32, 32]);
	
	//EAT UP
	this.pacmanSprite.addAnimation();
	this.pacmanSprite.addKeyframe(PACMAN_EAT_UP, [0,  64, 32, 32]);
	this.pacmanSprite.addKeyframe(PACMAN_EAT_UP, [32, 64, 32, 32]);
	this.pacmanSprite.addKeyframe(PACMAN_EAT_UP, [64, 64, 32, 32]);
	this.pacmanSprite.addKeyframe(PACMAN_EAT_UP, [96, 64, 32, 32]);

	//EAT DOWN
	this.pacmanSprite.addAnimation();
	this.pacmanSprite.addKeyframe(PACMAN_EAT_DOWN, [0,  96, 32, 32]);
	this.pacmanSprite.addKeyframe(PACMAN_EAT_DOWN, [32, 96, 32, 32]);
	this.pacmanSprite.addKeyframe(PACMAN_EAT_DOWN, [64, 96, 32, 32]);
	this.pacmanSprite.addKeyframe(PACMAN_EAT_DOWN, [96, 96, 32, 32]);


	// CADAVER
	this.pacmanSprite.addAnimation();
	this.pacmanSprite.addKeyframe(PACMAN_CADAVER, [0,  128, 32, 32]);
	this.pacmanSprite.addKeyframe(PACMAN_CADAVER, [32, 128, 32, 32]);
	this.pacmanSprite.addKeyframe(PACMAN_CADAVER, [64, 128, 32, 32]);
	this.pacmanSprite.addKeyframe(PACMAN_CADAVER, [96, 128, 32, 32]);

	this.pacmanSprite.addKeyframe(PACMAN_CADAVER, [0,  160, 32, 32]);
	this.pacmanSprite.addKeyframe(PACMAN_CADAVER, [32, 160, 32, 32]);
	this.pacmanSprite.addKeyframe(PACMAN_CADAVER, [64, 160, 32, 32]);
	this.pacmanSprite.addKeyframe(PACMAN_CADAVER, [96, 160, 32, 32]);

	this.pacmanSprite.addKeyframe(PACMAN_CADAVER, [0,  192, 32, 32]);
	this.pacmanSprite.addKeyframe(PACMAN_CADAVER, [32, 192, 32, 32]);
	this.pacmanSprite.addKeyframe(PACMAN_CADAVER, [64, 192, 32, 32]);
	this.pacmanSprite.addKeyframe(PACMAN_CADAVER, [96, 192, 32, 32]);


	
	// Set pacman collision box
	this.pacmanSprite.setCollisionBox([8, 8], [23, 23])

	// SET INITIAL ANIMATION
	this.pacmanSprite.setAnimation(PACMAN_STOP_RIGHT);
	
	// Move right
	this.speedPacman = 2.5; // In pixels per frame
	
	// Store current time
	this.currentTime = 0
}


Scene.prototype.update = function(deltaTime)
{
	// Keep track of time
	this.currentTime += deltaTime;

	// Update pacman movement direction
	if( (keyboard[37] || keyboard[65]) && (this.pacmanSprite.currentAnimation != PACMAN_CADAVER)){// KEY_LEFT
		if(this.valid_turn_move('left')){
			if(this.pacmanSprite.currentAnimation != PACMAN_EAT_LEFT)
				this.pacmanSprite.setAnimation(PACMAN_EAT_LEFT);
			//this.pacmanSprite.x -= this.speedPacman;
			this.pacmanDirection = 'left';
		}
		
	}
	else if( (keyboard[39] || keyboard[68]) && (this.pacmanSprite.currentAnimation != PACMAN_CADAVER) ){ // KEY_RIGHT
		
		if(this.valid_turn_move('right')){
			if(this.pacmanSprite.currentAnimation != PACMAN_EAT_RIGHT)
			this.pacmanSprite.setAnimation(PACMAN_EAT_RIGHT);
			//this.pacmanSprite.x += this.speedPacman;
			this.pacmanDirection = 'right';
		}
	}
	else if( (keyboard[38] || keyboard[87]) && (this.pacmanSprite.currentAnimation != PACMAN_CADAVER)){// KEY_UP

		if(this.valid_turn_move('up')){
			if(this.pacmanSprite.currentAnimation != PACMAN_EAT_UP)
					this.pacmanSprite.setAnimation(PACMAN_EAT_UP);
			//this.pacmanSprite.y -= this.speedPacman;
			this.pacmanDirection = 'up';
		}
	}
	else if( (keyboard[40] || keyboard[83]) && (this.pacmanSprite.currentAnimation != PACMAN_CADAVER) ){ // KEY_DOWN
		
		if(this.valid_turn_move('down')){
			if(this.pacmanSprite.currentAnimation != PACMAN_EAT_DOWN)
			this.pacmanSprite.setAnimation(PACMAN_EAT_DOWN);
			//this.pacmanSprite.y += this.speedPacman;
			this.pacmanDirection = 'down';
		}
	}
	else if(keyboard[13] && (this.pacmanSprite.currentAnimation != PACMAN_CADAVER)){
		this.pacmanSprite.setAnimation(PACMAN_CADAVER);
	}









	// else if(this.pacmanSprite.currentAnimation != PACMAN_CADAVER) {	//STOP
	// 	this.pacmanSprite.setAnimation(this.pacmanSprite.currentAnimation);
	// 	if (this.pacmanDirection == 'left'){
	// 	 	this.pacmanSprite.setAnimation(PACMAN_STOP_LEFT);
	// 	}
	// 	else if (this.pacmanDirection == 'right'){
	// 	 	this.pacmanSprite.setAnimation(PACMAN_STOP_RIGHT);
	// 	}
	// 	else if (this.pacmanDirection == 'up'){
	// 		this.pacmanSprite.setAnimation(PACMAN_STOP_UP);
	//    	}
	// 	else if (this.pacmanDirection == 'down'){
	// 		this.pacmanSprite.setAnimation(PACMAN_STOP_DOWN);
	// 	}	   
	// 	// else{
	// 	// 	this.pacmanSprite.setAnimation(this.pacmanSprite.currentAnimation);
	// 	// }	
	// }
	// Reset pacman
	// if(keyboard[32]){
	// 	this.pacmanSprite.x = 64;
	// 	this.pacmanSprite.y = 250;

	// }
	else{
		
	}
	switch(this.pacmanDirection){
	case "left":
		this.pacmanSprite.x -= this.speedPacman;
		var tileId = this.map.collisionLeft(this.pacmanSprite);
		if(tileId != 0 && tileId != 46 && tileId != 45)
		{
			this.pacmanSprite.x += this.speedPacman;
			this.pacmanSprite.currentAnimation = PACMAN_STOP_LEFT
			this.pacmanSprite.setAnimation(PACMAN_STOP_LEFT);
		}
		else if(tileId == 48){
			this.catch_power_pellet()
		}
		break;

		case "up":
		this.pacmanSprite.y -= this.speedPacman;
		var tileId = this.map.collisionUp(this.pacmanSprite);
		if(tileId != 0 && tileId != 46 && tileId != 45)
		{
			this.pacmanSprite.y += this.speedPacman;
			this.pacmanSprite.currentAnimation = PACMAN_STOP_UP
			this.pacmanSprite.setAnimation(PACMAN_STOP_UP);
		}
		else if(tileId == 48){
			this.catch_power_pellet()
		}
		break;

		case "right":
		this.pacmanSprite.x += this.speedPacman;
		var tileId = this.map.collisionRight(this.pacmanSprite);
		if(tileId != 0 && tileId != 46 && tileId != 45)
		{
			this.pacmanSprite.x -= this.speedPacman;
			this.pacmanSprite.currentAnimation = PACMAN_STOP_RIGHT
			this.pacmanSprite.setAnimation(PACMAN_STOP_RIGHT);
		}
		else if(tileId == 48){
			this.catch_power_pellet()
		}
		break;

	case "down":
		this.pacmanSprite.y += this.speedPacman;
		var tileId = this.map.collisionDown(this.pacmanSprite);
		if(tileId != 0 && tileId != 46 && tileId != 45)
		{
			this.pacmanSprite.y -= this.speedPacman;
			this.pacmanSprite.currentAnimation = PACMAN_STOP_DOWN
			this.pacmanSprite.setAnimation(PACMAN_STOP_DOWN);
		}
		else if(tileId == 48){
			this.catch_power_pellet()
		}
		break;
	}

	// Update sprite
	this.pacmanSprite.update(deltaTime);
}

Scene.prototype.draw = function ()
{
	// Get canvas object, then its context
	var canvas = document.getElementById("game-layer");
	var context = canvas.getContext("2d");

	// Clear background
	context.fillStyle = "rgb(0, 0, 0)";
	context.fillRect(0, 0, canvas.width, canvas.height);

	// Draw tilemap
	this.map.draw();

	// Draw pacman sprite
	this.pacmanSprite.draw();
}



function valid_turn_move(direction){
	switch(direction){
		case "left":
			var tileId = this.map.collisionLeft(this.pacmanSprite);
			if(tileId != 0 && tileId != 46 && tileId != 45){
				return false
			}
			break;
		case "right":
			var tileId = this.map.collisionRight(this.pacmanSprite);
			if(tileId != 0 && tileId != 46 && tileId != 45){
				return false
			}
			break;
		case "up":
			var tileId = this.map.collisionUp(this.pacmanSprite);
			if(tileId != 0 && tileId != 46 && tileId != 45){
				return false
			}
			break;
		case "down":
			var tileId = this.map.collisionDown(this.pacmanSprite);
			if(tileId != 0 && tileId != 46 && tileId != 45){
				return false
			}
			break;
	}
	return true;
}

function catch_power_pellet(){
	null;
}