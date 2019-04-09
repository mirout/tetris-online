'use strict';
var pjs = new PointJS('2D', 1000, 480, {
	backgroundColor : 'black'
});
pjs.system.initFullPage();

var log    = pjs.system.log;
var game   = pjs.game;
var point  = pjs.vector.point;
var camera = pjs.camera;
var brush  = pjs.brush;
var OOP    = pjs.OOP;
var math   = pjs.math;
var levels = pjs.levels;

var key   = pjs.keyControl.initKeyControl();
var mouse = pjs.mouseControl.initMouseControl();
var startNew = true;

var deviceHasTouch = false;

var width  = game.getWH().w;
var height = game.getWH().h;

var colorsForFigure = ["#FF9E00","#D1FF00", "#FF0000", "#AE6EF5"];
var score = 0;
var scoreOpponent = 0;

var goMenuButton = new MenuButton(10, 10);
var betaVersion = game.newTextObject({
	x:width-40,y:height-10,
	text : "v 0.6b",
	size : 12,
	color : "#333"
});
pjs.system.setTitle('Tetris Classic');

game.newLoopFromConstructor("singleGame", function () {
	var field = new Field();
	var rectGameOver = game.newRoundRectObject({
 		x:0, y:0,
		w : game.getWH().w,
		h : game.getWH().h,
		fillColor : "#000",
		strokeColor : "#000",
		strokeWidth : 1,
		alpha: 0.7
	});
	var textGameOver = game.newTextObject({
		positionC : point(game.getWH2().w, game.getWH2().h),
		text : "Игра Окончена",
		size : width/20,
		color : "#FFF"
	});
	var touchControl1 = game.newRoundRectObject({
		x: 20, y:height-220,
		w : 100,
		h : 100,
		fillColor : "#FFF",
	});
	var touchControl2 = game.newRoundRectObject({
		x: 20, y:height-110,
		w : 100,
		h : 100,
		fillColor : "#FFF",
	});
	var touchControl3 = game.newRoundRectObject({
		x: width-220, y:height-160,
		w : 100,
		h : 100,
		fillColor : "#FFF",
	});
	var touchControl4 = game.newRoundRectObject({
		x: width-110, y:height-160,
		w : 100,
		h : 100,
		fillColor : "#FFF",
	});

	this.update = function () {
		if (startNew) {
			field = new Field();
			startNew = false
		}
		game.clear();
		if (deviceHasTouch) {
			touchControl1.draw();
			touchControl2.draw();
			touchControl3.draw();
			touchControl4.draw();
		}
		if (key.isPress("RIGHT") && field.checkPossibleMoveRight()) {
			field.figure.moveRight();
		}
		if (key.isPress("LEFT") && field.checkPossibleMoveLeft()) {
			field.figure.moveLeft();
		}
		if (key.isDown("DOWN") && field.checkPossibleMoveDown()) {
			if (!flagFigureFall){
				var figureFall = setTimeout(function (){field.figure.moveDown();flagFigureFall = false},50);
				flagFigureFall = true
			}
		} else {
			clearTimeout(figureFall);
			flagFigureFall = false;
		}
		if (key.isPress("UP") && field.checkPossibleTurn()) {
			field.figure.turn();
		}
		field.draw(width/2-(height/20)*5, 25, height-50);

		//отрисовка счёта

		brush.drawText({
			x:width/2+(height/20)*5+height/20+50, y:25,
			text:"Ваш счёт: " + score,
			color: "white",
			size: width/55
		});
		brush.drawText({
			x:width/2+(height/20)*5+50, y:25+2*width/55,
			text:"Следующая фигура:",
			color: "white",
			size: width/55
		});
		field.nextFigure.draw(width/2+(height/20)*5-4*(height-200)/20+50,25+4*width/55,(height-200)/20);
		if (field.flagGameOver) {
			rectGameOver.draw()
			textGameOver.draw()
		}

		document.onclick = function(){
			if (mouse.isInStatic(touchControl1) && field.checkPossibleTurn()) {
				field.figure.turn()
			}
			if (mouse.isInStatic(touchControl2) && field.checkPossibleMoveDown()) {
				field.figure.moveDown()
			}
			if (mouse.isInStatic(touchControl3) && field.checkPossibleMoveLeft()) {
				field.figure.moveLeft()
			}
			if (mouse.isInStatic(touchControl4) && field.checkPossibleMoveRight()) {
				field.figure.moveRight()
			}
			if (mouse.isInStatic(touchControl4) && field.checkPossibleMoveRight()) {
				field.figure.moveRight()
			}
			if (goMenuButton.isPress()){
				game.setLoop("mainMenu");
			}
		}

		goMenuButton.draw();
		goMenuButton.isPress();
		//console.log(field.field)
		betaVersion.draw()
	};

});
game.newLoopFromConstructor("mainMenu", function () {
	var rectNewSingleGame = game.newRoundRectObject({
 		positionC : point(game.getWH2().w, game.getWH2().h/1.2),
		w : game.getWH().w/3,
		h : game.getWH().h/8,
		fillColor : "#FFF",
		strokeColor : "#000",
		strokeWidth : 1,
	});
	var textNewSingleGame = game.newTextObject({
		positionC : point(game.getWH2().w, game.getWH2().h/1.2),
		text : "Начать одиночную игру",
		size : width/50,
		color : "#000"
	});
	var rectNewMultiGame = game.newRoundRectObject({
 		positionC : point(game.getWH2().w, game.getWH2().h/1.2+game.getWH().h/8+10),
		w : game.getWH().w/3,
		h : game.getWH().h/8,
		fillColor : "#FFF",
		strokeColor : "#000",
		strokeWidth : 1,
	});
	var textNewMultiGame = game.newTextObject({
		positionC : point(game.getWH2().w, game.getWH2().h/1.2+game.getWH().h/8+10),
		text : "Начать онлайн игру",
		size : width/50,
		color : "#000"
	});
	var rectAboutGame = game.newRoundRectObject({
 		positionC : point(game.getWH2().w, game.getWH2().h/1.2+game.getWH().h/8+10+game.getWH().h/8+10),
		w : game.getWH().w/3,
		h : game.getWH().h/8,
		fillColor : "#FFF",
		strokeColor : "#000",
		strokeWidth : 1,
	});
	var textAboutGame = game.newTextObject({
		positionC : point(game.getWH2().w, game.getWH2().h/1.2+game.getWH().h/8+10+game.getWH().h/8+10),
		text : "О игре",
		size : width/50,
		color : "#000"
	});
	this.update = function() {
		rectNewSingleGame.draw();
		textNewSingleGame.draw();
		rectNewMultiGame.draw();
		textNewMultiGame.draw();
		rectAboutGame.draw();
		textAboutGame.draw();
		document.onclick = function(){
			if (mouse.isInStatic(rectNewSingleGame)) {
				startNew = true
				game.setLoop("singleGame");
			}
			if (mouse.isInStatic(rectNewMultiGame)) {
				startNew = true
				game.setLoop("multiGame");
			}
			if (mouse.isInStatic(rectAboutGame)) {
				startNew = true
				game.setLoop("aboutGame");
			}
		}
		if (mouse.isInStatic(rectNewSingleGame)) {
			rectNewSingleGame.fillColor = "#DDD"
		} else {
			rectNewSingleGame.fillColor = "#FFF"
		}
		if (mouse.isInStatic(rectNewMultiGame)) {
			rectNewMultiGame.fillColor = "#DDD"
		} else {
			rectNewMultiGame.fillColor = "#FFF"
		}
		if (mouse.isInStatic(rectAboutGame)) {
			rectAboutGame.fillColor = "#DDD"
		} else {
			rectAboutGame.fillColor = "#FFF"
		}
		betaVersion.draw()
	}
});

