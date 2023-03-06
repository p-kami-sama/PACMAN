
// Image. Draws an image without any animation

function StaticImage(x, y, width, height, texture)
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	
	this.texture = texture;
}


// Draw Image

StaticImage.prototype.draw = function ()
{
	// Get canvas object, then its context
	var canvas = document.getElementById("game-layer");
	var context = canvas.getContext("2d");
	
	// Draw Image
	context.imageSmoothingEnabled = false;
	context.drawImage(this.texture.img, 0, 0, this.texture.width(), this.texture.height(), this.x, this.y, this.width, this.height);
}


