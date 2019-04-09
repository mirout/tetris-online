function Figure() {
	this.figure = new Array();
	for (let i = 0; i < 4; i++) {
		this.figure[i] = new Array();
		for (let j = 0; j < 4; j++) {
			this.figure[i][j] = 0;
		}
	}


	this.x = 0;
	this.y = 0;
	var numberFigure = Math.floor(Math.random() * (8 - 1) + 1);
	var colorFigure = Math.floor(Math.random() * (5 - 1) + 1);
	if (numberFigure === 1) {
		this.figure = createFigureOne(this.figure, colorFigure);
		this.x = 4;
	} else if (numberFigure === 2) {
		this.figure = createFigureTwo(this.figure, colorFigure);
		this.x = 4;
	} else if (numberFigure === 3) {
		this.figure = createFigureThree(this.figure, colorFigure);
		this.x = 4;
	} else if (numberFigure === 4) {
		this.figure = createFigureFour(this.figure, colorFigure);
		this.x = 4;
	} else if (numberFigure === 5) {
		this.figure = createFigureFive(this.figure, colorFigure);
		this.x = 4;
	} else if (numberFigure === 6) {
		this.figure = createFigureSix(this.figure, colorFigure);
		this.x = 4;
	} else if (numberFigure === 7) {
		this.figure = createFigureSeven(this.figure, colorFigure);
		this.x = 4;
	}

	this.draw = function (xField, yField, sizeBlock) { //xField && yField - положение на оси x, y на поле sizeBlock размер блока
    	for (let i = 0; i < this.figure.length; i++) {
    		for (let j = 0; j < this.figure[i].length; j++) {
    			if (this.figure[i][j] != 0) {
    				brush.drawRect({
						x : xField+this.x*sizeBlock+j*sizeBlock, y : yField+this.y*sizeBlock+i*sizeBlock,
						w : sizeBlock, h : sizeBlock,
						fillColor :  colorsForFigure[this.figure[i][j]-1],
						strokeColor : "#474e4d",
						strokeWidth : 1
					});
    			}
    		}
    	}
  	}

	this.moveDown = function() {
		this.y+=1;
	}
	this.moveRight = function () {
		this.x+=1;
	}
	this.moveLeft = function () {
		this.x-=1;
	}

	function createFigureOne(figure, color) {
  		figure[0][0] = color;
		figure[1][0] = color;
		figure[1][1] = color;
		figure[0][1] = color;
  		return figure;
  	}
  	function createFigureTwo(figure, color) {
  		figure[0][0] = color;
		figure[1][0] = color;
		figure[1][1] = color;
		figure[2][1] = color;
  		return figure;
  	}
  	function createFigureThree(figure, color) {
  		figure[0][0] = color;
		figure[0][1] = color;
		figure[0][2] = color;
		figure[1][2] = color;
  		return figure;
  	}
  	function createFigureFour(figure, color) {
  		figure[0][0] = color;
		figure[0][1] = color;
		figure[0][2] = color;
		figure[0][3] = color;
  		return figure;
  	}
  	function createFigureFive(figure, color) {
  		figure[0][1] = color;
		figure[1][1] = color;
		figure[1][0] = color;
		figure[2][0] = color;
  		return figure;
  	}
  	function createFigureSix(figure, color) {
  		figure[0][0] = color;
		figure[0][1] = color;
		figure[0][2] = color;
		figure[1][0] = color;
  		return figure;
  	}
  	function createFigureSeven(figure, color) {
  		figure[0][0] = color;
		figure[0][1] = color;
		figure[0][2] = color;
		figure[1][1] = color;
  		return figure;
  	}

	this.turn = function() {
		var figureUpdate  = new Array();
		for (let i = 0; i < 4; i++) {
			figureUpdate[i] = new Array();
			for (let j = 0; j < 4; j++) {
				figureUpdate[i][j] = 0;
			}
		}
		for (let i = 0; i < this.figure.length; i++) {
    		for (let j = 0; j < this.figure[i].length; j++) {
				if (this.figure[i][j]!=0){
					figureUpdate[j][3-i] = this.figure[i][j];
				}
			}
		}
		for (let i = 0; i < this.figure.length;i++){
			if (figureUpdate[0][0]==0 && figureUpdate[1][0]==0 && figureUpdate[2][0]==0 && figureUpdate[3][0]==0){
				for (let k = 0; k < this.figure.length;k++){
					for (let j = 0; j < this.figure.length-1;j++){
						figureUpdate[k][j]=figureUpdate[k][j+1];
					}
				}
				figureUpdate[0][3]=0;
				figureUpdate[1][3]=0;
				figureUpdate[2][3]=0;
				figureUpdate[3][3]=0;
			}
		}
   		this.figure = figureUpdate;
	}
}
