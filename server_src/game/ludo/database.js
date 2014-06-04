module.exports = function(mongoose, config){
	var wrapper = {};

	var db = mongoose.createConnection(config.mongodb.uri);
	db.on('error', console.error.bind(console, 'mongoose connection error: '));
	db.once('open', function () {
	  //and... we have a data store
	  console.log('[ludo/database.js] Debug: MongoDB connection opened');
	});

	wrapper.add = function(clientID,roomID){
		var ObjectID = db.ObjectID;

		db.collection('game').insert({
			_id: ObjectID,
			roomId: roomID
		}, 
		
		function (err, inserted) {
    	if ( err )
    		console.log(err);
    	else
    		console.log(inserted);
		});


	}
	wrapper.get = function (clientID){

	}
	return wrapper;
};