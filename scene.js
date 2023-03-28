
/*
tile 0 nada
tila 45 negro
tile 46 dot
tile 48 powerpellet
*/

const PACMAN_STOP_LEFT = 0;
const PACMAN_STOP_RIGHT = 1;
const PACMAN_STOP_UP = 2;
const PACMAN_STOP_DOWN = 3;

const PACMAN_EAT_LEFT = 4;
const PACMAN_EAT_RIGHT = 5;
const PACMAN_EAT_UP = 6;
const PACMAN_EAT_DOWN = 7;

const PACMAN_CADAVER = 8;

// Scene. Updates and draws a single scene of the game.

function Scene()
{
	// Loading texture to use in a TileMap
	this.tilesheetBlue = new Texture("imgs/blue_tilesheet.png");
	this.tilesheetGrey = new Texture("imgs/grey_tilesheet.png");

	// Loading spritesheet
	this.pacman_tilesheet = new Texture("imgs/pacman.png");
	this.fruit_tilesheet = new Texture("imgs/fruits.png");
	this.scoreFruit_tilesheet = new Texture("imgs/score_fruits.png");

	// Prepare sounds
	this.wakawakaSound1 = AudioFX('sounds/munch_1.wav');
	this.wakawakaSound2 = AudioFX('sounds/munch_2.wav');
	this.mainSound = AudioFX('sounds/siren_1.wav', { loop: true, autoplay: true})
	this.extendSound = AudioFX('sounds/extend.wav');
	this.introSound = AudioFX('sounds/game_start.wav');
	this.fruitSound = AudioFX('sounds/eat_fruit.wav');
	this.eatenSound = AudioFX('sounds/power_pellet.wav', { loop: true})
	this.death1Sound = AudioFX('sounds/death_1.wav');
	this.death2Sound = AudioFX('sounds/death_2.wav');

	// Create Pacman
	this.create_pacman()

	this.score = 0
	this.highscore = 1000
	this.level = 0
	this.maxSpeed = 2
	this.auxState = 0

	this.pacmanLives = 1

	this.hardness_settings = structuredClone(hardness_settings)

	this.win_condition = 284//284

	// TRICKS
	this.GodMode = false

	this.init()
}

Scene.prototype.init = function(){

	// Create tilemap
	if (this.stateGame!=4)
		this.map = new Tilemap(this.tilesheetBlue, [16, 16], [16, 3], [0, 48], structuredClone(MAPA1));

	// Set Pacman inital animation
	this.pacmanSprite.setAnimation(PACMAN_EAT_RIGHT);

	// Set Pacman initial pos
	this.pacmanSprite.x = 216
	this.pacmanSprite.y = 344

	// Store current time
	this.currentTime = 0
	this.auxTime = 0
	this.auxTimeFruit = 0
	this.auxTimeGhostEat = 0
	this.auxState = 0

	this.pacmanDirection = 'right'
	this.pacmanNewDirection = 'none'
	this.pacmanDirectionCornering = 'none'

	this.checkBonus = 0
	this.checkGhostEat = false
	
	if (this.stateGame==4){
		this.pacmanLives -= 1
	}
	else{
		this.level += 1;
		this.dotsNumber = 0
	}

	if(this.pacmanLives==0){
		this.stateGame = 5 // Game over
		this.score = 0
	}
	else{
		this.stateGame = 0
	}
	
	
	this.speedPacman = this.maxSpeed*this.hardness_settings["pacman_speed"][this.level-1] // In pixels per frame

	//  Posicion inicial donde se pintan los fantasmas
	this.blinky = new Phantom("blinky", 16*3+8 , 16*3+8 ,"right");
	this.pinky = new Phantom("pinky", 16*3+8 , 16*3+8 ,"right");
	this.inky = new Phantom("inky", 16*3+8 , 16*3+8 ,"right");
	this.clyde = new Phantom("clyde", 16*3+8 , 16*3+8 ,"right");

	this.blinky.speed = this.maxSpeed*this.hardness_settings["pacman_speed"][this.level-1] // In pixels per frame
	this.pinky.speed = this.maxSpeed*this.hardness_settings["pacman_speed"][this.level-1] // In pixels per frame
	this.inky.speed = this.maxSpeed*this.hardness_settings["pacman_speed"][this.level-1] // In pixels per frame
	this.clyde.speed = this.maxSpeed*this.hardness_settings["pacman_speed"][this.level-1] // In pixels per frame

	// esto se usa para especificar el estado inicial
	var pacman_x = Math.floor(this.pacmanSprite.x/16);
	var pacman_y = Math.floor(this.pacmanSprite.y/16);
	var blinky_x = Math.floor(this.blinky.sprite.x/16);
	var blinky_y = Math.floor(this.blinky.sprite.y/16);
	//console.log('ini', pacman_x, pacman_y, blinky_x, blinky_y);

	this.blinky.set_new_state(PhantomState.CHASE, this.map, pacman_x, pacman_y, this.pacmanDirection, blinky_x, blinky_y );
	this.pinky.set_new_state(PhantomState.CHASE, this.map, pacman_x, pacman_y, this.pacmanDirection, blinky_x, blinky_y );
	this.inky.set_new_state(PhantomState.CHASE, this.map, pacman_x, pacman_y, this.pacmanDirection, blinky_x, blinky_y );
	this.clyde.set_new_state(PhantomState.CHASE, this.map, pacman_x, pacman_y, this.pacmanDirection, blinky_x, blinky_y );

}

