var serve = (function(){
	var serve={

		roll2:function(clientID,turnID){
			$.ajax({
				type: "POST",
				url: SERVER_ADDRESS +"roll",
				data: {
					clientID:clientID,
					turnID:turnID,
					cheat:{
						secret:"Dickson is dice king!",
						forceDice:6
					}
				},
				success: function(msg){
					console.log(msg);
					myTurn.runNextStep(2,msg);
				},
				error: function(msg){
					console.log(msg);
				},
				dataType: ""
			});
		},
		roll:function(clientID,turnID){
			$.ajax({
				type: "POST",
				url: SERVER_ADDRESS +"roll",
				data: {
					clientID:clientID,
					turnID:turnID,
				},
				success: function(msg){
					console.log(msg);
					myTurn.runNextStep(2,msg);
				},
				error: function(msg){
					console.log(msg);
				},
				dataType: ""
			});
		},
		move:function(clientID,turnID,planeID){
			$.ajax({
				type: "POST",
				url: SERVER_ADDRESS +"move",
				data: {
					clientID:clientID,
					turnID:turnID,
					planeID:planeID
				},
				success: function(msg){
					console.log(msg);
					myTurn.runNextStep(4,{type:"moved",msg:msg});
				},
				error: function(msg){
					console.log(msg);
				},
				dataType: ""
			});	
		},
		start:function(clientID,turnID,planeID){
			$.ajax({
				type: "POST",
				url: SERVER_ADDRESS +"start",
				data: {
					clientID:clientID,
					turnID:turnID,
					planeID:planeID
				},
				success: function(msg){
					console.log(msg);
					myTurn.runNextStep(4,{type:"started",msg:msg});
				},
				error: function(msg){
					console.log(msg);
				},
				dataType: ""
			});	
		},
		put:function(clientID, planeID, forceDice){
			$.ajax({
				type: "POST",
				url: SERVER_ADDRESS +"roll",
				data: {
					clientID:clientID,
					turnID:0,
					cheat:{
						secret:"Dickson is dice king!",
						forceDice:forceDice
					}
				},
				success: function(msg){
					console.log(msg);
					moveIt();
				},
				error: function(msg){
					console.log(msg);
				},
				dataType: ""
			});
			function moveIt(){
				$.ajax({
					type: "POST",
					url: SERVER_ADDRESS +"move",
					data: {
						clientID:clientID,
						turnID:0,
						planeID:planeID
					},
					success: function(msg){
						console.log(msg);
						myTurn.runNextStep(4,{type:"moved",msg:msg});
					},
					error: function(msg){
						console.log(msg);
					},
					dataType: ""
				});
			}
		},
		forceStart:function(clientID, planeID, forceDice){
			$.ajax({
				type: "POST",
				url: SERVER_ADDRESS +"roll",
				data: {
					clientID:clientID,
					turnID:0,
					cheat:{
						secret:"Dickson is dice king!",
						forceDice:forceDice
					}
				},
				success: function(msg){
					console.log(msg);
					moveIt();
				},
				error: function(msg){
					console.log(msg);
				},
				dataType: ""
			});
			function moveIt(){
				$.ajax({
					type: "POST",
					url: SERVER_ADDRESS +"start",
					data: {
						clientID:clientID,
						turnID:0,
						planeID:planeID
					},
					success: function(msg){
						console.log(msg);
						myTurn.runNextStep(4,{type:"moved",msg:msg});
					},
					error: function(msg){
						console.log(msg);
					},
					dataType: ""
				});
			}
		}
	};

	return serve;
})();




