module.exports = (function(){
	function createRoom(roomID) {
		var c = console;

		// write all that into gameState bundle
		var gameState = {
			createTime: new Date(),
			roomID:roomID,
			players: {},
			board: [
				{
					start: 3,
					cut1: 20,
					cut2: 32,
					fin: 0
				},
				{
					start: 16,
					cut1: 33,
					cut2: 45,
					fin: 13
				},
				{
					start: 29,
					cut1: 46,
					cut2: 6,
					fin: 26
				},
				{
					start: 42,
					cut1: 7,
					cut2: 19,
					fin: 39
				}
			],
			planes: [
				[{
					zone: "home",
					place: -1
				}, {
					zone: "home",
					place: -1
				}, {
					zone: "home",
					place: -1
				}, {
					zone: "home",
					place: -1
				}],
				[{
					zone: "home",
					place: -1
				}, {
					zone: "home",
					place: -1
				}, {
					zone: "home",
					place: -1
				}, {
					zone: "home",
					place: -1
				}],
				[{
					zone: "home",
					place: -1
				}, {
					zone: "home",
					place: -1
				}, {
					zone: "home",
					place: -1
				}, {
					zone: "home",
					place: -1
				}],
				[{
					zone: "home",
					place: -1
				}, {
					zone: "home",
					place: -1
				}, {
					zone: "home",
					place: -1
				}, {
					zone: "home",
					place: -1
				}],
			],
			flags: {
				turnID: 0,
				countSix: 0,
				dice:0,
				canMove: [],
				canStart: []
			},
			history: [],
			addPlayer: function(clientID,side){
				for(ids in this.players){
					if(this.players[ids]==side){
						console.log("room.addPlayer: Side has been taken");
						return false;
					}
				}
				this.players[clientID]=side;
				return true;
			},
			colorToLetter:function(i){
				var color = ["R","Y","G","B"];
				return color[i];
			},
			letterToColor:function(i){
				var color = {"R":0,"Y":1,"G":2,"B":3};
				return color[i];
			},
			setTurn:function(t){
				if(devMode != "Dickson is priceless!"){
					c.log("setTurn() is not allowed");
					return;
				}
				this.flags.turnID = t;
				c.log("setTurn: %s (%s)",this.flags.turnID.toString(),this.colorToLetter(this.flags.turnID%4));

			},
			put:function(color,index,location){
				if(devMode != "Dickson is handsome!"){
					c.log("put() is not allowed");
					return;
				}
				this.planes[color][index] = 
					{zone:location.zone,
					place:location.place};
				console.log("put %s%s: %s",this.colorToLetter(color),index, JSON.stringify(this.planes[color][index]));
				return true;
			},
			clearSix:function(){
				if(devMode != "Dickson is dice king!"){
					c.log("clearSix() is not allowed");
					return;
				}
				this.flags.countSix=0;
			},
			isFlying:function(color,index){
				return (
					(this.planes[color][index].zone=="started") ||
					(this.planes[color][index].zone=="ring") ||
					(this.planes[color][index].zone=="final")
				);
			},
			getCanStart:function(color){
				var result = [];
				for(index in this.planes[color]){
					if(this.planes[color][index].zone=="home"){
						result.push(index);
					}
				}
				return result;
			},
			isMyCut:function(place, color){
				return(place.zone=="ring" && place.place==this.board[color].cut1);
			},
			isMyColor:function(place,color){
				var finalHopColor = place.place%4;
				console.log("landed on %s(%s) tile.",finalHopColor,this.colorToLetter(finalHopColor));
				return (finalHopColor == color);
			},
			getCanMove:function(color){
				var result = [];
				for(index in this.planes[color]){
					if( this.isFlying(color,index) ){
						result.push(index);
					}
				}
				return result;
			},
			/**
			 * moves the plane, returning its next hop as {zone,place}
			 */
			getNextHop:function(color,index,forward){
				var result = {zone:"",place:-1};
				var p = this.planes[color][index];

				switch(p.zone){
				case "started":
					p.zone = "ring";
					p.place = this.board[color].start;
					break;

				case "ring":
					if(p.place == this.board[color].fin){// need to turn
						p.zone = "final";
						p.place = 1;
					}else{	// only need to care about place 51
						p.zone = "ring";
						p.place = (p.place==51? 0: p.place+1);
					}
					break;

				case "final":
					p.zone = "final";
					if(forward[0]){	// forward
						if(p.place==6){
							p.place=5;
							forward[0]=false;
						}else if(p.place==1){
							p.place=2;
							forward[0]=true;
						}else{
							p.place = p.place+1;
						}
					}else{			// already backward
						p.place = p.place-1;
					}
					break;

				default:
					c.log("illegal call of getNextHop()");
					return {};
				}

				return p;
			},
			/**
			 * jumps the plane, returning its next hop as {zone,place}
			 */
			getNextJump:function(color,index){
				var result = {zone:"",place:-1};
				var p = this.planes[color][index];
				if(p.zone!="ring"){
					c.log("jump can only happen in rings");
					return {};
				}
				result.zone = p.zone;
				result.place = (p.place+4)%52;

				return result;
			},
			getNextCut:function(color,index){
				var p = this.planes[color][index];
				p.zone="ring"
				p.place=this.board[color].cut2;
				return p;
			},
			getPlanesAt:function(location,myself,includeMe){
				var result={friend:[],enemy:[]};
				includeMe = includeMe || false;
				var target;	// recycled

				// complexity: will always run 16 times
				for(var color in [0,1,2,3]){
					target=(color == myself.color? result.friend: result.enemy);
					for(var planeID in [0,1,2,3]){
						if(! includeMe)
							if(color==myself.color && planeID == myself.index)
								continue;
						if(this.planes[color][planeID].zone==location.zone)
							if(this.planes[color][planeID].place==location.place)
								target.push({color:color,index:planeID});
					}
				}
				return result;
			},
			getCutVictims:function(myColor){
				var result=[];
				var cutRelations = [2,3,0,1];
				var color = cutRelations[myColor];
				for(var planeID in [0,1,2,3]){
					if(this.planes[color][planeID].zone=="final" &&
						this.planes[color][planeID].place==3){
						result.push({color:color,index:planeID});
					}
				}
				return result;
			},
			/**
			 * kills a plane, sending it to home
			 * @param  {color,index} victim the plane to be sent home
			 * @return {[type]}        [description]
			 */
			kill:function(victim){
				this.planes[victim.color][victim.index] = 
					{zone:"home",place:-1};
				return true;
			},
			killAllPlanes:function(color){
				console.log("kill all planes: %s",color);
				for(index in this.planes[color]){
					if(this.isFlying(color,index)){
						this.kill(color,index);
						console.log("killed %s%s",this.colorToLetter(color),index);
					}
				}
			},
			isGameEnded:function(){

			},
			getSnapshot:function(){
				var result = {
					planes: this.planes,
					flags: this.flags,
					history: this.history,
				};
				return result;
			}
		};

		return gameState;

	}





	var rooms = {
		list:{},
		count:0
	};

	/**
	 * gets a room from itself, creating a new one if not yet done
	 * @param  {[type]} roomID [description]
	 * @return {[type]}        [description]
	 */
	rooms.get = function(roomID){
		if(this.list.hasOwnProperty(roomID)){
			return this.list[roomID];
		}else{
			this.list[roomID] = createRoom(roomID);
			this.count++;
			return this.list[roomID];
		}
	}
	rooms.close = function(roomID){
		delete this.list[roomID];
		this.count--;
	}
	rooms.clear = function(){
		this.list={};
		this.count=0;
	}
	return rooms;

})();