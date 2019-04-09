function Field(main) {
	/*Работа с полем*/
	this.main = main
	this.field = new Array();
	for (var i = 0; i < 23; i++) {
		this.field[i] = new Array();
		for (var j = 0; j < 10; j++) {
			this.field[i][j] = 0;
		}
	}
	for (let i = 0; i < this.field.length; i++) {
		this.field[i][0] = 1111;
		this.field[i][9] = 1111;
	}
	for (let i = 0; i < this.field[1].length; i++) {
		this.field[22][i] = 1111;
	}
	this.flagGameOver = false
	this.dynamicFigure = false;
	this.nextFigure = new Figure();
	/*Единица это ноль на поле Двойка это единица на поле*/
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
						fillColor :  "white",
						strokeColor : "#474e4d",
						strokeWidth : 1
					});
					if (this.field[i][j]==1){
						brush.drawText({
							x:x+j*sizeBlock+sizeBlock/4, y:y+(i-2)*sizeBlock,
							text:"0",
							color: "black",
							size: sizeBlock
						});
					} else if (this.field[i][j]==2){
						brush.drawText({
							x:x+j*sizeBlock+sizeBlock/4, y:y+(i-2)*sizeBlock,
							text:"1",
							color: "black",
							size: sizeBlock
						});
					}
				}
			}
		}

		for (let i = 1;i<this.field[1].length-1;i++){
			if (2**((this.field[1].length-2)-i)/10>10){
				brush.drawText({
					x:x+i*sizeBlock+sizeBlock/6, y:y+20*sizeBlock,
					text:2**((this.field[1].length-2)-i),
					color: "#AAA",
					size: sizeBlock/2
				});
			} else if (2**((this.field[1].length-2)-i)/10<1) {
				brush.drawText({
					x:x+i*sizeBlock+sizeBlock/3, y:y+20*sizeBlock,
					text:2**((this.field[1].length-2)-i),
					color: "#AAA",
					size: sizeBlock/2
				});
			} else {
				brush.drawText({
					x:x+i*sizeBlock+sizeBlock/4, y:y+20*sizeBlock,
					text:2**((this.field[1].length-2)-i),
					color: "#AAA",
					size: sizeBlock/2
				});
			}
		}

		if (!this.dynamicFigure) {
			if (this.possibleAddFigure(this.nextFigure.figure, this.field)) {
				this.figure = this.nextFigure;
				this.nextFigure = new Figure();
				//console.log(this.figure, this.nextFigure)
				this.dynamicFigure = true;
				var figure = this.figure;
				lastMove = false;
				lastTimer = false;
				this.moveFigureTimer = OOP.newTimer(1500, function () {
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
				this.searchFullLine();
				this.dynamicFigure = false;
				lastTimer = false;
			} else {
				lastTimer = true;
				this.moveFigureTimer.restart();
			}
		} catch (err) {}
		for (i in fullLine){
			if (this.main){
				brush.drawRect({
					x : x+12*sizeBlock, y : y+(i-2)*sizeBlock,
					w : 2*sizeBlock, h : sizeBlock,
					fillColor :  "white",
					strokeColor : "#474e4d",
					strokeWidth : 1
				});
				brush.drawText({
					x: x+12*sizeBlock, y : y+(i-2)*sizeBlock,
					text: rectScore[i],
					color: "black",
					size: sizeBlock
				});
				if (mouse.getPosition().x > x+12*sizeBlock && mouse.getPosition().x<x+12*sizeBlock+2*sizeBlock && mouse.getPosition().y<y+(i-2)*sizeBlock+sizeBlock&& mouse.getPosition().y>y+(i-2)*sizeBlock && mouse.isPress("LEFT")) {
					rectNow = i
				}
			}
			for (var key in fullLine) {
  				if (fullLine[key]==rectScore[key] && !this.flagGameOver){
  					this.deleteLine(key)
  				}
			}
		}
		if (this.main){
			this.searchFullLine();
		}

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
				if (this.figure.figure[i][j] && (!i || !this.figure.figure[i-1][j])) {
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

	this.searchFullLine = function() {
		var count = 0;
		for (let i = 2; i < this.field.length-1; i++) {
			for (let j = 1; j < this.field[i].length-1; j++) {
				if (this.field[i][j] != 0) {
					count+=1;
				}
				if (count == 8){
					var bin = ""
					for (let k = 1; k < this.field[i].length-1; k++) {
						bin+=this.field[i][k]
					}
					fullLine[i] = toDecimal(bin)
					if (rectScore[i]==null){
						rectScore[i] =  ""
					}
					console.log(fullLine)
				}
			}
			count = 0;
		}
	}
	this.deleteLine = function (number) {
		for (let k = number; k >= 0; k--) {
			if (this.field[k-1] === undefined) {
				this.field[k] = new Array();
				for (let j = 0; j < 10; j++) {
					this.field[k][j] = 0;
				}
				this.field[k][0] = 1111;
				this.field[k][9] = 1111;
			} else {
				this.field[k] = this.field[k-1]
			}
		}
		score+=100
		copy = {}
		copyRectScore = {}
		for (i in fullLine) {
			if (i==number) {}
			else if (i < number){
				copy[((i++)+1).toString()] = fullLine[i]
				copyRectScore[((i++)+1).toString()] = rectScore[i]
			} else {
				copy[i] = fullLine[i]
				copyRectScore[i] = rectScore[i]
			}
		}
		rectScore = JSON.parse(JSON.stringify(copyRectScore))
		fullLine = JSON.parse(JSON.stringify(copy))
		rectNow = null
	}
}
function toDecimal(bin){
	var decim = 0
	console.log(1,decim, bin.length)
	console.log(2)
	for (var h = 0; h<bin.length; h++) {
		decim=decim+(bin[h]-1)*2**(bin.length-1-h)
	}
	console.log(3)
	/*
	decim = decim+(bin[9]-1)*2**(bin.length-1-9)
	decim = decim+(bin[8]-1)*2**(bin.length-1-8)
	decim = decim+(bin[7]-1)*2**(bin.length-1-7)
	decim = decim+(bin[6]-1)*2**(bin.length-1-6)
	decim = decim+(bin[5]-1)*2**(bin.length-1-5)
	decim = decim+(bin[4]-1)*2**(bin.length-1-4)
	decim = decim+(bin[3]-1)*2**(bin.length-1-3)
	decim = decim+(bin[2]-1)*2**(bin.length-1-2)
	decim = decim+(bin[1]-1)*2**(bin.length-1-1)
	decim = decim+(bin[0]-1)*2**(bin.length-1-0)
	*/
	return decim;
}
