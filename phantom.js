function Phantom(name, speed, state, actual_tile_x, actual_tile_y, actual_direction, next_tile_x, next_tile_y,  next_direction)
{
    this.name = name;
	this.speed = speed;
	this.state = state;
    

// valores x, y dentro del tile en el que están actualmente
	this.actual_tile_x = actual_tile_x;
	this.actual_tile_y = actual_tile_y;
	this.actual_direction = actual_direction;

    this.next_tile_x = next_tile_x;
    this.next_tile_y = next_tile_y;
	this.next_direction = next_direction;


    	// Loading spritesheet
    var fantasmas = new Texture("imgs/fantasmas.png");
    this.sprite;
	// Prepare pacman sprites & its animations
    switch (name){
        case 'blinky':
    	    this.sprite = new Sprite(96, 96, 32, 32, 16, fantasmas);    

            this.sprite.addAnimation();
            this.sprite.addKeyframe(PhantomDirection.LEFT, [64, 0, 32, 32]);
            this.sprite.addKeyframe(PhantomDirection.LEFT, [96, 0, 32, 32]);

            this.sprite.addAnimation();
            this.sprite.addKeyframe(PhantomDirection.RIGHT, [0,  0, 32, 32]);
            this.sprite.addKeyframe(PhantomDirection.RIGHT, [32, 0, 32, 32]);

            this.sprite.addAnimation();
            this.sprite.addKeyframe(PhantomDirection.UP, [128, 0, 32, 32]);
            this.sprite.addKeyframe(PhantomDirection.UP, [160, 0, 32, 32]);
            
            this.sprite.addAnimation();
            this.sprite.addKeyframe(PhantomDirection.DOWN, [192, 0, 32, 32]);
            this.sprite.addKeyframe(PhantomDirection.DOWN, [224, 0, 32, 32]);

            this.sprite.addAnimation(); //4
            this.sprite.addKeyframe(PhantomState.FRIGHTENED, [256,  0, 32, 32]);
            this.sprite.addKeyframe(PhantomState.FRIGHTENED, [288, 0, 32, 32]);

            this.sprite.addAnimation(); //5 es el parpadeo para cuando la animación va a terminar
            this.sprite.addKeyframe(5, [256,  0, 32, 32]);
            this.sprite.addKeyframe(5, [288, 0, 32, 32]);
            this.sprite.addKeyframe(5, [320,  0, 32, 32]);
            this.sprite.addKeyframe(5, [352, 0, 32, 32]);
            break;

    };
}


Phantom.prototype.isLoaded = function ()
{
	return false
}