var express = require('express'), JsonStorage = require('./lib/JsonStorage.js');
var app = express();
var storage = new JsonStorage();

// Configuration
app.enable('trust proxy');

// Middleware
app.use(express.logger());
app.use(express.bodyParser());

// Routing
app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.get('/topic/:id', function(req, res, next) {
	storage.get(req.params.id, function(err, doc) {
		if (err)
			throw err;
		if (!doc) {
			res.send(404);
		} else {
			delete doc['adminKey'];
			res.send(doc);
		}
	});
});

app.post('/topic', function(req, res, next) {
	var topic = req.body;
	topic.adminKey = Math.random().toString(36).slice(-8);

	storage.add(topic, function(err, docs) {
		if (err)
			throw err;
		res.send({
			'id': docs[0]._id,
			'adminKey': docs[0].adminKey
		});
	});
});

app.post('/topic/:id', function(req, res, next) {
	storage.get(req.params.id, function(err, doc) {
		if (err)
			throw err;
		if (!doc) {
			res.send(404);
		} else if (doc.adminKey !== req.query.a) {
			res.send(401);
		} else {
			storage.update(req.params.id, req.body, function(err, docs) {
				if (err)
					throw err;
				res.send({
					'id': req.params.id
				});
			});
		}
	});
});

// Middleware
var errorHandler = function(err, req, res, next) {
	if (!err)
		return next();
	console.error(err.stack);
	res.send(500, {
		error: '500'
	});
};
app.use(errorHandler);

// Start
app.listen(8444, 'localhost');
console.log('Listening on localhost:8444');