game.newLoopFromConstructor("aboutGame", function () {
	this.update = function() {
		goMenuButton.draw();
		goMenuButton.isPress();
		brush.drawText({
			x:100,y:100,
			text: "Игра разработана на движке PointJs. Ссылка: https://mult-uroki.ru/pointjs/",
			color: "white",
			size: width/50
		})

		brush.drawText({
			x:100,y:100+2*width/50+5,
			text: "Упраление фигурой:",
			color: "white",
			size: width/50
		})
		brush.drawText({
			x:100,y:100+3*width/50+5,
			text: "   Клавиша вверех - поворот фигуры,",
			color: "white",
			size: width/50
		})
		brush.drawText({
			x:100,y:100+4*width/50+5,
			text: "   Клавиша влево и вправо - передвижение фигуры влево и вправо,",
			color: "white",
			size: width/50
		})
		brush.drawText({
			x:100,y:100+5*width/50+5,
			text: "   Клавиша вниз - передвижение фигуры вниз.",
			color: "white",
			size: width/50
		})
		betaVersion.draw()
	}
})

game.newLoopFromConstructor("multiGame", function () {
	var room = "false";
	var request = false;
	var field = new Field();
	var fieldOpponent = new Field();
	fieldOpponent.nextFigure = null;
	fieldOpponent.dynamicFigure = true;
	window.onunload = function() {
		var xhr = new XMLHttpRequest();
		xhr.open("POST",'tetris_classic/delete_me', false);
		xhr.send(id);
	}
	var textSearchOpponent = game.newTextObject({
		positionC : point(game.getWH2().w, game.getWH2().h),
		text : "Поиск противника ",
		size : width/50,
		color : "#FFF",
		countDot : 0
	});
	var id;
	var open = false;
	var req;
	var xhr;

	var rectGameOverPl = game.newRoundRectObject({
 		x:width/2-(height/20)*12, y:height/10,
		w : (height-height/4)/2+(height/20),
		h : height-height/4,
		fillColor : "#000",
		strokeColor : "#000",
		strokeWidth : 1,
		alpha: 0.7
	});
	var textGameOverPl = game.newTextObject({
		positionC : point(game.getWH2().w-(height/20)*7, game.getWH2().h),
		text : "Игра Окончена",
		size : width/75,
		color : "#FFF"
	});

	var rectGameOverOp = game.newRoundRectObject({
 		x:width/2+(height/20)*12-(height/20)*10, y:height/10,
		w : (height-height/4)/2+(height/20),
		h : height-height/4,
		fillColor : "#000",
		strokeColor : "#000",
		strokeWidth : 1,
		alpha: 0.7
	});
	var textGameOverOp = game.newTextObject({
		positionC : point(game.getWH2().w+(height/20)*7, game.getWH2().h),
		text : "Игра Окончена",
		size : width/75,
		color : "#FFF"
	});

	var rectWin = game.newRoundRectObject({
 		x:0, y:0,
		w : game.getWH().w,
		h : game.getWH().h,
		fillColor : "#000",
		strokeColor : "#000",
		strokeWidth : 1,
		alpha: 0.7
	});
	var textWin = game.newTextObject({
		positionC : point(game.getWH2().w, game.getWH2().h),
		text : "Игра Окончена",
		size : width/20,
		color : "#FFF"
	});

	this.update = function() {
		if (!open) {
			var xhr = new XMLHttpRequest();
			xhr.open("POST",'tetris_classic/add_new_player', false);
			xhr.send(open.toString());
			id = xhr.responseText;
			open = true
			console.log(id);
		}
		if (room == "false") {
			requestOnSearch = OOP.newTimer(500, function () {
				var xhr = new XMLHttpRequest();
				xhr.open("POST",'tetris_classic/search_opponent', false);
				console.log(id)
				xhr.send(id);
				request = false
				room = xhr.responseText;
				console.log(room);
			});
			addDot = OOP.newTimer(500, function () {
				if (textSearchOpponent.countDot<3) {
					textSearchOpponent.text=textSearchOpponent.text+"."
					textSearchOpponent.countDot+=1
				} else {
					textSearchOpponent.text="Поиск противника "
					textSearchOpponent.countDot=0
				}
			});

			if(request == false){
				requestOnSearch.start();
				addDot.start();
			}
			request = true
			textSearchOpponent.draw();
			goMenuButton.draw();
			if (goMenuButton.isPress()) {
				var xhr = new XMLHttpRequest();
				xhr.open("POST",'tetris_classic/delete_me', false);
				xhr.send(id);
				open = false;
			}
			score = 0
		} else {
			game.clear();
			if (key.isPress("RIGHT") && field.checkPossibleMoveRight()) {
				field.figure.moveRight();
			}
			if (key.isPress("LEFT") && field.checkPossibleMoveLeft()) {
				field.figure.moveLeft();
			}
			if (key.isPress("DOWN") && field.checkPossibleMoveDown()) {
				field.figure.moveDown();
			}
			if (key.isPress("UP") && field.checkPossibleTurn()) {
				field.figure.turn();
			}

			requestOnGetField = OOP.newTimer(500, function () {
				var reqField = {};
				for (var key in field) {
  					reqField[key] = field[key];
  					if (key == "field") {
  						reqField[key] = JSON.parse(JSON.stringify(field[key]))
  					}
				}
				reqField.addFigureOnField();
				json = {"id":id,"idRoom":room,"field":reqField.field, "score":score, "gameOver": field.flagGameOver};
				xhr = new XMLHttpRequest();
				xhr.open("POST",'tetris_classic/field_json', true);
				xhr.send(JSON.stringify(json));
				xhr.onload = function() {
					if (xhr.readyState != 4) return;
					try {
						json = JSON.parse(xhr.responseText);
						fieldOpponent.field = json["field"];
						scoreOpponent = json["scoreOpponent"]
						fieldOpponent.flagGameOver = json["gameOver"]
					} catch (err) {
						console.log(err)
					}
					console.log(id)
					request = false;
				}
			});
			if (!request){
				requestOnGetField.start();
				request = true
			}

			field.draw(width/2-(height/20)*12, height/10, height-height/4);
			fieldOpponent.draw(width/2+(height/20)*12-(height/20)*10,height/10,height-height/4);
			goMenuButton.draw();
			goMenuButton.isPress();

			if (field.flagGameOver) {
				rectGameOverPl.draw()
				textGameOverPl.draw()
			}
			if (fieldOpponent.flagGameOver) {
				rectGameOverOp.draw()
				textGameOverOp.draw()
			}
			if (field.flagGameOver && fieldOpponent.flagGameOver) {
				rectWin.draw()
				if (scoreOpponent>score) {
					textWin.text = "Вы проиграли"
				} else if (scoreOpponent<score) {
					textWin.text = "Вы выйграли"
				} else {
					textWin.text = "Ничья"
				}
				textWin.positionC = point(game.getWH2().w, game.getWH2().h)
				textWin.draw()
			}

			brush.drawText({
				x : width/2-(height/20)*12+height/20, y : height/10-(height/20)*1.5,
				text : "Твой счёт: "+ score,
				color : "white",
				size : width/70
			});
			brush.drawText({
				x : width/2+(height/20)*12-(height/20)*10+height/20, y : height/10-(height/20)*1.5,
				text : "Счёт соперника: "+ scoreOpponent,
				color : "white",
				size : width/70
			});
		}
		betaVersion.draw()
	}
});

game.startLoop('mainMenu');

function changeDevice(ev){
		deviceHasTouch = true;
}

document.addEventListener("touchstart", changeDevice, false);
