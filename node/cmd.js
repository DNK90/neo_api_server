const program = require('commander');
let updateRate = require('./src/update_rate');
let getRate = require('./src/get_rate');
let deposit = require('./src/deposit');
let release = require('./src/release');


function number(val) {
	console.log(val);
	if (isNaN(parseFloat(val))) 
		throw("amount must be a number");

	else
		return parseFloat(val);
}


program
	.version('0.1.0')
	.option('-h, --handler <type>', 'handler: updateRate | getRate | deposit | release')
	.option('-rt, --released-type <type>', 'type which is released to, required if handler is deposit, release or updateRate')
	.option('-a, --amount <type>', 'amount of released type or transfered type', number)
	.option('-t, --transferred-type <type>', 'transferred type: neo or gas')
	.option('-r, --receiver <type>', 'receiver address, required if handler is deposit or release')
	.parse(process.argv);


let handler = program.handler;
let releasedType = program.releasedType;
let amount = program.amount;
let transferredType = program.transferredType;
let receiver = program.receiver;

if (handler === "updateRate") {
	if (releasedType === undefined || amount === undefined)
		throw("--released-type and --amount is required");
	if (amount <= 0)
		throw("--amount must be greater than 0");

	updateRate(releasedType, amount);
}
else if (handler === "getRate") {
	if (releasedType === undefined)
		throw("--released-type is required");

	getRate(releasedType);
}
else if (handler === "deposit") {
	if (releasedType === undefined || transferredType === undefined || amount === undefined || receiver === undefined)
		throw("--released-type, --transferred-type, --amount, --receiver are required");

	if (transferredType.toLowerCase() !== "neo" && transferredType.toLowerCase() !== "gas")
		throw("--transferred-type must be neo or gas");

	deposit(
        releasedType,
        {
            type: transferredType,
            amount: amount
        }, receiver
    );

}
else if (handler === "release") {
	if (releasedType === undefined || amount === undefined || receiver === undefined) {
		throw("--releasedType, --amount, --receiver are required");
	}

	if (amount <= 0) {
		throw("amount must be greater than 0");
	}

	release(releasedType, receiver, amount);
}
