let program = require('commander');
let handler = require('./handler');

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


handler(program);
