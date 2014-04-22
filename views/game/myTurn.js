var myTurn = (function(){
	var myTurn = {
		name:"R",
		color:"R",
		me:0,
		step:0,
		updateInterval:null,
		getName:function(){
			myTurn.name = prompt("name?","Mary");
		},
		getSide:function(){
			myTurn.color = prompt("color?","R/Y/G/B");
			myTurn.me = {
				"R":0,
				"Y":1,
				"G":2,
				"B":3
			}[myTurn.color];
			console.log(myTurn.me);
			for(var r=0; r <4; r++){
			(function(i){
				$(board.planesDiv[myTurn.color][r]).on("click",function(p){
					console.log("%s clicked", i);
					planeSelected(i);
				});
			})(r);
		
	}
		},
		setup:function(){
			$.ajax({
				type: "POST",
				url: SERVER_ADDRESS +"register",
				data: {
					clientID:myTurn.name,
					roomID:100,
					secret:"Dickson is amazing!"
				},
				success: function(msg){
					console.log(msg);
					$.ajax({
						type: "POST",
						url: SERVER_ADDRESS +"join_room",
						data: {
							clientID:myTurn.name,
							side:myTurn.color
						},
						success: function(msg){
							console.log(msg);
							
						},
						error: function(msg){
							console.log(msg);
						},
						dataType: ""
					});
				},
				error: function(msg){
					console.log(msg);
				},
				dataType: ""
			});
		},
		runNextStep:function(i,arg){
			console.log(i);
			console.log(this.step);
			if(i == this.step){
				console.log("step%d",i);
				myTurn.steps[i].call(this,arg);
				this.step++;
			}
		},
		steps:[
			function(){//0
					console.log("fei hei0");
				
				if(game.flags.countSix==0){
					console.log("fei hei");
					showOverlay("yourTurn");
				}
				if(game.flags.countSix==1)
					showOverlay("oneMoreChance");
				if(game.flags.countSix==2)
					showOverlay("onFire");
				if(game.flags.countSix==3)
					showOverlay("tripleSix");


			},
			function(){//1
				serve.roll(myTurn.name,game.flags.turnID);
			},
			function(msg){//2
				console.log("hi"+JSON.stringify(msg));

				game.flags.dice = msg.dice;
				game.flags.countSix = msg.count6;
				game.flags.canMove = msg.canMove;
				game.flags.canStart = msg.canStart;
				if(game.flags.canMove.length>0 || 
					game.flags.canStart.length>0){
						showOverlay("letsMove");
				}else{
					showOverlay("noMoves");
				}
			},
			function(){//3
				game.flags.movingFlag=["NA","NA","NA","NA"];

				for(var i=0; i<game.flags.canStart.length; i++){
					game.flags.movingFlag[game.flags.canStart[i]]="start";
				}
				for(var i=0; i<game.flags.canMove.length; i++){
					game.flags.movingFlag[game.flags.canMove[i]]="move";
				}

				console.log(game.flags.movingFlag);
				
				hideOverlay();
			},
			function(msg){//4
				console.log(msg.msg);
				switch(msg.type){
				case "started":
					var planeID = msg.msg.msg.split("started ")[1];
					console.log(planeID);
					animateStart(planeID);
					break;
				case "moved":
					game.flags.haveCutKills = false;
					game.flags.haveFinals = false;
					var operations = msg.msg.msg.split(" ");
					for(o in operations){
						if(operations[o] == "final") game.flags.haveFinals = true;
						if(operations[o] == "cutEat") game.flags.haveCutKills = true;
					}
					console.log(msg.msg.msg);
					game.hops = msg.msg.hops;
					game.eat = msg.msg.eat;
					if(msg.msg.hasOwnProperty("final"))game.finals = msg.msg.final;
					var planeID = msg.msg.plane;
					animatePlane(planeID);
					break;
				}
			},
			function(){//5
				// deal with new chance
				myTurn.updateInterval = setTimeout(myTurn.update,1000);
			}
		]

	};


	myTurn.update = function(){
		//if(game.flags.turnID%4 == myTurn.myTurn)return;
		$.ajax({
			type: "POST",
			url: SERVER_ADDRESS +"check",
			data: {
				clientID:myTurn.name,
				turnID:game.flags.turnID,
			},
			success: function(msg){
				console.log(msg);
				putAllPieces(msg);
				console.log(msg.state.flags.turnID,myTurn.me);
				if(msg.state.flags.turnID%4==myTurn.me){
					game.flags.countSix=0;
					myTurn.step=0;
					myTurn.runNextStep(0);
				}else{
					setTimeout(function(){myTurn.update()},3000);
				}
			},
			error: function(msg){
				console.log(msg);
			},
			dataType: ""
		});

	}
	

	return myTurn;
})();




