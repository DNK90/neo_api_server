let Neon = require('@cityofzion/neon-js');
let program = require('commander');
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


program
	.version('0.1.0')
	.option('-h, --handler <type>', 'handler: updateRate | getRate | deposit | release')
	.option('-rt, --released-type <type>', 'type which is released to, required if handler is deposit, release or updateRate')
	.option('-a, --amount <type>', 'amount of released type or transfered type', number)
	.option('-t, --transferred-type <type>', 'transferred type: neo or gas')
	.option('-r, --receiver <type>', 'receiver address, required if handler is deposit or release')
	.option('-p, --private-key <type>', 'private key')
    .option('-env, --environment <type>', 'override environment dev or docker')
	.parse(process.argv);


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
        eth(receiver, amount);
    }

}
