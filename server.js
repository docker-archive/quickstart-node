var express = require('express');
var app = express();
var redis = require("redis");
var os = require("os");
var time = require('time');

var r;
var counter;
var options = {
	max_attempts : null
};
var redisConnected = false;

var port = 6379;
var host = 'redis';

if (process.env.REDIS_ENV_REDIS_PASS != '**None**') {
	options.auth_pass = process.env.REDIS_ENV_REDIS_PASS;
}

r = redis.createClient(port, host, options);

// Check if Redis is connected
r.on('error', function (err){
	// console.log('Redis not found or failed to connect: ', err);
	redisConnected = false;
});

r.on('connect', function(){
	console.log('Connected to Redis');
	redisConnected = true;
});

app.get('/', function (req, res) {

	// Variable for Redis to keep track of visit counter
	console.log('%s handled HTTP REQUEST on %s', os.hostname(), time.Date());

	if(redisConnected){
		r.incr('counter', function (err, data) {
		if(err){return res.status(500).send(err);}
		counter = data;
		console.log('Visit counter %s', counter)
		});
	}else{
		counter = 'Counter disabled. Redis unavailable or not found.';
		console.log(counter);
	}	

	res.send('Hello ' + process.env.NAME + '!</br> <b>Hostname: </b>' + os.hostname() + '<br/><b>Visits: </b>' + counter);
});

// Display all environment variables for this container
app.get('/env', function (req, res) {
	res.json( process.env );
});

var server = app.listen(80, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Listening on port 80 for requests...');
});