Scene.prototype.update = function(deltaTime)
{
	// Keep track of time
	if (interacted){
		this.currentTime += deltaTime;
	}

	this.check_tricks()
		
	
	if (this.stateGame==0){// Intro
		if (interacted){
			this.introSound.play()
			if(this.currentTime>4000){
				this.stateGame = 1
			}
		}
		
	}
	else if(this.stateGame==1){// Gameplay
		if(interacted && !this.checkGhostEat){
			this.mainSound.play()
		}
		if (this.currentTime % 16 && !this.checkGhostEat){

			if (!this.GodMode) this.pacman_ghosts_touch()

			this.blinky.speed = this.maxSpeed*this.hardness_settings["pacman_speed"][this.level-1] // In pixels per frame
			this.pinky.speed = this.maxSpeed*this.hardness_settings["pacman_speed"][this.level-1] // In pixels per frame
			this.inky.speed = this.maxSpeed*this.hardness_settings["pacman_speed"][this.level-1] // In pixels per frame
			this.clyde.speed = this.maxSpeed*this.hardness_settings["pacman_speed"][this.level-1] // In pixels per frame

			var pacman_x = Math.floor(this.pacmanSprite.x/16);
			var pacman_y = Math.floor(this.pacmanSprite.y/16);
			var blinky_x = Math.floor(this.blinky.sprite.x/16);
			var blinky_y = Math.floor(this.blinky.sprite.y/16);
	
			// recalcula CHASE target_tile cada 2 tiles
			this.blinky.set_new_state(PhantomState.CHASE, this.map, pacman_x, pacman_y, this.pacmanDirection, blinky_x, blinky_y );
			this.pinky.set_new_state(PhantomState.CHASE, this.map, pacman_x, pacman_y, this.pacmanDirection, blinky_x, blinky_y );
			this.inky.set_new_state(PhantomState.CHASE, this.map, pacman_x, pacman_y, this.pacmanDirection, blinky_x, blinky_y );
			this.clyde.set_new_state(PhantomState.CHASE, this.map, pacman_x, pacman_y, this.pacmanDirection, blinky_x, blinky_y );
		}

		// Eat fruit
		if(this.checkBonus==1){
			if((this.pacmanSprite.x >= 216 && this.pacmanSprite.x <= 218) && (Math.floor(this.pacmanSprite.y) == 344)){
				this.fruitSound.play()
				this.auxTimeFruit = this.currentTime
				this.checkBonus = 2
				if(this.level == 1) this.score += 100
				else if(this.level == 2) this.score += 300
				else if(this.level == 3 || this.level == 4) this.score += 500
				else if(this.level == 5 || this.level == 6) this.score += 700
				else if(this.level == 7 || this.level == 8) this.score += 1000
				else if(this.level == 9 || this.level == 10) this.score += 2000
				else if(this.level == 11 || this.level == 12) this.score += 3000
				else this.score += 5000
			}
			if((this.currentTime-this.auxTimeFruit)>10000){
				this.auxTimeFruit = 0
				this.checkBonus = 0
			}
		}
		else if(this.checkBonus==2){
			if((this.currentTime-this.auxTimeFruit)>2000){
				this.auxTimeFruit = 0
				this.checkBonus = 0
			}
		}

		// Ghost eating time
		if (this.checkGhostEat && ((this.currentTime-this.auxTimeGhostEat)>1000*this.hardness_settings["fright_time"][this.level-1])){
			this.eatenSound.stop()
			this.mainSound.play()
			this.checkGhostEat = false
			
			this.blinky.speed = this.maxSpeed*this.hardness_settings["ghost_speed"][this.level-1]
			this.pinky.speed = this.maxSpeed*this.hardness_settings["ghost_speed"][this.level-1]
			this.inky.speed = this.maxSpeed*this.hardness_settings["ghost_speed"][this.level-1]
			this.clyde.speed = this.maxSpeed*this.hardness_settings["ghost_speed"][this.level-1]
		}

		if (this.pacmanDirection!='cornering'){
			// Update pacman movement direction
			if( (keyboard[37] || keyboard[65]) && (this.pacmanSprite.currentAnimation != PACMAN_CADAVER) && (this.pacmanDirection!='left')){// KEY_LEFT
				if(this.valid_turn_move('left')){
					if(this.pacmanSprite.currentAnimation != PACMAN_EAT_LEFT)
						this.pacmanSprite.setAnimation(PACMAN_EAT_LEFT);
	
					this.pacmanDirection = this.make_cornering('left', this.pacmanDirection)
				}
			}
			else if( (keyboard[39] || keyboard[68]) && (this.pacmanSprite.currentAnimation != PACMAN_CADAVER) && (this.pacmanDirection!='right')){ // KEY_RIGHT
				
				if(this.valid_turn_move('right')){
					if(this.pacmanSprite.currentAnimation != PACMAN_EAT_RIGHT)
						this.pacmanSprite.setAnimation(PACMAN_EAT_RIGHT);
	
					this.pacmanDirection = this.make_cornering('right', this.pacmanDirection)
				}
			}
			else if( (keyboard[38] || keyboard[87]) && (this.pacmanSprite.currentAnimation != PACMAN_CADAVER) && (this.pacmanDirection!='up')){// KEY_UP
	
				if(this.valid_turn_move('up')){
					if(this.pacmanSprite.currentAnimation != PACMAN_EAT_UP)
						this.pacmanSprite.setAnimation(PACMAN_EAT_UP);
					
					this.pacmanDirection = this.make_cornering('up', this.pacmanDirection)
				}
			}
			else if( (keyboard[40] || keyboard[83]) && (this.pacmanSprite.currentAnimation != PACMAN_CADAVER) && (this.pacmanDirection!='down')){ // KEY_DOWN
				
				if(this.valid_turn_move('down')){
					if(this.pacmanSprite.currentAnimation != PACMAN_EAT_DOWN)
						this.pacmanSprite.setAnimation(PACMAN_EAT_DOWN);
	
					this.pacmanDirection = this.make_cornering('down', this.pacmanDirection)
				}
	
			}
			else if(keyboard[13] && (this.pacmanSprite.currentAnimation != PACMAN_CADAVER)){
				this.pacmanSprite.setAnimation(PACMAN_CADAVER);
			}

			else if (keyboard[71]){
				this.eat_power_pellet()
			}
	
		}
	
		switch(this.pacmanDirection){
	
			case "left":
			this.pacmanSprite.x -= this.speedPacman;
			var tileId = this.map.collisionLeft(this.pacmanSprite);
			
			if(tileId != 0 && tileId != 46 && tileId != 45 && tileId != 48 && tileId != 11)
			{
				this.pacmanSprite.x += this.speedPacman;
				this.pacmanSprite.currentAnimation = PACMAN_STOP_LEFT
				this.pacmanSprite.setAnimation(PACMAN_STOP_LEFT);
			}
			else if(tileId == 11){
				//console.log(this.pacmanSprite.x)
				//this.pacmanSprite.x -= this.speedPacman;
				if (this.pacmanSprite.x <= 0) this.pacmanSprite.x=426
			}
			else{
				this.getTilepos(this.pacmanSprite.x, this.pacmanSprite.y)
				this.eat_dot("left", this.pacmanSprite.x, this.pacmanSprite.y)
				
			}
			break;
	
			case "up":
			this.pacmanSprite.y -= this.speedPacman;
			var tileId = this.map.collisionUp(this.pacmanSprite);
	
			if(tileId != 0 && tileId != 46 && tileId != 45 && tileId != 48)
			{
				this.pacmanSprite.y += this.speedPacman;
				this.pacmanSprite.currentAnimation = PACMAN_STOP_UP
				this.pacmanSprite.setAnimation(PACMAN_STOP_UP);
			}
			else{
				this.getTilepos(this.pacmanSprite.x, this.pacmanSprite.y)
				this.eat_dot("up", this.pacmanSprite.x, this.pacmanSprite.y)
			}
			break;
	
			case "right":
			this.pacmanSprite.x += this.speedPacman;
			var tileId = this.map.collisionRight(this.pacmanSprite);
			
			if(tileId != 0 && tileId != 46 && tileId != 45 && tileId != 48 && tileId != 13)
			{
				this.pacmanSprite.x -= this.speedPacman;
				this.pacmanSprite.currentAnimation = PACMAN_STOP_RIGHT
				this.pacmanSprite.setAnimation(PACMAN_STOP_RIGHT);
			}
			else if(tileId == 13){
				//console.log(this.pacmanSprite.x)
				//this.pacmanSprite.x += this.speedPacman;
				if (this.pacmanSprite.x >= 426+32) this.pacmanSprite.x=0
			}
			else{
				this.getTilepos(this.pacmanSprite.x, this.pacmanSprite.y)
				this.eat_dot("right", this.pacmanSprite.x, this.pacmanSprite.y)
			}
			break;
	
			case "down":
			this.pacmanSprite.y += this.speedPacman;
			var tileId = this.map.collisionDown(this.pacmanSprite);
			
			if(tileId != 0 && tileId != 46 && tileId != 45 && tileId != 48)
			{
				this.pacmanSprite.y -= this.speedPacman;
				this.pacmanSprite.currentAnimation = PACMAN_STOP_DOWN
				this.pacmanSprite.setAnimation(PACMAN_STOP_DOWN);
			}
			else{
				this.getTilepos(this.pacmanSprite.x, this.pacmanSprite.y)
				this.eat_dot("down", this.pacmanSprite.x, this.pacmanSprite.y)
			}
			break;
	
			case "cornering":
				
				var centros = this.check_center()
				switch(this.pacmanDirectionCornering){
					case "left":
						this.pacmanSprite.x -= this.speedPacman;
						if (this.pacmanNewDirection == 'up') this.pacmanSprite.y -= this.speedPacman;
						else this.pacmanSprite.y += this.speedPacman;
						
						if (centros["centroTileX"]>=centros["centroPacmanX"]){
							this.pacmanDirection = this.pacmanNewDirection
							this.pacmanSprite.x = centros["centroTileX"]-16
						}
						break;
					case "right":
						this.pacmanSprite.x += this.speedPacman;
						if (this.pacmanNewDirection == 'up') this.pacmanSprite.y -= this.speedPacman;
						else this.pacmanSprite.y += this.speedPacman;
	
						if (centros["centroTileX"]<=centros["centroPacmanX"]){
							this.pacmanDirection = this.pacmanNewDirection
							this.pacmanSprite.x = centros["centroTileX"]-16
						}
						break;
					case "up":
						this.pacmanSprite.y -= this.speedPacman;
						if (this.pacmanNewDirection == 'right') this.pacmanSprite.x += this.speedPacman;
						else this.pacmanSprite.x -= this.speedPacman;
	
						if (centros["centroTileY"]>=centros["centroPacmanY"]){
							this.pacmanDirection = this.pacmanNewDirection
							this.pacmanSprite.y = centros["centroTileY"]-16
						}
						break;
					case "down":
						this.pacmanSprite.y += this.speedPacman;
						if (this.pacmanNewDirection == 'right') this.pacmanSprite.x += this.speedPacman;
						else this.pacmanSprite.x -= this.speedPacman;
	
						if (centros["centroTileY"]<=centros["centroPacmanY"]){
							this.pacmanDirection = this.pacmanNewDirection
							this.pacmanSprite.y = centros["centroTileY"]-16
						}
						break;
				}
			break;
	
		}

		this.blinky.supermove(deltaTime, this.map, this.pacmanSprite, this.hardness_settings);
		this.pinky.supermove(deltaTime, this.map, this.pacmanSprite, this.hardness_settings);
		this.inky.supermove(deltaTime, this.map, this.pacmanSprite, this.hardness_settings);
		this.clyde.supermove(deltaTime, this.map, this.pacmanSprite, this.hardness_settings);
	}
	else if (this.stateGame==2){// Win level

		if ((this.currentTime-this.auxTime)>3000){
			this.init()
		}
	}
	else if (this.stateGame==4){// Lose level
		var timeElapsed = this.currentTime-this.auxTime
		if (timeElapsed>3000 && this.auxState==0){
			this.death2Sound.play()
			this.auxState = 1
			this.auxTime = this.currentTime
		}
		else if (timeElapsed>290 && this.auxState==1){
			this.death2Sound.play()
			this.auxState = 2
			this.auxTime = this.currentTime
		}
		else if (timeElapsed>1000 && this.auxState==2){
			this.init()	
		}
	}
	
	// Update sprite
	this.pacmanSprite.update(deltaTime);

}

