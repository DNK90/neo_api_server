const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
const fileSystem = require('fs');
const path = require('path');
let release = require('./src/release');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.post('/release', (req, res) => {
	let params = req.body;
	console.log(params);

	let type = params.type;
	let amount = params.amount;
	let receiver = params.receiver;

	if (type === undefined || amount === undefined || receiver === undefined) {
		return internalException("type, amount and receiver is require");
	}

	release(type, receiver, amount).then(function(r) {
        if (r === false) {
            res.status(500);
            res.send(res);
        }
        else {
            res.status(200);
            res.send(r);
        }
	});

	// });

});


function internalException(res, msg) {
	res.status(500);
	res.send(msg);
}

app.listen(3000, () => console.log('NEO Service is listening on port 3000!'));
