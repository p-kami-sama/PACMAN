
// Tilemap. Draws a tilemap using a texture as a tilesheet.

function Tilemap(tilesheet, tileSize, blockGrid, basePos, map)
{
	this.tileSize = tileSize;
	this.basePos = basePos;
	this.blockGrid = blockGrid;
	this.map = map

	this.tilesheet = tilesheet;
}

Tilemap.prototype.draw = function ()
{
	// Only draw if tilesheet texture already loaded
	if(!this.tilesheet.isLoaded())
		return;
		
	// Size of each block in pixels
	blockSize = [this.tilesheet.width() / this.blockGrid[0], this.tilesheet.height() / this.blockGrid[1]];
	
	// Compute block positions in tilesheet
	var tilePositions = [];
	for(var y=0, tileId=0; y<this.blockGrid[1]; y++)
		for(var x=0; x<this.blockGrid[0]; x++, tileId++)
			tilePositions.push([x * blockSize[0], y * blockSize[1]]);
			
	// Get canvas object, then its context
	var canvas = document.getElementById("game-layer");
	var context = canvas.getContext("2d");

	// Draw the map
	var tileId;
	context.imageSmoothingEnabled = false;
	for(var j=0, pos=0; j<this.map.height; j++)
		for(var i=0; i<this.map.width; i++, pos++)
		{
			tileId = this.map.layers[0].data[pos];
			if(tileId != 0)
				context.drawImage(this.tilesheet.img, tilePositions[tileId-1][0], tilePositions[tileId-1][1], blockSize[0], blockSize[1], 
				                  this.basePos[0] + this.tileSize[0] * i, this.basePos[1] + this.tileSize[1] * j, blockSize[0], blockSize[1]);
		}
}
//Devuelve el id del tile con el que colisiona
Tilemap.prototype.collisionLeft = function(sprite)
{
	var x = Math.floor((sprite.x - this.basePos[0] + sprite.box.min[0]) / this.tileSize[0]);
	var y = Math.floor((sprite.y - this.basePos[1] + (sprite.box.min[1] + sprite.box.max[1]) / 2) / this.tileSize[1]);
	
	return tileId = this.map.layers[0].data[y * this.map.width + x];
}

Tilemap.prototype.collisionRight = function(sprite)
{
	var x = Math.floor((sprite.x - this.basePos[0] + sprite.box.max[0]) / this.tileSize[0]);
	var y = Math.floor((sprite.y - this.basePos[1] + (sprite.box.min[1] + sprite.box.max[1]) / 2) / this.tileSize[1]);
	
	return tileId = this.map.layers[0].data[y * this.map.width + x];
}

Tilemap.prototype.collisionUp = function(sprite)
{
	var x = Math.floor((sprite.x - this.basePos[0] + (sprite.box.min[0] + sprite.box.max[0]) / 2) / this.tileSize[0]);
	var y = Math.floor((sprite.y - this.basePos[1] + sprite.box.min[1]) / this.tileSize[1]);

	return tileId = this.map.layers[0].data[y * this.map.width + x];
}

Tilemap.prototype.collisionDown = function(sprite)
{
	var x = Math.floor((sprite.x - this.basePos[0] + (sprite.box.min[0] + sprite.box.max[0]) / 2) / this.tileSize[0]);
	var y = Math.floor((sprite.y - this.basePos[1] + sprite.box.max[1]) / this.tileSize[1]);
	
	return tileId = this.map.layers[0].data[y * this.map.width + x];
}
