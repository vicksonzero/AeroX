var board = {};
board.indexToColor = ["R","Y","G","B"];
board.ring = [
	{"x":724,"y":378},
	{"x":725,"y":425},
	{"x":725,"y":472},
	{"x":712,"y":521},
	{"x":661,"y":542},
	{"x":614,"y":542},
	{"x":566,"y":521},
	{"x":529,"y":564},
	{"x":546,"y":612},
	{"x":546,"y":660},
	{"x":528,"y":712},
	{"x":477,"y":728},
	{"x":430,"y":728},
	{"x":383,"y":728},
	{"x":334,"y":728},
	{"x":288,"y":728},
	{"x":238,"y":712},
	{"x":219,"y":660},
	{"x":219,"y":612},
	{"x":241,"y":564},
	{"x":202,"y":526},
	{"x":151,"y":542},
	{"x":103,"y":542},
	{"x":52,"y":523},
	{"x":38,"y":472},
	{"x":38,"y":425},
	{"x":38,"y":378},
	{"x":38,"y":330},
	{"x":38,"y":283},
	{"x":56,"y":236},
	{"x":106,"y":216},
	{"x":153,"y":216},
	{"x":204,"y":237},
	{"x":238,"y":195},
	{"x":221,"y":149},
	{"x":221,"y":103},
	{"x":239,"y":54},
	{"x":289,"y":40},
	{"x":335,"y":40},
	{"x":381,"y":40},
	{"x":427,"y":40},
	{"x":473,"y":40},
	{"x":520,"y":55},
	{"x":541,"y":103},
	{"x":541,"y":149},
	{"x":521,"y":195},
	{"x":564,"y":234},
	{"x":611,"y":216},
	{"x":656,"y":216},
	{"x":707,"y":235},
	{"x":723,"y":285},
	{"x":724,"y":331}
];

// source of players home position
board.home = {
	//source of Player 0 (Red) home position
	R: [
		{"x":637,"y":635},
		{"x":725,"y":634},
		{"x":637,"y":725},
		{"x":725,"y":725}
	],

	// source of Player 1 (Yellow) home position
	Y: [
		{"x":38,"y":634},
		{"x":127,"y":635},
		{"x":37,"y":725},
		{"x":127,"y":726}
	],
	
	// source of Player 2 (Green) home position
	G: [
		{"x":47,"y":43},
		{"x":134,"y":42},
		{"x":45,"y":128},
		{"x":133,"y":128}
	],
	
	// source of Player 3 (Blue) home position
	B: [
		{"x":628,"y":43},
		{"x":715,"y":44},
		{"x":630,"y":129},
		{"x":718,"y":129}
	]

};
board.start = {
	// source of Player 0 (Red) final position
	R: {"x":749,"y":558},
	
	// source of Player 1 (Yellow) final position
	Y:{"x":196,"y":744},
	
	// source of Player 2 (Green) final position
	G: {"x":20,"y":199},
	
	//source of Player 3 (Blue) final position
	B: {"x":559,"y":23}
};


// source of players final
board.final = {
	// source of Player 0 (Red) final position
	R: [
		{"x":724,"y":378},
		{"x":663,"y":378},
		{"x":617,"y":378},
		{"x":564,"y":378},
		{"x":519,"y":378},
		{"x":475,"y":378},
		{"x":425,"y":378}
	],
	
	// source of Player 1 (Yellow) final position
	Y: [
		{"x":383,"y":728},
		{"x":383,"y":665},
		{"x":383,"y":617},
		{"x":383,"y":564},
		{"x":383,"y":518},
		{"x":383,"y":472},
		{"x":383,"y":421}
	],
	
	// source of Player 2 (Green) final position
	G: [
		{"x":38,"y":378},
		{"x":100,"y":378},
		{"x":147,"y":378},
		{"x":200,"y":378},
		{"x":245,"y":378},
		{"x":290,"y":378},
		{"x":340,"y":378}
	],
	
	//source of Player 3 (Blue) final position
	B: [
		{"x":381,"y":40},
		{"x":381,"y":99},
		{"x":381,"y":145},
		{"x":381,"y":195},
		{"x":381,"y":240},
		{"x":381,"y":285},
		{"x":381,"y":334}
	]
};
board.planesDiv = {
	R:[
	],
	
	Y:[
	],
	
	G:[
	],
	
	B:[
	]

};

// Players information
board.planesAttr = {
	R:[
		{"zone": "home", "place":-1},
		{"zone": "home", "place":-1},
		{"zone": "home", "place":-1},
		{"zone": "home", "place":-1}
	],
	
	Y:[
		{"zone": "home", "place":-1},
		{"zone": "home", "place":-1},
		{"zone": "home", "place":-1},
		{"zone": "home", "place":-1}
	],
	
	G:[
		{"zone": "home", "place":-1},
		{"zone": "home", "place":-1},
		{"zone": "home", "place":-1},
		{"zone": "home", "place":-1}
	],
	
	B:[
		{"zone": "home", "place":-1},
		{"zone": "home", "place":-1},
		{"zone": "home", "place":-1},
		{"zone": "home", "place":-1}
	]
};

function scaled(i){
	return $("#board").width() * i / 800;
}

$(document).ready(function(){
	// boxes
	var $boxes = $("#boxes");
	for(var r=0; r < board.ring.length; r++){
		var p = document.createElement("div");
		p.className = "places ring color-"+board.indexToColor[r%4];
		p.dataset.index = r;
		$boxes.append(p);
		$(p).offset({
			left:scaled(board.ring[r].x),
			top:scaled(board.ring[r].y)
		}).html(r);
	}

	// finals
	for(var i in board.indexToColor){
		for(var r=0; r < board.final[board.indexToColor[i]].length; r++){
			var p = document.createElement("div");
			p.className = "places final color-"+board.indexToColor[i];
			p.dataset.color = board.indexToColor[i];
			p.dataset.index = r;
			$boxes.append(p);
			$(p).offset({
				left:scaled(board.final[board.indexToColor[i]][r].x),
				top:scaled(board.final[board.indexToColor[i]][r].y)
			}).html(r);
		}
	}

	// players
	for(var i in board.indexToColor){
		for(var r=0; r <4; r++){
			var p = document.createElement("div");
			p.id = ""+board.indexToColor[i]+r;
			p.className = "plane planeColor-"+board.indexToColor[i];
			p.dataset.color = board.indexToColor[i];
			p.dataset.index = r;
			board.planesDiv[board.indexToColor[i]].push(p);
			$boxes.append(p);
			$(p).offset({
				left:scaled(board.home[board.indexToColor[i]][r].x),
				top:scaled(board.home[board.indexToColor[i]][r].y)
			});
		}
	}
	
	startGame();
});