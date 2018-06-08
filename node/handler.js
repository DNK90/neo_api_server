let Neon = require('@cityofzion/neon-js');
let updateRate = require('./neo/update_rate');
let getRate = require('./neo/get_rate');
let deposit = require('./neo/deposit');
let release = require('./neo/release');
let eth = require('./eth/release');
let util = require('./neo/util');


function number(val) {
	console.log(val);
	if (isNaN(parseFloat(val))) 
		throw("amount must be a number");

	else
		return parseFloat(val);
}


function account(wif) {
	return new Neon.wallet.Account(wif);
}


module.exports = function(program) {


	let handler = program.handler;
	let releasedType = program.releasedType;
	let amount = program.amount;
	let transferredType = program.transferredType;
	let receiver = program.receiver;
	let privateKey = program.privateKey;

	if (program.enviroment) {
	    if (program.enviroment.toLowerCase() === "docker")
	        process.env["DOCKER"] = true;
	    else if (program.enviroment.toLowerCase() === "dev")
	        process.env["DOCKER"] = false;
	}

	let cfg = util.load_env();


	if (handler === "updateRate") {
		if (privateKey === undefined)
			throw("--private-key is required");

		if (releasedType === undefined || amount === undefined)
			throw("--released-type and --amount is required");

		if (amount <= 0)
			throw("--amount must be greater than 0");

		updateRate(releasedType, amount, account(privateKey));
	}
	else if (handler === "getRate") {
		if (releasedType === undefined)
			throw("--released-type is required");

		getRate(releasedType);
	}
	else if (handler === "deposit") {
		if (privateKey === undefined)
			throw("--private-key is required");

		if (releasedType === undefined || transferredType === undefined || amount === undefined || receiver === undefined)
			throw("--released-type, --transferred-type, --amount, --receiver are required");

		deposit(
	        releasedType,
	        {
	            type: transferredType,
	            amount: amount
	        }, receiver, account(privateKey)
	    );

	}
	else if (handler === "release") {

	    if (releasedType === undefined || amount === undefined || receiver === undefined) {
	        throw("--releasedType, --amount, --receiver are required");
	    }
	    if (amount <= 0)
	        throw("amount must be greater than 0");

	    if (releasedType.toLowerCase() === cfg.NEO || releasedType.toLowerCase() === cfg.GAS) {
	        release(releasedType, receiver, amount);
	    }
	    else if (releasedType === cfg.KAI) {
	        eth(receiver, amount * Math.pow(10, 18));
	    }
	}
}