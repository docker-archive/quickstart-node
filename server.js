var express = require('express');
var app = express();
var redis = require("redis");

var r;
var options = {
	max_attempts : 1
};
var redisConnected = false;

if( process.env.REDIS_PORT && process.env.REDIS_ENV_REDIS_PASS ){
	options.auth_pass = process.env.REDIS_ENV_REDIS_PASS;

	var port = process.env.REDIS_PORT_6379_TCP_PORT;
	var host = process.env.REDIS_PORT_6379_TCP_ADDR;

	r = redis.createClient(port, host, options);
}else{
	r = redis.createClient(null, null, options);
}

r.on('error', function(err){
	console.log('Error on redis', err);
});

r.on('connect', function(){
	redisConnected = true;
});

app.get('/', function (req, res) {
	if(!redisConnected){
		return res.send('No conection to redis');
	}

	r.incr('counter', function (err, data) {
		if(err){return res.status(500).send(err);}

		res.send('Visits '+ data);
	});
});

app.get('/env', function (req, res) {
	res.json( process.env );
});

var server = app.listen(process.env.PORT || 3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
