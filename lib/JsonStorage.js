var MongoClient = require('mongodb').MongoClient, ObjectID = require('mongodb').ObjectID;

var JsonStorage = function() {
	this.db = null;
	this.collection = null;

	MongoClient.connect('mongodb://127.0.0.1:27017/argufactum', function(err, _db) {
		if (err)
			throw err;
		this.db = _db;
		this.collection = _db.collection('topics');
	});

	this.get = function(id, callback) {
		collection.find({
			'_id': new ObjectID(id)
		}).nextObject(callback);
	};

	this.add = function(data, callback) {
		collection.insert(data, {
			safe: true
		}, callback);
	};
};

module.exports = JsonStorage;