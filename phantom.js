const PhantomState = {
    FRIGHTENED: 4,
    SCATTER: 1,
    CHASE: 2,
};
const PhantomDirection = {
	LEFT: 0,
	RIGHT: 1, 
	UP: 2,
	DOWN: 3,
};
function Phantom(name, Xpos, Ypos, actual_direction, inside_box, dots_eaten_on_entry)
{
    this.inside_box = inside_box
    this.dots_eaten_on_entry = dots_eaten_on_entry
    this.name = name;
	this.speed = 0.0;
    this.acumulate_speed = 0.0;
	this.state = PhantomState.SCATTER;// 1; //SCATTER
    this.actual_direction = actual_direction;

    this.target_tile_x = 0
    this.target_tile_y = 0

    var fantasmas = new Texture("imgs/fantasmas.png");// Loading spritesheet

    // Prepare Phantom sprites & its animations
    var offset;
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

    if (is_scared){ // el fantasma se gira si no colisiona con un muro al girar
        switch (this.actual_direction){
            case 'left':
                if ( [0, 45, 46, 48].includes( tilemap.collisionRight(this.sprite) )  ){
                    this.actual_direction = 'right';
                };
                
                break;
            case 'right':
                if ( [0, 45, 46, 48].includes( tilemap.collisionLeft(this.sprite) )  ){
                    this.actual_direction = 'left';
                };
                break;
            case 'up':
                if ( [0, 45, 46, 48].includes( tilemap.collisionDown(this.sprite) )  ){
                    this.actual_direction = 'down';
                };
                break;
            case 'down':
                if ( [0, 45, 46, 48].includes( tilemap.collisionUp(this.sprite) )  ){
                    this.actual_direction = 'up';
                };
                break;
        };




    }
}








Phantom.prototype.supermove = function (deltaTime, tilemap, pacmanSprite, hardness_settings, level)
{

    var movimiento_pendiente = 0.0 // + Math.floor(this.speed + this.acumulate_speed);
    this.acumulate_speed = parseFloat( this.acumulate_speed.toFixed(3) );

    if ( isNaN(this.acumulate_speed) ){
        this.acumulate_speed = 0.0
    }


    // está en el tunel
    if ( (Math.floor(this.sprite.y /16) == 17) && (
            (Math.floor(this.sprite.x /16) <= 3) ||
            (Math.floor(this.sprite.x /16) >= 23) ) ){

            var tunel_speed = 2.0 * hardness_settings["ghost_tunel"][level-1] // In pixels per frame

            movimiento_pendiente = Math.floor(tunel_speed + this.acumulate_speed);

            this.acumulate_speed = parseFloat(tunel_speed + this.acumulate_speed) - Math.floor(tunel_speed + this.acumulate_speed);

    }
    else{  
        movimiento_pendiente = Math.floor(this.speed + this.acumulate_speed)
        this.acumulate_speed = (this.speed + this.acumulate_speed) - Math.floor(this.speed + this.acumulate_speed);
    }

    
    while ((0 < movimiento_pendiente)){

        // TELETRANSPORTE TUNEL
        if ((Math.floor(this.sprite.y /16) == 17) && (this.sprite.x == 16) && (this.actual_direction == 'left') ){ // OK
            this.sprite.x = 28*16-16;
        }
        else if ((Math.floor(this.sprite.y /16) == 17) && (this.sprite.x >= (26*16+8)) && (this.actual_direction == 'right')){
            this.sprite.x = 0+16;
        }


        // si está en 8, 8 -> busca ir por grietas
        if ( ( ((this.sprite.x%16) == 8) && ((this.sprite.y%16) == 8) )  ){
            var new_dir =this.obtener_nueva_direccion(this.actual_direction, tilemap);
            this.actual_direction = new_dir;

            if (this.state != PhantomState.FRIGHTENED){
                switch (this.actual_direction){
                    case 'left':
                        // this.sprite.x -= this.sprite.x % 16
                        this.sprite.setAnimation(0);
                        break;
                    case 'right':
                        this.sprite.setAnimation(1);
                        break;
                    case 'up':
                        this.sprite.setAnimation(2);
                        break;
                    case 'down':
                        this.sprite.setAnimation(3);
                        break;
                };
            }
            else{
                this.actual_direction = this.get_random_direction(this.actual_direction, tilemap);
            }


        }
           // prosigue en la direccion en la que no colisiona
        switch (this.actual_direction){
            case "left":
                this.sprite.x -= 1;
                break;
            case "right":
                this.sprite.x += 1;
                break;
            case "up":
                this.sprite.y -= 1;
                break;
            case "down":
                this.sprite.y += 1;
                break;
        };
        movimiento_pendiente -= 1;
        
    
    
    }
    this.sprite.update(deltaTime);

}

