const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
var spawn = require("child_process").spawn; 

var children  = [];


process.on('exit', function() {
	console.log('killing', children.length, 'child processes');
	children.forEach(function(child) {
	  child.kill();
	});
});
  

app.use(bodyParser.json({
	limit: "50mb"
}));


app.get('/', (req, res) => {
	res.end('SINOUS API');
});


app.post('/resource', (req, res) => {
	if (req.body && req.body.image && req.body.user && req.body.class) {
		fs.writeFile(`/data/${req.body.user}`, Buffer.from(req.body, 'base64'), (err) => {
			if (err) {
				console.log(err);
			}
			else {
				console.log(`Recieved and saved image of user ${req.body.user}`);
			}
		})
	}
	else {
		return res.statusCode(403);
	}
});


app.post('/compile', (req, res) => {

	if (req.body && req.body.user) {

		const ID = Date.now();
		console.log("Starting model trainer!");

		var process = spawn('python', [`./model/main.py`,
			`/home/anubhav26th/acm-hackathon-backend/model/${req.body.user}`,
			ID]); 
		
		
		process.on('error', (data) => {
			console.log(data);
		})
		process.on('message', function (data) {
			console.log(data);
		})
		
		
		process.stdout.on('data', function(data) {
			console.log('data',new Buffer(data,'utf-8').toString());
		   // get fired but not for every write line
		});
		process.stdout.on('end', function(data) {
				console.log('end',new Buffer(data,'utf-8').toString());
				// not fired since the command does not close the stream until a `SIGINT`
		});

		process.on('exit', () => {
			console.log('MODEL TRAINING DONE');
		});

		
		return res.json({
			status: "running",
			id: ID
		});


	}
});


app.listen(9090)



