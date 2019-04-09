var http = require("http");
var fs = require("fs");
var rm = require("./room.js");
waitingPlayerstb = [];
roomstb = [];
waitingConnecttb = {};

waitingPlayersto = [];
roomsto = [];
waitingConnectto = {};
var now = new Date();
fs.appendFileSync("access.log", "\nServer start "+now);
new http.Server(function(req,res) {
	console.log(req.url)
	if (req.url == "/index.html"){
		var now = new Date();
		fs.appendFileSync("access.log", "\nindex "+now);
		var file = new fs.ReadStream("index.html");
		sendFile(file, res);
	}else if (req.url == "/style.css") {
		var file = new fs.ReadStream("style.css");
		sendFile(file, res);
	} else if (req.url == "/tetris_binary"){
		now = new Date();
		fs.appendFileSync("access.log", "\nTetris Binary "+now);
		var file = new fs.ReadStream("scripts/tetrisBinary/tetris_binary.html");
		sendFile(file, res);
	} else if (req.url == "/tetris_classic"){
		now = new Date();
		fs.appendFileSync("access.log", "\nTetris Classic "+now);
		var file = new fs.ReadStream("scripts/tetrisClassic/tetris_classic.html");
		sendFile(file, res);
	} else if (req.url == "/pointjs_0.2.0.3.js") {
		var file = new fs.ReadStream("scripts/main/pointjs_0.2.0.3.js");
		sendFile(file, res);
	} else if (req.url == "/menuButton.js") {
		var file = new fs.ReadStream("scripts/main/menuButton.js");
		sendFile(file, res);
	} else if (req.url == "/maintb.js") {
		var file = new fs.ReadStream("scripts/tetrisBinary/main.js");
		sendFile(file, res);
	} else if (req.url == "/fieldtb.js") {
		var file = new fs.ReadStream("scripts/tetrisBinary/field.js");
		sendFile(file, res);
	} else if (req.url == "/figuretb.js") {
		var file = new fs.ReadStream("scripts/tetrisBinary/figure.js");
		sendFile(file, res);
	} else if (req.url == "/maintc.js") {
		var file = new fs.ReadStream("scripts/tetrisClassic/main.js");
		sendFile(file, res);
	} else if (req.url == "/fieldtc.js") {
		var file = new fs.ReadStream("scripts/tetrisClassic/field.js");
		sendFile(file, res);
	} else if (req.url == "/figuretc.js") {
		var file = new fs.ReadStream("scripts/tetrisClassic/figure.js");
		sendFile(file, res);

	} else if (req.url.indexOf("/tetris_binary")!=-1) {
		url = req.url.slice(14)
		//console.log(url)
		if (url == "/add_new_player"){
			id = "id"+Math.floor(Math.random() * (10000 - 1) + 1);
			addNewPlayertb(id);
			res.end(id);
		} else if (url == "/search_opponent"){
			req.on("data", function(chunk){
				id = chunk.toString();
			});
			//console.log(id)
			if (id in waitingConnecttb){
				res.end(waitingConnecttb[id]);
			}
			var idOpponent = searchOpponentAndGetHisIdtb(id);
			if (idOpponent && waitingPlayerstb.indexOf(idOpponent)!=-1) {
				roomstb.push(new rm.Room(id, idOpponent));;
				addPlayerCreateRoomtb(idOpponent ,roomstb[roomstb.length-1].idRoom);
				deleteWaitingPlayerIdtb(id);
				deleteWaitingPlayerIdtb(idOpponent);
				id = null;
				idOpponent = null;
				res.end(roomstb[roomstb.length-1].idRoom);
			} else {
				id = null;
				res.end("false")
			}
			//console.log(idOpponent)

		} else if (url == "/delete_me"){
			req.on("data", function(chunk){
				id = chunk.toString();
			});
			try {
				deleteWaitingPlayerIdtb(id);
			} catch (err) {
				console.log(err)
				id = "0";
			}
			res.end();
		} else if (url == "/field_json"){
			req.on("data", function(chunk){
				x = JSON.parse(chunk.toString());
			});
			try {
				res.writeHead(200, {
	    			'Content-Type': 'application/javascript'
	  			});
				json = x;
				console.log(json["id"]);
				for (var i = 0;i<roomstb.length;i++) {
					if (json["idRoom"] == roomstb[i].idRoom) {
						roomstb[i].updateField(json["id"],json["field"]);
						roomstb[i].updateScore(json["id"],json["score"]);
						roomstb[i].updateGameOver(json["id"],json["gameOver"])
						res.end(JSON.stringify({"id": json["id"],"field":roomstb[i].getOpponentField(json["id"]),"scoreOpponent":roomstb[i].getOpponentScore(json["id"]), "gameOver":roomstb[i].getOpponentGameOver(json["id"])}));
					}
				}
			} catch (err) {
				console.log(err)
				res.end();
			}
		}

	} else if (req.url.indexOf("/tetris_classic")!=-1) {
		url = req.url.slice(15)
		console.log(url)
		if (url == "/add_new_player"){
			id = "id"+Math.floor(Math.random() * (10000 - 1) + 1);
			addNewPlayerto(id);
			res.end(id);
		} else if (url == "/search_opponent"){
			req.on("data", function(chunk){
				id = chunk.toString();
			});
			console.log(waitingConnectto,waitingPlayersto,searchOpponentAndGetHisIdto(id),waitingPlayersto.indexOf(searchOpponentAndGetHisIdto(id))!=-1)
			if (id in waitingConnectto){
				res.end(waitingConnectto[id]);
			}
			var idOpponent = searchOpponentAndGetHisIdto(id);
			if (idOpponent && waitingPlayersto.indexOf(idOpponent)!=-1) {
				roomsto.push(new rm.Room(id, idOpponent));;
				addPlayerCreateRoomto(idOpponent ,roomsto[roomsto.length-1].idRoom);
				deleteWaitingPlayerIdto(id);
				deleteWaitingPlayerIdto(idOpponent);
				id = null;
				idOpponent = null;
				res.end(roomsto[roomsto.length-1].idRoom);
			} else {
				id = null;
				res.end("false")
			}
			//console.log(idOpponent)

		} else if (url == "/delete_me"){
			req.on("data", function(chunk){
				id = chunk.toString();
			});
			try {
				deleteWaitingPlayerIdto(id);
			} catch (err) {
				id = "0";
			}
			res.end();
		} else if (url == "/field_json"){
			req.on("data", function(chunk){
				x = JSON.parse(chunk.toString());
			});
			try {
				res.writeHead(200, {
	    			'Content-Type': 'application/javascript'
	  			});
				json = x;
				console.log(json["id"]);
				for (var i = 0;i<roomsto.length;i++) {
					if (json["idRoom"] == roomsto[i].idRoom) {
						roomsto[i].updateField(json["id"],json["field"]);
						roomsto[i].updateScore(json["id"],json["score"])
						roomsto[i].updateGameOver(json["id"],json["gameOver"])
						res.end(JSON.stringify({"id": json["id"],"field":roomsto[i].getOpponentField(json["id"]),"scoreOpponent":roomsto[i].getOpponentScore(json["id"]), "gameOver":roomsto[i].getOpponentGameOver(json["id"])}));
					}
				}
			} catch (err) {
				console.log(err)
				res.end();
			}
		}
	} else {
		res.end();
	}
}).listen(3000)
//отправка файлов
function sendFile(file, res) {
	file.pipe(res);
	res.on("close", function(){
		file.destroy();
	})
}
//добавление нового игрока в список ожидающих
function addNewPlayerto(id){
	waitingPlayersto.push(id);
	id = null;
}
function addNewPlayertb(id){
	waitingPlayerstb.push(id);
	id = null;
}

function searchOpponentAndGetHisIdto(id){
	for(var i = 0; i<waitingPlayersto.length; i++) {
		if (waitingPlayersto[i]!=id) {
			return waitingPlayersto[i];
		}
	}
	return null;
}
function searchOpponentAndGetHisIdtb(id){
	for(var i = 0; i<waitingPlayerstb.length; i++) {
		if (waitingPlayerstb[i]!=id) {
			return waitingPlayerstb[i];
		}
	}
	return null;
}

function deleteWaitingPlayerIdto(id) {
	console.log(id,waitingPlayersto.indexOf(id));
	if (waitingPlayersto.indexOf(id)!=-1){
		waitingPlayersto.splice(waitingPlayersto.indexOf(id),1);
	}
	id = null;
}
function deleteWaitingPlayerIdtb(id) {
	console.log(id,waitingPlayerstb.indexOf(id));
	if (waitingPlayerstb.indexOf(id)!=-1){
		waitingPlayerstb.splice(waitingPlayerstb.indexOf(id),1);
	}
	id = null;
}

function addPlayerCreateRoomto(id, idRoom){
	waitingConnectto[id] = idRoom;
}
function addPlayerCreateRoomtb(id, idRoom){
	waitingConnecttb[id] = idRoom;
}