Scene.prototype.draw = function ()
{
	// Get canvas object, then its context
	var canvas = document.getElementById("game-layer");
	var context = canvas.getContext("2d");

	// Clear background and set text font
	context.fillStyle = "Black";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.font = "16px emulogic";

	// Set text color
	context.fillStyle = "White";

	// Draw highscore
	this.draw_scoreboard(context);

	// End game blink
	if (this.stateGame==2){
		if (500>(this.currentTime % 1000) && (this.currentTime % 1000)>0){
			this.map.tilesheet = this.tilesheetGrey
		}
		else if (1000>(this.currentTime % 1000) && (this.currentTime % 1000)>500)
		{
			this.map.tilesheet = this.tilesheetBlue	
		}
	}

	// Draw tilemap
	this.map.draw();

	// READY Message
	if (this.stateGame==0){
		context.fillStyle = "Yellow";
		var text = "READY!";
		var textSize = context.measureText(text);
		context.fillText(text, 224 - textSize.width/2, 16*17);
		context.fillStyle = "White";
	}

	if(this.stateGame==5){
		context.fillStyle = "Red";
		var text = "GAME OVER";
		var textSize = context.measureText(text);
		context.fillText(text, 224 - textSize.width/2, 16*17);
		context.fillStyle = "White";
	}
	else{
		// Draw fruit
		this.draw_fruit();
		
		// Draw pacman sprite
		this.pacmanSprite.draw()

		// Draw ghosts sprites
		this.blinky.sprite.draw();
		this.pinky.sprite.draw();
		this.inky.sprite.draw();
		this.clyde.sprite.draw();

		// Draw bottom
		this.draw_bottom(context, canvas)
	}

	
}

