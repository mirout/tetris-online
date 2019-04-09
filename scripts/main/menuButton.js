function MenuButton(x,y) {
	this.x = x;
	this.y = y
	this.rect1 = game.newRoundRectObject({
 		x: this.x, y: this.y,
		w : 50,
		h : 10,
		fillColor : "#FFF",
		strokeColor : "#000",
		strokeWidth : 1,
	});
	this.rect2 = game.newRoundRectObject({
 		x: this.x, y: this.y+15,
		w : 50,
		h : 10,
		fillColor : "#FFF",
		strokeColor : "#000",
		strokeWidth : 1,
	});
	this.rect3 = game.newRoundRectObject({
 		x: this.x, y: this.y+30,
		w : 50,
		h : 10,
		fillColor : "#FFF",
		strokeColor : "#000",
		strokeWidth : 1,
	});
	this.draw = function(){
		this.rect1.draw();
		this.rect2.draw();
		this.rect3.draw();
	}
	this.isPress = function() {
		if (mouse.getPosition().x<this.x+50 && mouse.getPosition().x>this.x && mouse.getPosition().y<this.y+40 && mouse.getPosition().y>this.y) {
			return(true);
		} else {
			return(false);
		}
	}
}
