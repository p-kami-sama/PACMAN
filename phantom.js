


// function Phantom(name, actual_tile_x, actual_tile_y, actual_tile_out_direction, actual_direction, next_tile_x, next_tile_y, next_tile_out_direction)
function Phantom(name, Xpos, Ypos, actual_direction)

{
    this.name = name;
	this.speed = 2.0;
	this.state = PhantomState.SCATTER;// 1; //SCATTER
    this.actual_direction = actual_direction;


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
    this.sprite = new Sprite(Xpos, Ypos, 32, 32, 16, fantasmas);

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


Phantom.prototype.set_target_tile = function (x, y, is_scared=false, tilemap)
{
    this.target_tile_x = x;
    this.target_tile_y = y;
    this.recalculate_mov_to_target_tile(is_scared, tilemap)
}


Phantom.prototype.recalculate_mov_to_target_tile = function (is_scared=false, tilemap){
    
}












Phantom.prototype.supermove = function (deltaTime, tilemap)
{
    var movimiento_pendiente = Math.floor(this.speed);
    while ((0 < movimiento_pendiente)){
        var colisiona = false;
        switch (this.actual_direction){ //se comprueba si colisiona por la dirección en que se mueve
            case 'left':
                var id = tilemap.collisionLeft(this.sprite);
                if ( ![0, 45, 46, 48].includes(id) ){
                    colisiona = true;
                }
                break;
            case 'right':
                var id = tilemap.collisionRight(this.sprite);
                if ( ![0, 45, 46, 48].includes(id) ){
                    colisiona = true;
                }
                break;
            case 'up':
                var id = tilemap.collisionUp(this.sprite);
                if ( ![0, 45, 46, 48].includes(id) ){
                    colisiona = true;
                }
                break;
            case 'down':
                var id = tilemap.collisionDown(this.sprite);
                if ( ![0, 45, 46, 48].includes(id) ){
                    colisiona = true;
                }
                break;
        };

        // si colisiona o está en 8, 8 -> busca ir por grietas
        if (colisiona || ( ((this.sprite.x%16) == 0) && ((this.sprite.y%16) == 0) ) ){
            var new_dir =this.obtener_nueva_direccion(this.actual_direction, tilemap);
            this.actual_direction = new_dir;

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
            colisiona = false;


        }
           // prosigue en la direccion en la que no solisiona
        switch (this.actual_direction){
            case "left":
                // this.center_x -= 1;
                this.sprite.x -= 1;
                break;
            case "right":
                // this.center_x += 1;
                this.sprite.x += 1;
                break;
            case "up":
                // this.center_y -= 1;
                this.sprite.y -= 1;
                break;
            case "down":
                // this.center_y += 1;
                this.sprite.y += 1;
                break;
        };
        movimiento_pendiente -= 1;
        

    
    }


    console.log('-----------------------')
    console.log("Colisiona:", colisiona)
    console.log("X", this.sprite.x, "Y", this.sprite.y, "direccion", this.actual_direction);

    this.sprite.update(deltaTime);
}

Phantom.prototype.obtener_nueva_direccion = function(old_dir, tilemap){

    console.log("SE LLAMA A obtener_nueva_direccion")
    var left_dist  = Math.abs( Math.floor(this.sprite.x/16)-1 - this.target_tile_x );
    var right_dist = Math.abs( Math.floor(this.sprite.x/16)+1 - this.target_tile_x );
    var up_dist    = Math.abs( Math.floor(this.sprite.y/16)-1 - this.target_tile_y );
    var down_dist  = Math.abs( Math.floor(this.sprite.y/16)+1 - this.target_tile_y );
    
    console.log(old_dir, left_dist, right_dist, up_dist, down_dist);
    switch (old_dir){ //evita el retroceso
        case 'left':
            right_dist = Infinity;
            break;
        case 'right':
            left_dist = Infinity;
            break;
        case 'up':
            down_dist = Infinity;
            break;
        case 'down':
            up_dist = Infinity;
            break;
    };
    console.log(old_dir, left_dist, right_dist, up_dist, down_dist);
        // left
        if ( ! [0, 45, 46, 48].includes( tilemap.collisionLeft(this.sprite) )  ){
            left_dist = Infinity;
        };
        // right
        if ( ! [0, 45, 46, 48].includes( tilemap.collisionRight(this.sprite) )  ){
            right_dist = Infinity;
        };
        // up
        if ( ! [0, 45, 46, 48].includes( tilemap.collisionUp(this.sprite) )  ){
            up_dist = Infinity;
        };
        // down
        if ( ! [0, 45, 46, 48].includes( tilemap.collisionDown(this.sprite) )  ){
            down_dist = Infinity;
        };
  

        var min_dist = Math.min(left_dist, right_dist, up_dist, down_dist);

        console.log("old_dir:", old_dir, left_dist, right_dist, up_dist, down_dist, "min_dist:", min_dist);

        // orden -> up, left, down, right
        if( min_dist == up_dist){
            console.log("new_dir:", "up");
            return "up";
        }
        else if( min_dist == left_dist){
            console.log("new_dir:", "left");
            return "left";
        }
        else if( min_dist == down_dist){
            console.log("new_dir:", "down");
            return "down";
        }
        else { // ( min_dist == right_dist)
            console.log("new_dir:", "right");
            return "right";
        }

}