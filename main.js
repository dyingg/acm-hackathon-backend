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

		var process = spawn('python',['-u', "./mobilenet/main.py", 
		req.body.username, 
			ID]); 
		
		
		process.on('error', (data) => {
			console.log(data);
		})
		process.stdout.on('data', function (data) {
			console.log(data.toString());
		});

		process.stdout.on('error', function (err) {
			console.log(err);
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