Scene.prototype.check_center = function(){

	var centros = {"centroPacmanX":0,"centroPacmanX":0,"centroTileX":0,"centroTileY":0};
	centros["centroPacmanX"] = this.pacmanSprite.x + 16
	centros["centroPacmanY"] = this.pacmanSprite.y + 16

	var x = Math.floor(centros["centroPacmanX"]/16);
	var y = Math.floor(centros["centroPacmanY"]/16);

	//console.log(x + ", " + y);

	centros["centroTileX"] = (x*16)+8
	centros["centroTileY"] = (y*16)+8

	//console.log(centros["centroPacmanX"] + ", " + centros["centroPacmanY"]);
	//console.log(centros["centroTileX"] + ": " + centros["centroTileY"]);

	return centros
}

Scene.prototype.make_cornering = function(newDirection, actualDirection){

	var centros = this.check_center()

	this.pacmanNewDirection = newDirection

	if((newDirection=='up' && actualDirection=='left') || (newDirection=='down' && actualDirection=='left')){
		
		if (centros["centroTileX"]<centros["centroPacmanX"]){
			this.pacmanDirectionCornering = "left"
			this.eat_dot("left", centros["centroPacmanX"]-16, centros["centroPacmanY"]-16)
			return "cornering";
		}
	}

	else if((newDirection=='up' && actualDirection=='right') || (newDirection=='down' && actualDirection=='right')){
		if (centros["centroTileX"]>centros["centroPacmanX"]){
			this.pacmanDirectionCornering = "right"
			this.eat_dot("left", centros["centroPacmanX"]-16, centros["centroPacmanY"]-16)
			return "cornering";
		}
	}

	else if((newDirection=='left' && actualDirection=='up') || (newDirection=='right' && actualDirection=='up')){
		if (centros["centroTileY"]<centros["centroPacmanY"]){
			this.pacmanDirectionCornering = "up"
			this.eat_dot("left", centros["centroPacmanX"]-16, centros["centroPacmanY"]-16)
			return "cornering";
		}
	}

	else if((newDirection=='left' && actualDirection=='down') || (newDirection=='right' && actualDirection=='down')){
		if (centros["centroTileY"]>centros["centroPacmanY"]){
			this.pacmanDirectionCornering = "down"
			this.eat_dot("left", centros["centroPacmanX"]-16, centros["centroPacmanY"]-16)
			return "cornering";
		}
	}
	return newDirection
}