Phantom.prototype.obtener_nueva_direccion = function(old_dir, tilemap){
    
    var left_dist  = Math.abs (Math.sqrt(  Math.pow((Math.floor(this.sprite.x/16)-1 - this.target_tile_x), 2) + Math.pow((Math.floor(this.sprite.y/16) - this.target_tile_y), 2)  ));
    var right_dist = Math.abs (Math.sqrt(  Math.pow((Math.floor(this.sprite.x/16)+1 - this.target_tile_x), 2) + Math.pow((Math.floor(this.sprite.y/16) - this.target_tile_y), 2)  ));
    var up_dist    = Math.abs (Math.sqrt(  Math.pow((Math.floor(this.sprite.x/16) - this.target_tile_x), 2) + Math.pow((Math.floor(this.sprite.y/16)-1 - this.target_tile_y), 2)  ));
    var down_dist  = Math.abs (Math.sqrt(  Math.pow((Math.floor(this.sprite.x/16) - this.target_tile_x), 2) + Math.pow((Math.floor(this.sprite.y/16)+1 - this.target_tile_y), 2)  ));

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

        // orden -> up, left, down, right
        if( min_dist == up_dist){
            return "up";
        }
        else if( min_dist == left_dist){
            return "left";
        }
        else if( min_dist == down_dist){
            return "down";
        }
        else { // ( min_dist == right_dist)
            return "right";
        }
}


