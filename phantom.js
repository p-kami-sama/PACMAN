
/*
    actual_tile_x, actual_tile_y -> de la matrix de tilemap (0,0) -> arriba izquierda
    center_x, center_y -> centro del fantasma en el tile actual
    actual_direction -> por que lado sale del tile actual

    next_tile_x, next_tile_y -> de la matrix de tilemap (0,0) -> arriba izquierda
    next_direction -> por que lado sale del tile siguiente

    NOTA -> restar 3 a actual_tile_y, next_tile_y para cualquier consulta en el vector del TileMap,
        dado que marcan las posiciones del marco entero
*/

function Phantom(name, actual_tile_x, actual_tile_y, actual_tile_out_direction, actual_direction, next_tile_x, next_tile_y, next_tile_out_direction)
{
    this.name = name;
	this.speed = 2.0;
	this.state = PhantomState.SCATTER;// 1; //SCATTER


// valores x, y dentro del tile en el que están actualmente
    this.actual_direction = actual_direction;

	this.actual_tile_x = actual_tile_x;
	this.actual_tile_y = actual_tile_y;
    this.center_x = 8;
    this.center_y = 8;
    this.actual_tile_out_direction = actual_tile_out_direction;

    this.next_tile_x = next_tile_x;
    this.next_tile_y = next_tile_y;
    this.next_tile_out_direction = next_tile_out_direction;

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



    // actualiza la animacian actual a la correcta
    switch (this.actual_direction){
        case 'left':
            this.sprite.setAnimation(0)
            break;
        case 'right':
            this.sprite.setAnimation(1)
            break;
        case 'up':
            this.sprite.setAnimation(2)
            break;
        case 'down':
            this.sprite.setAnimation(3)
            break;
    };

    
}


Phantom.prototype.set_target_tile = function (x, y, is_scared=false)
{
    this.target_tile_x = x;
    this.target_tile_y = y;
    this.recalculate_mov_to_target_tile(is_scared)
}

//  FALTA ESTO
Phantom.prototype.recalculate_mov_to_target_tile = function (is_scared)
{

    if (is_scared){
        // será cuando pacman se haya comido power pellet y haya de cambiarse todos los movimientos
    }
    else{

        /*  
//  CALCULA LOS NUEVOS VALORES DE ->
        this.next_tile_x
        this.next_tile_y
	    this.next_direction_out_direction
*/
    }
}


Phantom.prototype.move = function (deltaTime)
{
/*
	this.actual_tile_x, this.actual_tile_y
    this.center_x, this.center_y  ->  entre 0 y 15
    this.actual_tile_out_direction
	this.actual_direction

    this.next_tile_x, this.next_tile_y
	this.next_direction_out_direction
*/
    var movimiento_pendiente = this.speed;

    while ((0 < movimiento_pendiente)){
        //comprobar si se sale del tile
        if (this.actual_direction != this.actual_tile_out_direction){
            // va al centro del tile, gira, y luego -> this.actual_direction = this.actual_tile_out_direction
            switch (this.actual_direction){
                case "left":
                    this.center_x -= 1
                    break;
                case "right":
                    this.center_x += 1
                    break;
                case "up":
                    this.center_y -= 1
                    break;
                case "down":
                    this.center_y += 1
                    break;
            }; 
            if ((this.center_x == 8) && (this.center_y == 8)){
                this.actual_direction = this.actual_tile_out_direction;
                // actualiza la animacian actual a la correcta
                switch (this.actual_direction){
                    case 'left':
                        this.sprite.setAnimation(0)
                        break;
                    case 'right':
                        this.sprite.setAnimation(1)
                        break;
                    case 'up':
                        this.sprite.setAnimation(2)
                        break;
                    case 'down':
                        this.sprite.setAnimation(3)
                        break;
                };
            }
        }
        else{ // this.actual_direction == this.actual_tile_out_direction
            if (this.actual_direction == "left" && this.center_x == 0){
                this.update_tile_location(15, this.center_y)
            }
            else if (this.actual_direction == "right" && this.center_x == 15){
                this.update_tile_location(0, this.center_y)
            }
            else if (this.actual_direction == "up" && this.center_y == 0){
                this.update_tile_location(this.center_x, 15)
            }
            else if (this.actual_direction == "down" && this.center_y == 15){
                this.update_tile_location(this.center_x, 0)
            }
            else{
                switch (this.actual_direction){
                    case "left":
                        this.center_x -= 1
                        break;
                    case "right":
                        this.center_x += 1
                        break;
                    case "up":
                        this.center_y -= 1
                        break;
                    case "down":
                        this.center_y += 1
                        break;
                };
            }
        }


        movimiento_pendiente -= 1;
    }


    // acercarse al centro
//    this.actual_direction == "left" && 8 < this.center_x;

    

    // if (this.actual_direction == "left"){
    //     if ((this.center_x - this.speed) < 0){
    //         this.actual_tile_x -= 1
    //         this.center_x = 15 - absolute(this.center_x - this.speed)
    //     }
    // }



    this.sprite.x = this.actual_tile_x*16+this.center_x;
    this.sprite.y = this.actual_tile_y*16+this.center_y;

    this.sprite.update(deltaTime);

}
// Se llama cuando se pasa del Tile actual al siguiente tile que se tenía como objetivo a seguir
Phantom.prototype.update_tile_location = function (new_center_x, new_center_y)
{
    this.center_x = new_center_x;
    this.center_y = new_center_y;

    this.actual_tile_x = this.next_tile_x;
    this.actual_tile_y = this.next_tile_y;
    this.actual_tile_out_direction = this.next_direction_out_direction;

    //ACABAR

/*
	this.actual_tile_x, this.actual_tile_y
    this.center_x, this.center_y  ->  entre 0 y 15
    this.actual_tile_out_direction
	this.actual_direction

    this.next_tile_x, this.next_tile_y
	this.next_direction_out_direction
*/  
    
    this.recalculate_mov_to_target_tile(false)
}