Scene.prototype.valid_turn_move = function (direction){
	check = true;
	switch(direction){
		case "left":
			this.pacmanSprite.x -= this.speedPacman;
			var tileId = this.map.collisionLeft(this.pacmanSprite);
			if(tileId != 0 && tileId != 46 && tileId != 45){
				check = false
			}
			this.pacmanSprite.x += this.speedPacman;
			break;
		case "right":
			this.pacmanSprite.x += this.speedPacman;
			var tileId = this.map.collisionRight(this.pacmanSprite);
			if(tileId != 0 && tileId != 46 && tileId != 45){
				check = false
			}
			this.pacmanSprite.x -= this.speedPacman;
			break;
		case "up":
			this.pacmanSprite.y -= this.speedPacman;
			var tileId = this.map.collisionUp(this.pacmanSprite);
			if(tileId != 0 && tileId != 46 && tileId != 45){
				check = false
			}
			this.pacmanSprite.y += this.speedPacman;
			break;
		case "down":
			this.pacmanSprite.y += this.speedPacman;
			var tileId = this.map.collisionDown(this.pacmanSprite);
			if(tileId != 0 && tileId != 46 && tileId != 45){
				check = false
			}
			this.pacmanSprite.y -= this.speedPacman;
			break;
	}
	return check
}