Phantom.prototype.set_new_state = function(new_state, tilemap, pacman_x, pacman_y, pacman_dir, blinky_x, blinky_y){
    if (this.state == PhantomState.FRIGHTENED){
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

    switch(new_state){
        case PhantomState.SCATTER:
            this.set_SCATTER(new_state, tilemap);
        break;

        case PhantomState.CHASE:
            this.set_CHASE(new_state, tilemap, pacman_x, pacman_y, pacman_dir, blinky_x, blinky_y);

        break;
        case PhantomState.FRIGHTENED:
            this.set_FRIGHTENED(new_state, tilemap);
        break;
    };

};

Phantom.prototype.set_FRIGHTENED = function(new_state, tilemap){
    this.state = new_state;
    this.sprite.setAnimation(4);
    switch (this.name){
        case 'blinky':
            this.set_target_tile(25, 0, true, tilemap);
            break;

        case 'pinky':
            this.set_target_tile(2, 0, true, tilemap);
            break;

        case 'inky':
            this.set_target_tile(25, 35, true, tilemap);
            break;

        case 'clyde':
            this.set_target_tile(2, 35, true, tilemap);
            break;
    };
}

Phantom.prototype.set_SCATTER = function(new_state, tilemap){
    this.state = new_state;
    switch (this.name){
        case 'blinky':
            this.set_target_tile(25, 0, false, tilemap);
            break;

        case 'pinky':
            this.set_target_tile(2, 0, false, tilemap);
            break;

        case 'inky':
            this.set_target_tile(25, 35, false, tilemap);
            break;

        case 'clyde':
            this.set_target_tile(2, 35, false, tilemap);
            break;
    };
}


/*
	No puede pararse ni dar la vuelta
	fantasmas -> estados: 
		FRIGHTENED,	# ASUSTADOS DE PACMAN
		SCATTER,	# pasa a CHASE cuando pacman come cierta cantidad de puntos
			# hay un tile fuera del mapa que será su target_tile
		CHASE		# Difiere del fantasma
			Blinky rojo -> target_tile = donde esta Pacman
			Pinky rosa -> target_tile = 4 tiles delante de la dirección de Pacman
			Inky -> mira un tile 2 veces delante de la posición a la que mira Pacman e invierte la Posición de Blinky
			Clyde naranja -> Sí pacman está a 8 tiles o menos, Pasa a Chase. Sino, va a por pacman como Blinki
	estado determina el target_tile
	Cuando entra a un tile_A, sabe a que tile_B irá, y la Dirección a la que irá para entrar al tile_C


	velocidad de los fantasmas -> número entero: 2

	En elección de caminos cuando hay empate en distancia a target tile: orden Up, left, 
	No van hacia atras

*/

Phantom.prototype.set_CHASE = function(new_state, tilemap, pacman_x, pacman_y, pacman_dir, blinky_x, blinky_y){
    this.state = new_state;
    switch (this.name){
        case 'blinky': //hecho
            this.set_target_tile(pacman_x, pacman_y, false, tilemap);
            break;

        case 'pinky': //hecho
            var x = pacman_x;
            var y = pacman_y;
            switch (pacman_dir){
                case "left":
                    x = Math.max(0, pacman_x-4)
                    break;
                case "right":
                    x = Math.min(28, pacman_x+4)
                    break;
                case "up":
                    y = Math.max(0, pacman_y-4)
                    break;
                case "down":
                    y = Math.min(31, pacman_y+4)
                    break;
            }
            this.set_target_tile(x, y, false, tilemap);
            break;

        case 'inky':
            
            var result = this.inky_target( pacman_x, pacman_y, pacman_dir, blinky_x, blinky_y);
            this.set_target_tile(result.x, result.y, false, tilemap);
            break;

        case 'clyde': // hecho
            var clyde_x =  Math.floor(this.sprite.x/16);
            var clyde_y =  Math.floor(this.sprite.x/16);
            if( (Math.abs(pacman_x -clyde_x) + Math.abs(pacman_y -clyde_y)) > 8){
                // a más de 8 tiles de pacman, va a por el
                this.set_target_tile(pacman_x, pacman_y, false, tilemap);
            }
            else{
                this.set_SCATTER(PhantomState.SCATTER, tilemap);
            }
            break;
    };
}




Phantom.prototype.inky_target = function(pacman_x, pacman_y, pacman_dir, blinky_x, blinky_y) {
    var target_x = pacman_x;
    var target_y = pacman_y;
    switch (pacman_dir){
        case "left":
            target_x -= 2;
            break;
        case "right":
            target_x += 2;
            break;
        case "up":
            target_y -= 2;
            break;
        case "down":
            target_y += 2;
            break;
    }
    var diferencia_x = target_x - blinky_x;
    var diferencia_y = target_y - blinky_y;
    var final_x = target_x + diferencia_x;
    var final_y = target_y + diferencia_y;

    final_x = Math.max(0, final_x);
    final_y = Math.max(0, final_y);
    final_x = Math.min(final_x, 28);
    final_y = Math.min(final_y, 31);
    return {x : final_x, y: final_y};
  }



  

Phantom.prototype.set_animation_twinkle = function() {
    this.sprite.setAnimation(5);     //5 es el parpadeo para cuando la animación va a terminar
}

// Get random valid direction
Phantom.prototype.get_random_direction = function(old_dir, tilemap){
    
    var dir_list = ['left', 'right', 'up', 'down']



    switch (old_dir){ //evita el retroceso
        case 'left':
            dir_list = dir_list.filter(dir => dir != 'right');
            break;
        case 'right':
            dir_list = dir_list.filter(dir => dir != 'left');
            break;
        case 'up':
            dir_list = dir_list.filter(dir => dir != 'down');
            break;
        case 'down':
            dir_list = dir_list.filter(dir => dir != 'up');
            break;
    };
    // left
    if ( ! [0, 45, 46, 48].includes( tilemap.collisionLeft(this.sprite) )  ){
        dir_list = dir_list.filter(dir => dir != 'left');
    };
    // right
    if ( ! [0, 45, 46, 48].includes( tilemap.collisionRight(this.sprite) )  ){
        dir_list = dir_list.filter(dir => dir != 'right');
    };
    // up
    if ( ! [0, 45, 46, 48].includes( tilemap.collisionUp(this.sprite) )  ){
        dir_list = dir_list.filter(dir => dir != 'up');
    };
    // down
    if ( ! [0, 45, 46, 48].includes( tilemap.collisionDown(this.sprite) )  ){
        dir_list = dir_list.filter(dir => dir != 'down');
    };
  
        
    if (this.name == 'blinky'){
        //console.log("NEWWW", dir_list, old_dir)
    }

    var result = dir_list[Math.floor(Math.random() * dir_list.length)];
    return result
}