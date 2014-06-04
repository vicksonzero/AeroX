module.exports = (function(){

var express = require('express');
var config = require('../config');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');

// var routes = require('./routes/index');
// var users = require('./routes/users');

var mongoose = require('mongoose');
var db = require('./ludo/database')(mongoose, config);
var ludo = require('./ludo/ludoInterface');

var app = express();
/*
 * Global Variables made:
 * 
 * var devMode = "production";
 * function JOIN_ROOM(clientID,side);
 * function ROLL(clientID,turnID,forceDice);
 * function MOVE(clientID,turnID,planeID);
 * function START();
 * function CHECK(clientID,turnID);
 */

app.use(express.bodyParser());
// app.post('/skmisaac', function(req, res, next){
//   console.log('req.param: %s', req.param('p'));
//   res.send(200, 'see console');
// });
app.config = config;

var rooms = require('./ludo/rooms');
var ludo = require('./ludo/ludoInterface')(db,rooms);


app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.post('/clear',function(req,res){
	res.setHeader('Content-Type', 'application/json');
	var secret = req.param("secret");
	var roomID = req.param("roomID");

	if(secret == "Dickson's eraser"){
		res.end(JSON.stringify(ludo.CLEAR(roomID)));
	}else{
		res.end(JSON.stringify({msg:"no cheats allowed"}));
	}
});


app.post('/check',function(req,res){
	res.setHeader('Content-Type', 'application/json');
	var clientID = req.param("clientID");
	var turnID = req.param("turnID");

	res.end(JSON.stringify(ludo.CHECK(clientID,turnID)));
});

app.post('/move',function(req,res){
	res.setHeader('Content-Type', 'application/json');
	var clientID = req.param("clientID");
	var turnID = req.param("turnID");
	var planeID = req.param("planeID"); // {secret,forceDice};

	res.end(JSON.stringify(ludo.MOVE(clientID,turnID,planeID)));

});

app.post('/start',function(req,res){
	res.setHeader('Content-Type', 'application/json');
	var clientID = req.param("clientID");
	var turnID = req.param("turnID");
	var planeID = req.param("planeID"); // {secret,forceDice};

	res.end(JSON.stringify(ludo.START(clientID,turnID,planeID)));

});

app.post('/roll',function(req,res){
	res.setHeader('Content-Type', 'application/json');
	var clientID = req.param("clientID");
	var turnID = req.param("turnID");
	var cheat = req.param("cheat"); // {secret,forceDice};

	if(cheat!==undefined &&
		cheat.secret == "Dickson is dice king!"){
			ludo.devMode = cheat.secret;
		res.end(JSON.stringify(ludo.ROLL(clientID,turnID,cheat.forceDice)));
	}else{
		res.end(JSON.stringify(ludo.ROLL(clientID,turnID)));
	}
});

app.post('/join_room',function(req,res){
	// res.send(200, {res: req.param('clientID')});

	// res.setHeader('Content-Type', 'application/json');
	// var clientID = req.param("clientID");
	// var side = letterToColor(req.param("side"));
	// res.setHeader('Content-Type', 'application/json');
	// res.end(JSON.stringify(ludo.JOIN_ROOM(req.param("clientID"),req.param("side"))));

	var result = ludo.JOIN_ROOM(req.param("clientID"),req.param("side"));
	console.log(result);

	function letterToColor(i){
		var color = {"R":0,"Y":1,"G":2,"B":3};
		return color[i];
	}
	res.send(200);
});


app.post('/register',function(req,res){
	// res.setHeader('Content-Type', 'application/json');
	// if( req.param('secret') != "Dickson is amazing!"){
	// 	res.json({msg:"cheat not allowed"});
	// }

	db.add(req.param('cid'), req.param('rid'));

	res.json({
		msg: "account added"
	});

});

// app.post('/testInterface',function(req,res){
// 	res.end(ludo.JOIN_ROOM.toString());

// });

// app.post('/testPassVar',function(req,res){
// 	res.setHeader('Content-Type', 'application/json');
// 	var n = req.param("name");
// 	res.json({name:n});

// });

// app.post('/testDB',function(req,res){
// 	res.setHeader('Content-Type', 'application/json');
// 	db.add(10,100);
// 	res.end(JSON.stringify(db,null,4));

// });


// catch 404 and forwarding to error handler
// app.use(function(req, res, next) {
// 	var err = new Error('Not Found');
// 	err.status = 404;
// 	next(err);
// });

// /// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
// 	app.use(function(err, req, res, next) {
// 		res.status(err.status || 500);
// 		res.render('error', {
// 			message: err.message,
// 			error: err
// 		});
// 	});
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
// 	res.status(err.status || 500);
// 	res.render('error', {
// 		message: err.message,
// 		error: {}
// 	});
// });


return app;
})();
