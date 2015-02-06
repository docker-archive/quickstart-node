var express = require('express');
var app = express();
var redis = require("redis");

var r;
if( process.env.QUICKSTARTNODE_REDIS_1_PORT && process.env.QUICKSTARTNODE_REDIS_1_ENV_REDIS_PASS ){
	var options = {
		auth_pass : process.env.QUICKSTARTNODE_REDIS_1_ENV_REDIS_PASS
	};

	var port = process.env.QUICKSTARTNODE_REDIS_1_PORT_6379_TCP_PORT;
	var host = process.env.QUICKSTARTNODE_REDIS_1_PORT_6379_TCP_ADDR;

	r = redis.createClient(port, host, options);
}else{
	r = redis.createClient();
}

app.get('/', function (req, res) {
	r.incr('counter', function (err, data) {
		if(err){return res.status(500).send(err);}

		res.send('Visits '+ data);
	});
});

app.get('/env', function (req, res) {
	res.json( process.env );
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});