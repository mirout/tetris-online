exports.Room = function (idFirstPlayer, idSecondPlayer) {

	this.idFirstPlayer = idFirstPlayer;
	this.idSecondPlayer = idSecondPlayer;

	this.firstPlayerScore = 0;
	this.secondPlayerScore = 0;

	this.firstPlayerGameOver = false;
	this.SecondPlayerGameOver = false;

	this.idRoom = "id"+Math.floor(Math.random() * (10000 - 1) + 1);
	this.firstPlayerField = new Array();
	for (var i = 0; i < 23; i++) {
		this.firstPlayerField[i] = new Array();
		for (var j = 0; j < 12; j++) {
			this.firstPlayerField[i][j] = 0;
		}
	}
	this.secondPlayerField = new Array();
	for (var i = 0; i < 23; i++) {
		this.secondPlayerField[i] = new Array();
		for (var j = 0; j < 12; j++) {
			this.secondPlayerField[i][j] = 0;
		}
	}

	this.updateField = function (id, field) {
		if (id==this.idFirstPlayer) {
			this.firstPlayerField = JSON.parse(JSON.stringify(field));
		} else if (id==this.idSecondPlayer) {
			this.secondPlayerField = JSON.parse(JSON.stringify(field));
		}
	}
	this.getOpponentField = function (id) {
		if (id==this.idFirstPlayer) {
			return(this.firstPlayerField);
		} else {
			return(this.secondPlayerField);
		}
	}

	this.updateGameOver = function (id, gameOver) {
		if (id==this.idFirstPlayer) {
			this.firstPlayerGameOver = JSON.parse(JSON.stringify(gameOver));
		} else if (id==this.idSecondPlayer) {
			this.SecondPlayerGameOver = JSON.parse(JSON.stringify(gameOver));
		}
	}
	this.getOpponentGameOver = function (id) {
		if (id==this.idFirstPlayer) {
			return(this.firstPlayerGameOver);
		} else if (id==this.idSecondPlayer) {
			return(this.SecondPlayerGameOver);
		}
	}

	this.updateScore = function (id, score) {
		if (id==this.idFirstPlayer) {
			this.firstPlayerScore = JSON.parse(JSON.stringify(score));
		} else if (id==this.idSecondPlayer) {
			this.secondPlayerScore = JSON.parse(JSON.stringify(score));
		}
	}
	this.getOpponentScore = function (id) {
		if (id==this.idFirstPlayer) {
			return(this.firstPlayerScore);
		} else if (id==this.idSecondPlayer) {
			return(this.secondPlayerScore);
		}
	}
}
