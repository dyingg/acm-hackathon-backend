const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
var spawn = require("child_process").spawn; 

var children  = [];



let databse = {};

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
		if (!fs.existsSync(`home/anubhav26th/acm-hackathon-backend/model/${req.body.user}/`)) {
			fs.mkdirSync(`home/anubhav26th/acm-hackathon-backend/model/${req.body.user}/`);
			console.log("NEW USER!");
		}
		if (!fs.existsSync(`home/anubhav26th/acm-hackathon-backend/model/${req.body.user}/${req.body.class}`)) {
			fs.mkdirSync(`home/anubhav26th/acm-hackathon-backend/model/${req.body.user}/${req.body.class}`);	
			console.log("NEW gesture!");
		}
		fs.writeFile(`home/anubhav26th/acm-hackathon-backend/model/${req.body.user}/${req.body.class}/${Date.now()}.jpg`, Buffer.from(req.body, 'base64'), (err) => {
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

app.post('/done', (req, res) => { 
	if (req.body && req.body.id) {
		if (databse[ID]) {
			res.json({
				status: "done"
			})
		}
		else {
			res.json({
				status: "not done"
			})
		}
	}
});


app.post('/compile', (req, res) => {

	if (req.body && req.body.user) {

		const ID = Date.now();
		console.log("Starting model trainer!");
		databse[ID] = false;

		var process = spawn('python', [`./model/main.py`,
			`/home/anubhav26th/acm-hackathon-backend/model/${req.body.user}`,
			ID]); 
		
		
		process.on('exit', () => {
			console.log('MODEL TRAINING DONE');
			databse[ID] = true;
		});

		
		return res.json({
			status: "running",
			id: ID
		});


	}
});


app.listen(9090)