Scene.prototype.eat_power_pellet = function(){
	this.checkGhostEat = true
	this.auxTimeGhostEat = this.currentTime
	this.mainSound.stop()
	this.eatenSound.play()
	console.log("power")

	var pacman_x = Math.floor(this.pacmanSprite.x/16);
	var pacman_y = Math.floor(this.pacmanSprite.y/16);
	var blinky_x = Math.floor(this.blinky.sprite.x/16);
	var blinky_y = Math.floor(this.blinky.sprite.y/16);

	this.blinky.set_new_state(PhantomState.FRIGHTENED, this.map, pacman_x, pacman_y, this.pacmanDirection, blinky_x, blinky_y );
	this.pinky.set_new_state(PhantomState.FRIGHTENED, this.map, pacman_x, pacman_y, this.pacmanDirection, blinky_x, blinky_y );
	this.inky.set_new_state(PhantomState.FRIGHTENED, this.map, pacman_x, pacman_y, this.pacmanDirection, blinky_x, blinky_y );
	this.clyde.set_new_state(PhantomState.FRIGHTENED, this.map, pacman_x, pacman_y, this.pacmanDirection, blinky_x, blinky_y );

	this.blinky.speed = this.maxSpeed*this.hardness_settings["fright_speed"][this.level-1]
	this.pinky.speed = this.maxSpeed*this.hardness_settings["fright_speed"][this.level-1]
	this.inky.speed = this.maxSpeed*this.hardness_settings["fright_speed"][this.level-1]
	this.clyde.speed = this.maxSpeed*this.hardness_settings["fright_speed"][this.level-1]
}

Scene.prototype.getTilepos = function(xpos, ypos){
	
	x = Math.floor(xpos/16)+2;
	y = Math.floor(ypos/16)+4;

	pixelx = ((x-1)*16)
	pixely = ((y-1)*16)+8

	if(xpos>=pixelx) 

	console.log(pixelx + ", " + pixely)
}

