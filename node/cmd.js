let Neon = require('@cityofzion/neon-js');
const program = require('commander');
let updateRate = require('./neo/update_rate');
let getRate = require('./neo/get_rate');
let deposit = require('./neo/deposit');
let release = require('./neo/release');
let eth = require('./eth/release');


function number(val) {
	console.log(val);
	if (isNaN(parseFloat(val))) 
		throw("amount must be a number");

	else
		return parseFloat(val);
}


function account(wif) {
	return new Neonjs.wallet.Account(wif);
}


program
	.version('0.1.0')
	.option('-h, --handler <type>', 'handler: updateRate | getRate | deposit | release')
	.option('-rt, --released-type <type>', 'type which is released to, required if handler is deposit, release or updateRate')
	.option('-a, --amount <type>', 'amount of released type or transfered type', number)
	.option('-t, --transferred-type <type>', 'transferred type: neo or gas')
	.option('-r, --receiver <type>', 'receiver address, required if handler is deposit or release')
	.option('-p, --private-key <type>', 'private key')
	.parse(process.argv);


let handler = program.handler;
let releasedType = program.releasedType;
let amount = program.amount;
let transferredType = program.transferredType;
let receiver = program.receiver;
let privateKey = program.privateKey;


if (handler === "updateRate") {
	if (wif === undefined) 
		throw("--private-key is required");

	if (releasedType === undefined || amount === undefined)
		throw("--released-type and --amount is required");

	if (amount <= 0)
		throw("--amount must be greater than 0");

	updateRate(releasedType, amount, account(wif));
}
else if (handler === "getRate") {
	if (releasedType === undefined)
		throw("--released-type is required");

	getRate(releasedType);
}
else if (handler === "deposit") {
	if (wif === undefined) 
		throw("--private-key is required");

	if (releasedType === undefined || transferredType === undefined || amount === undefined || receiver === undefined)
		throw("--released-type, --transferred-type, --amount, --receiver are required");

	if (transferredType.toLowerCase() !== "neo" && transferredType.toLowerCase() !== "gas")
		throw("--transferred-type must be neo or gas");

	deposit(
        releasedType,
        {
            type: transferredType,
            amount: amount
        }, receiver, account(wif)
    );

}
else if (handler === "release") {

    if (releasedType === undefined || amount === undefined || receiver === undefined) {
        throw("--releasedType, --amount, --receiver are required");
    }
    if (amount <= 0)
        throw("amount must be greater than 0");

    if (releasedType.toLowerCase() === "3" || releasedType.toLowerCase() === "4") {
        if (releasedType === "3")
            releasedType = "neo";
        else
            releasedType = "gas";
        release(releasedType, receiver, amount);
    }
    else if (releasedType === "5") {
        eth(receiver, amount);
    }

}
