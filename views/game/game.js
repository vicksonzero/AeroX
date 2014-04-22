var game = (function(){
	var game = {
		flags: {
			turnID: 0,
			countSix: 0,
			dice:0,
			canMove: [],
			canStart: [],
			movingFlag:["NA","NA","NA","NA"], // NA, move, start
			haveFinals:false,
			haveCutKills:false
		},
		avatar:null,
		hops:[],
		finals:[],
		eat:[]
	};

	return game;
})();