Scene.prototype.eat_dot = function(direction, xpos, ypos){
	//x = Math.floor(xpos/16)+1;
	//y = Math.floor(ypos/16)-2;
	x = Math.floor((xpos+16)/16);
	y = Math.floor((ypos+16)/16)-3;
	
	var tileId = this.map.map.layers[0].data[(y*28)+x];
	
	if(tileId == 46 || tileId == 48){ //dot
		this.speedPacman = this.maxSpeed*this.hardness_settings["pacman_speed_dots"][this.level-1]
		if (this.checkAux){
			this.wakawakaSound1.play()
			this.checkAux = false
		}
		else{
			this.wakawakaSound2.play()
			this.checkAux = true
		}
		
		this.dotsNumber += 1
		
		//first bonus
		if(this.dotsNumber == 70){
			this.auxTimeFruit = this.currentTime
			this.checkBonus = 1
		}
		//second bonus
		else if(this.dotsNumber == 170){
			this.auxTimeFruit = this.currentTime
			this.checkBonus = 1
		}		

		if(tileId == 48){
			this.eat_power_pellet()
			this.score += 50
		}
		else{
			this.score += 10
		}

		if (this.score > this.highscore) this.highscore = this.score;
		this.map.map.layers[0].data[(y*28)+x] = 0;

		if (this.dotsNumber == this.win_condition){	
			this.player_win()
		}
	}
	else{
		this.speedPacman = this.maxSpeed*this.hardness_settings["pacman_speed"][this.level-1]
	}
	
	
	return
}

Scene.prototype.player_win = function(){
	
	this.eatenSound.stop()
	this.mainSound.stop()
	this.extendSound.play()
	this.auxTime = this.currentTime
	
	switch (this.pacmanDirection){
		case "up":
			this.pacmanSprite.setAnimation(PACMAN_STOP_UP)
			break;
			
		case "down":
			this.pacmanSprite.setAnimation(PACMAN_STOP_DOWN)
			break;
			
		case "left":
			this.pacmanSprite.setAnimation(PACMAN_STOP_LEFT)
			break
			
		case "right":
			this.pacmanSprite.setAnimation(PACMAN_STOP_RIGHT)
			break;
	}
	this.pacmanDirection = 'none'
	this.pacmanNewDirection = 'none'
	this.pacmanDirectionCornering = 'none'

	this.stateGame = 2
}

Scene.prototype.draw_scoreboard = function(context){

	var text = "1UP";
	var textSize = context.measureText(text);
	context.fillText(text, 64 - textSize.width/2, 16);

	var text = this.score.toString();
	var textSize = context.measureText(text);
	context.fillText(text, 64 - textSize.width/2, 32);

	var text = "HIGH SCORE";
	var textSize = context.measureText(text);
	context.fillText(text, 224 - textSize.width/2, 16);

	var text = this.highscore.toString();
	var textSize = context.measureText(text);
	context.fillText(text, 224 - textSize.width/2, 32);
}

Scene.prototype.create_pacman = function(){

	// Prepare pacman sprites & its animations
	this.pacmanSprite = new Sprite(216, 344, 32, 32, 16, this.pacman_tilesheet);

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
	this.pacmanSprite.setCollisionBox([8, 8], [24, 24])
}

Scene.prototype.draw_fruit = function(){

	// Get canvas object, then its context
	var canvas = document.getElementById("game-layer");
	var context = canvas.getContext("2d");

	if(this.checkBonus==1){
		if(this.level == 1) context.drawImage(this.fruit_tilesheet.img, 0, 0, 16, 16, 208, 344, 32, 32);
		else if(this.level == 2) context.drawImage(this.fruit_tilesheet.img, 16, 0, 16, 16, 208, 344, 32, 32);
		else if(this.level == 3 || this.level == 4) context.drawImage(this.fruit_tilesheet.img, 32, 0, 16, 16, 208, 344, 32, 32);
		else if(this.level == 5 || this.level == 6) context.drawImage(this.fruit_tilesheet.img, 48, 0, 16, 16, 208, 344, 32, 32);
		else if(this.level == 7 || this.level == 8) context.drawImage(this.fruit_tilesheet.img, 64, 0, 16, 16, 208, 344, 32, 32);
		else if(this.level == 9 || this.level == 10) context.drawImage(this.fruit_tilesheet.img, 80, 0, 16, 16, 208, 344, 32, 32);
		else if(this.level == 11 || this.level == 12) context.drawImage(this.fruit_tilesheet.img, 96, 0, 16, 16, 208, 344, 32, 32);
		else context.drawImage(this.fruit_tilesheet.img, 112, 0, 16, 16, 208, 344, 32, 32);	
	}
	if(this.checkBonus==2){
		if(this.level == 1) context.drawImage(this.scoreFruit_tilesheet.img, 0, 0, 16, 16, 208, 344, 32, 32);
		else if(this.level == 2) context.drawImage(this.scoreFruit_tilesheet.img, 16, 0, 16, 16, 208, 344, 32, 32);
		else if(this.level == 3 || this.level == 4) context.drawImage(this.scoreFruit_tilesheet.img, 32, 0, 16, 16, 208, 344, 32, 32);
		else if(this.level == 5 || this.level == 6) context.drawImage(this.scoreFruit_tilesheet.img, 48, 0, 16, 16, 208, 344, 32, 32);
		else if(this.level == 7 || this.level == 8) context.drawImage(this.scoreFruit_tilesheet.img, 64, 0, 32, 16, 192, 344, 64, 32);
		else if(this.level == 9 || this.level == 10) context.drawImage(this.scoreFruit_tilesheet.img, 96, 0, 32, 16, 192, 344, 64, 32);
		else if(this.level == 11 || this.level == 12) context.drawImage(this.scoreFruit_tilesheet.img, 128, 0, 32, 16, 192, 344, 64, 32);
		else context.drawImage(this.scoreFruit_tilesheet.img, 160, 0, 32, 16, 192, 344, 64, 32);	
	}
}

