function Field() {
	/*Работа с полем*/
	this.field = new Array();
	for (var i = 0; i < 23; i++) {
		this.field[i] = new Array();
		for (var j = 0; j < 12; j++) {
			this.field[i][j] = 0;
		}
	}
	for (let i = 0; i < this.field.length; i++) {
		this.field[i][0] = 1111;
		this.field[i][11] = 1111;
	}
	for (let i = 0; i < this.field[1].length; i++) {
		this.field[22][i] = 1111;
	}
	this.flagGameOver = false
	this.dynamicFigure = false;
	this.nextFigure = new Figure();

	this.draw = function (x, y, h) { //x - положение по оси x, y - положение по оси y, h - высота поля
		var sizeBlock = h/20;
		for (let i = 2; i < this.field.length-1; i++) {
			for (let j = 1; j < this.field[i].length-1; j++) {
				if (this.field[i][j]==0){
					brush.drawRect({
						x : x+j*sizeBlock, y : y+(i-2)*sizeBlock,
						w : sizeBlock, h : sizeBlock,
						fillColor : "#10151c",
						strokeColor : "#474e4d",
						strokeWidth : 1
					});
				} else if (this.field[i][j]!=0){
					brush.drawRect({
						x : x+j*sizeBlock, y : y+(i-2)*sizeBlock,
						w : sizeBlock, h : sizeBlock,
						fillColor :  colorsForFigure[this.field[i][j]-1],
						strokeColor : "#474e4d",
						strokeWidth : 1
					});
				}
			}
		}
		if (!this.dynamicFigure) {
			if (this.possibleAddFigure(this.nextFigure.figure, this.field)) {
				console.log(1)
				this.figure = this.nextFigure;
				this.nextFigure = new Figure();
				//console.log(this.figure, this.nextFigure)
				this.dynamicFigure = true;
				var figure = this.figure;
				lastMove = false;
				lastTimer = false;
				this.moveFigureTimer = OOP.newTimer(1000, function () {
					if (lastTimer) {
						lastMove = true;
					} else {
						figure.moveDown();
					}
				});
				this.moveFigureTimer.start();
			} else {
				this.gameOver()
			}
		}
		try {
			this.figure.draw(x+sizeBlock, y, sizeBlock);
			if (this.checkPossibleMoveDown()){
				this.moveFigureTimer.restart();
			} else if (lastMove) {
				this.addFigureOnField();
				this.searchFullLineAndDelete();
				this.dynamicFigure = false;
				lastTimer = false;
			} else {
				lastTimer = true;
				this.moveFigureTimer.restart();
			}
		} catch (err) {console.log(err)}
	}

	this.possibleAddFigure = function(figure, field) {
		//console.log(figure,figure.length, figure.length)

		for (let i = 0; i < figure.length; i++) {
			for (let j = 0; j < figure[i].length; j++) {
				//console.log(figure[i][j],field[i+2][j+5],i,j)
				if (figure[i][j]!=0 && field[i+2][j+5]!=0) {
					return false
				}
			}
		}
		return true
	}
	this.gameOver = function() {
		this.flagGameOver = true
	}
	/*------Check on Move------*/
	/*Проверка происходит проходом по фигуре и проверка элементов на поле */
	this.checkPossibleMoveLeft = function () {
		for (let i = 0; i<this.figure.figure.length; i++) {
			for (let j = 0; j<this.figure.figure[i].length; j++) {
				if (this.figure.figure[i][j]) {
					if (this.field[2+this.figure.y+i][1+this.figure.x+(j-1)]) { // +2 из-за того что создан барьер из двух клеток
						return false;
					}
				}
			}
		}
		return true;
	}
	this.checkPossibleMoveRight = function () {
		for (let i = this.figure.figure.length-1; i>=0; i--) {
			for (let j = this.figure.figure[i].length-1; j>=0; j--) {
				if (this.figure.figure[i][j]) {
					if (this.field[2+this.figure.y+i][1+this.figure.x+(j+1)]) { // +2 из-за того что создан барьер из двух клеток
						return false;
					}
				}
			}
		}
		return true;
	}
	this.checkPossibleMoveDown = function() {
		for (let i = this.figure.figure.length-1; i>=0; i--) {
			for (let j = this.figure.figure[i].length-1; j>=0; j--) {
				if (this.figure.figure[i][j]) {
					if (this.field[2+this.figure.y+(i+1)][1+this.figure.x+j]){
						return false;
					}
				}
			}
		}
		return true;
	}

	this.checkPossibleTurn = function() {
		figure = new Figure();
		figure.figure = this.figure.figure;
		figure.x = this.figure.x;
		figure.y = this.figure.y;
		figure.turn();
		for (let i = 0; i<figure.figure.length;i++) {
			for (let j = 0; j<figure.figure.length;j++) {
				if (this.field[2+i+figure.y][1+j+figure.x]!=0 && figure.figure[i][j]) {
					return false;
				}
			}
		}
		return true;
	}
	/*Добавление фигуры на поле*/
	this.addFigureOnField = function() {
		for (let i = 0; i<this.figure.figure.length; i++) {
			for (let j = 0; j<this.figure.figure[i].length; j++) {
				if (this.figure.figure[i][j]) {
					this.field[2+this.figure.y+i][1+this.figure.x+j] = this.figure.figure[i][j];
				}
			}
		}
	}
	this.searchFullLineAndDelete = function() {
		var count = 0;
		for (let i = 2; i < this.field.length-1; i++) {
			for (let j = 1; j < this.field[i].length-1; j++) {
				if (this.field[i][j] != 0) {
					count+=1;
				}
				if (count == 10){
					for (let k = i; k >= 0; k--) {
						if (this.field[k-1] === undefined) {
							this.field[k] = new Array();
							for (let j = 0; j < 12; j++) {
								this.field[k][j] = 0;
							}
							this.field[k][0] = 1111
							this.field[k][11] =  1111
						} else {
							this.field[k] = this.field[k-1]
						}
					}
					count = 0;
					score+=100;
				}
			}
			count = 0;
		}
	}
}
