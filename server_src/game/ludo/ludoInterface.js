module.exports = function(db,rooms){
	var ludo = {};

	ludo.devMode = "production";
	ludo.JOIN_ROOM = JOIN_ROOM;
	ludo.ROLL = ROLL;
	ludo.MOVE = MOVE;
	ludo.START = START;
	ludo.CHECK = CHECK;
	ludo.CLEAR = CLEAR;

	return ludo;

	function JOIN_ROOM(clientID,side) {
		console.log('hi join room pls cid: %s, side: %s', clientID, side);
		// clientID = clientID.toString();

		/*
		 * Logic
		 */
		// var side = {1, 2, 3, 4}; side.remove('selected_side'); randomNum = Math.random(); new_comer = side[randomNum];

		// console.log("join says: "+JSON.stringify(gameState.players));
		var roomID = db.get(clientID);
		return {msg: roomID};
		// if(roomID=="")
			// return {msg:"You haven't joined a room. try contacting the ACCOUNT manager"};
		// var room = rooms.get(roomID);
		// if(room.addPlayer(clientID,side)){
			// return {msg:"Got you a room. call CHECK to start playing!"};
		// }else{
			// return {msg:"Can't join the room with this SIDE"};
		// }
		
	}
	/**
	 * rolls a dice
	 * @param  {[type]} clientID  [description]
	 * @param  {[type]} turnID    [description]
	 * @param  {[type]} forceDice [description]
	 * @return {[type]}           [description]
	 */
	function ROLL(clientID,turnID,forceDice) {
		var result = {};
		var d = getDice();
		if(ludo.devMode == "Dickson is dice king!")
			if(forceDice>=1 && forceDice <=6)
				d = forceDice;
		result.dice = d;


		var roomID = db.get(clientID);
		var game = rooms.get(roomID);
		var color = game.players[clientID];

		/**
		 * triple six
		 */
		if(d===6) {
			game.flags.countSix++;
			result.count6 = game.flags.countSix;
		}else{
			game.flags.countSix=0;
		}

		if(game.flags.countSix==3){
			game.killAllPlanes(color);
			game.countSix=0;
		}
		if(d==6){
			result.canStart= game.getCanStart(color);
		}else{
			result.canStart=[];
		}
		result.canMove = game.getCanMove(color);

		game.flags.dice = result.dice;
		game.flags.canMove = result.canMove;
		game.flags.canStart = result.canStart;

		// TODO: evil evil things
		if(!(game.flags.canMove.length>0 || 
			game.flags.canStart.length>0 )){
			game.flags.turnID++;
		}
		
		
		return result;


		// private functions
		function getDice(){
			return Math.floor(Math.random()*6)+1;
		};
		

		
	}
	/**
	 * moves a plane
	 * @param  {[type]} clientID used to check if it is the player's turn
	 * @param  {[type]} turnID   used to check if the player makes a mistake
	 * @param  {[type]} planeID  his choice
	 * @return {[type]}          an array of hops
	 */
	function MOVE(clientID,turnID,planeID) {
		console.log("MOVE[client:%s,turn:%s,plane:%s]",clientID,turnID,planeID);

		var result = {msg:"",hops:[]};
		var messageFlags = [];
		// TODO: check if turn is not correct

		var roomID = db.get(clientID);
		var game = rooms.get(roomID);
		var color = game.players[clientID];
		var dice = game.flags.dice;
		var canMove = game.flags.canMove;
		result.plane = ""+ game.colorToLetter(color) + planeID;

		if(!canMove){
			result = {msg: "no moves"};
			return result;
		}

		// step 1: move according to dice
		
		// forward: an array of 1 element (pass by reference!)
		var forward = [true];

		// recycled holder
		var nextHop;
		messageFlags["move"] = true;
		while(dice--){
			nextHop = game.getNextHop(color,planeID,forward);
			if(nextHop.zone == "ring"){

				result.hops.push(nextHop.place);
			}else if(nextHop.zone == "final"){
				messageFlags["final"] = true;
				result.final = result.final || [];
				result.final.push(nextHop.place);
			}
		}
		var finalHop = nextHop;

		if(finalHop.zone == "ring"){
			var resolved = false;

			// step 2: if can eat, eat and stop
			var planesHere = game.getPlanesAt(finalHop,{color:color,index:planeID},false);

			if(!resolved && planesHere.enemy.length>0){
				console.log("kill 1 occurs");
				killThesePlanesAndLog();
				resolved=true;
			}

			// step 3a: deal with cut
			if(!resolved && game.isMyCut(finalHop,color)){
				console.log("cut 1 occurs");
				messageFlags["cut"] = true;
				nextHop = game.getNextCut(color,planeID);
				result.hops.push(nextHop.place);

				var planesHere = game.getCutVictims(color);
				if(planesHere.length>0){
					console.log("cutKill 1 occurs");
					cutThesePlanesAndLog();
				}

				finalHop=nextHop;

				// step 3b: if can eat here, eat and stop
				var planesHere = game.getPlanesAt(finalHop,{color:color,index:planeID},false);

				if(planesHere.enemy.length>0){
					console.log("kill 2 occurs");
					killThesePlanesAndLog();
					resolved=true;
				}
			}
			

			// step 4a: deal with jump
			if(!resolved && game.isMyColor(finalHop,color)){
				console.log("jump occurs");
				nextHop = game.getNextJump(color,planeID);
				result.hops.push(nextHop.place);
				finalHop=nextHop;
				// step 4b: if can eat, eat and stop
				var planesHere = game.getPlanesAt(finalHop,{color:color,index:planeID},false);

				if(planesHere.enemy.length>0){
					console.log("kill 3 occurs");
					killThesePlanesAndLog();
					resolved=true;
				}
			}
			

			// step 5a: maybe the cut happens after jemp
			if(!resolved && game.isMyCut(finalHop,color)){
				console.log("cut 2 occurs");
				messageFlags["cut"] = true;
				nextHop = game.getNextCut(color,planeID);
				result.hops.push(nextHop.place);

				var planesHere = game.getCutVictims(color);
				if(planesHere.length>0){
					console.log("cutKill 2 occurs");
					cutThesePlanesAndLog();
				}

				finalHop=nextHop;
				// step 4b: if can eat, eat and stop
				var planesHere = game.getPlanesAt(finalHop,{color:color,index:planeID},false);

				if(planesHere.enemy.length>0){
					console.log("kill 4 occurs");
					killThesePlanesAndLog();
					resolved=true;
				}
			}

		}

		stitchMsg();

		// TODO: this is evil
		if(game.flags.dice!=6){
			game.flags.turnID++;
		}

		return result;

		// private functions
		function canMove(p){
			var planeID = p.toString;
			for(i in game.flags.canMove){
				if( game.flags.canMove[i] == planeID ){
					return true;
				}
			}
			return false;
		}
		function killThesePlanesAndLog(){
			messageFlags["eat"] = true;
			result.eat = result.eat || [];

			// v for victims
			for(v in planesHere.enemy){
				game.kill(planesHere.enemy[v]);
				result.eat.push(game.colorToLetter(planesHere.enemy[v].color)+planesHere.enemy[v].index);
			}
		}
		function cutThesePlanesAndLog(){
			messageFlags["cutEat"] = true;
			result.cutEat = result.cutEat || [];

			// v for victims
			for(v in planesHere){
				game.kill(planesHere[v]);
				result.cutEat.push(game.colorToLetter(planesHere[v].color)+planesHere[v].index);
			}
		}
		function stitchMsg(){
			var str="move";
			if(messageFlags.cut) str +=" cut";
			if(messageFlags.eat) str +=" eat";
			if(messageFlags.cutEat) str +=" cutEat";
			if(messageFlags.final) str +=" final";
			result.msg = str;
		}
	}

	/**
	 * start a plane
	 * @return {[type]} [description]
	 */
	function START(clientID,turnID,planeID){
		var roomID = db.get(clientID);
		var game = rooms.get(roomID);
		var color = game.players[clientID];

		game.planes[color][planeID] = {zone:"started",place:0};


		return {msg:"started "+game.colorToLetter(color)+planeID};
	}

	/**
	 * periodic checking
	 */
	function CHECK(clientID,turnID){
		var roomID = db.get(clientID);
		var game = rooms.get(roomID);

		var gameTurn = game.flags.turnID;
		var color = game.players[clientID];

		// if player lags behind
		//if(turnID<gameTurn){
			return packAndReturnHistory();
		//}

		// if it is the player's turn
		if(gameTurn%4 == color){

		}


		return;

		// private functions
		function packAndReturnHistory(){
			var result = {msg:"updated",state:game.getSnapshot()};
			return result;
		}

	}

	function CLEAR(roomID){

		rooms.clear();
		return {msg:"cleared"};
	}


};