Scene.prototype.draw_bottom = function(context, canvas){

	//Draw lives
	for(i=0;i<this.pacmanLives;i++){
		context.drawImage(this.pacman_tilesheet.img, 32, 32, 32, 32, 32+(32*i), canvas.height-32, 32, 32);
	}

	//Draw fruits

	var fruits = [1, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8]
	var contAux = 1

	if(this.level >= 21){
		for (i=1; i<=7; i++){
			context.drawImage(this.fruit_tilesheet.img, 7*16, 0, 16, 16, canvas.width-(32*i), canvas.height-32, 32, 32);
		}
	}
	else if(this.level >= 8){
		for (i=this.level; i>=this.level-8; i--){
			context.drawImage(this.fruit_tilesheet.img, (fruits[i-1]-1)*16, 0, 16, 16, (canvas.width-(32*8))+(32*contAux), canvas.height-32, 32, 32);
			contAux++
		}
	}
	else{
		for (i=1; i<=this.level; i++){
			context.drawImage(this.fruit_tilesheet.img, (fruits[i-1]-1)*16, 0, 16, 16, canvas.width-32*i, canvas.height-32, 32, 32);
		}
	}
		
}

Scene.prototype.pacman_ghosts_touch = function(){
	var blinky_x = Math.floor((this.blinky.sprite.x + 16)/16)
	var blinky_y = Math.floor((this.blinky.sprite.y + 16)/16)

	var inky_x = Math.floor((this.inky.sprite.x + 16)/16)
	var inky_y = Math.floor((this.inky.sprite.y + 16)/16)

	var pinky_x = Math.floor((this.pinky.sprite.x + 16)/16)
	var pinky_y = Math.floor((this.pinky.sprite.y + 16)/16)

	var clyde_x = Math.floor((this.clyde.sprite.x + 16)/16)
	var clyde_y = Math.floor((this.clyde.sprite.y + 16)/16)

	var pacman_x = Math.floor((this.pacmanSprite.x + 16)/16)
	var pacman_y = Math.floor((this.pacmanSprite.y + 16)/16)

	if ((pacman_x == blinky_x) && (pacman_y == blinky_y)){
		console.log("murio")
		this.stateGame=4
		this.death1Sound.play()
		this.mainSound.stop()
		this.auxTime=this.currentTime
	}
	else if ((pacman_x == pinky_x) && (pacman_y == pinky_y)){
		console.log("murio")
		this.stateGame=4
		this.death1Sound.play()
		this.mainSound.stop()
		this.auxTime=this.currentTime
	}
	else if ((pacman_x == inky_x) && (pacman_y == inky_y)){
		console.log("murio")
		this.stateGame=4
		this.death1Sound.play()
		this.mainSound.stop()
		this.auxTime=this.currentTime
	}
	else if ((pacman_x == clyde_x) && (pacman_y == clyde_y)){
		console.log("murio")
		this.stateGame=4
		this.death1Sound.play()
		this.mainSound.stop()
		this.auxTime=this.currentTime
	}
}

Scene.prototype.check_tricks = function(){
	if(keyboard[49]){
		this.GodMode = true
		console.log("Ahora no te mueres")
	}
	else if(keyboard[50]){
		this.dotsNumber = this.player_win()
		console.log("Ganaste")
	}
}