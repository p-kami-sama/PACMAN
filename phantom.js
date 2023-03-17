
/*
    actual_tile_x, actual_tile_y -> de la matrix de tilemap (0,0) -> arriba izquierda
    center_x, center_y -> centro del fantasma en el tile actual
    actual_direction -> por que lado sale del tile actual

    next_tile_x, next_tile_y -> de la matrix de tilemap (0,0) -> arriba izquierda
    next_direction -> por que lado sale del tile siguiente
*/

function Phantom(name, actual_tile_x, actual_tile_y, actual_direction, next_tile_x, next_tile_y, next_direction)
{
    this.name = name;
	this.speed = 2.0;
	this.state = PhantomState.SCATTER;// 1; //SCATTER


// valores x, y dentro del tile en el que están actualmente
	this.actual_tile_x = actual_tile_x;
	this.actual_tile_y = actual_tile_y;
    this.center_x = 8;
    this.center_y = 8;
	this.actual_direction = actual_direction;

    this.next_tile_x = next_tile_x;
    this.next_tile_y = next_tile_y;
	this.next_direction = next_direction;

    this.target_tile_x = 0
    this.target_tile_y = 0
    	// Loading spritesheet
    var fantasmas = new Texture("imgs/fantasmas.png");
    this.sprite;
	// Prepare pacman sprites & its animations
    var offset
    switch (name){
        case 'blinky':
            offset = 0;
            this.target_tile_x = 25
            this.target_tile_y = 0
            break;

        case 'pinky':
            offset = 1*32
            this.target_tile_x = 2
            this.target_tile_y = 0
            break;

        case 'inky':
            offset = 2*32
            this.target_tile_x = 25
            this.target_tile_y = 35
            break;

        case 'clyde':
            offset = 3*32
            this.target_tile_x = 2
            this.target_tile_y = 35
            break;
    };
    // x, y, width, height, fps, spritesheet)
    this.sprite = new Sprite(this.actual_tile_x*16+8, this.actual_tile_y*16+8, 32, 32, 16, fantasmas);    

    this.sprite.addAnimation();
    this.sprite.addKeyframe(PhantomDirection.LEFT, [64, 0+offset, 32, 32]);
    this.sprite.addKeyframe(PhantomDirection.LEFT, [96, 0+offset, 32, 32]);

    this.sprite.addAnimation();
    this.sprite.addKeyframe(PhantomDirection.RIGHT, [0,  0+offset, 32, 32]);
    this.sprite.addKeyframe(PhantomDirection.RIGHT, [32, 0+offset, 32, 32]);

    this.sprite.addAnimation();
    this.sprite.addKeyframe(PhantomDirection.UP, [128, 0+offset, 32, 32]);
    this.sprite.addKeyframe(PhantomDirection.UP, [160, 0+offset, 32, 32]);
    
    this.sprite.addAnimation();
    this.sprite.addKeyframe(PhantomDirection.DOWN, [192, 0+offset, 32, 32]);
    this.sprite.addKeyframe(PhantomDirection.DOWN, [224, 0+offset, 32, 32]);

    this.sprite.addAnimation(); //4
    this.sprite.addKeyframe(PhantomState.FRIGHTENED, [256,  0, 32, 32]);
    this.sprite.addKeyframe(PhantomState.FRIGHTENED, [288, 0, 32, 32]);

    this.sprite.addAnimation(); //5 es el parpadeo para cuando la animación va a terminar
    this.sprite.addKeyframe(5, [256, 0, 32, 32]);
    this.sprite.addKeyframe(5, [288, 0, 32, 32]);
    this.sprite.addKeyframe(5, [320, 0, 32, 32]);
    this.sprite.addKeyframe(5, [352, 0, 32, 32]);
}






Phantom.prototype.move = function ()
{
    if (this.actual_direction == "left"){
        if ((this.center_x - this.speed) < 0){
            this.actual_tile_x -= 1
            this.center_x = 15 - absolute(this.center_x - this.speed)
        }
    }


    
    
// center_x, center_y   —> entre 0 y 15
// actualizar actual_tile_x, next_tile_x y center_x a partir de speed, 

    this.sprite.x = this.actual_tile_x*16+this.center_x;
    this.sprite.y = this.actual_tile_y*16+this.center_y;

}

Phantom.prototype.calculate_next_tile = function ()
{

}