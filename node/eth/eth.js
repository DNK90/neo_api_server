const Web3 = require('web3');
const MAIN_ACCOUNT = '0x040040B7E137a0999B42A31bB085f95A354B53a1';
const SMC_ADDRESS = '0x0eafcba1b44296183cd239357af0e11d3a2a8790'; //kai handler smc
const ABI_DEFINITION = require('./handler.json');

const PRIVATE_KEY =
  '0xb0b8b5a8199891fe81d9b830effdd9fc50dbfa3522fa15d20c5074c99b41b3bc';

const providerHTTP = 'http://35.198.245.107:8545';

module.exports = async (to, amount, type) => {
  var httpWeb3 = new Web3(providerHTTP);
  var contract = new httpWeb3.eth.Contract(ABI_DEFINITION, SMC_ADDRESS);

  var query = contract.methods.deposit(to, amount, type);
  var encodedABI = query.encodeABI();

  var tx = {
    from: MAIN_ACCOUNT,
    to: SMC_ADDRESS,
    gas: '40000',
    data: encodedABI
  };

  httpWeb3.eth.accounts.signTransaction(tx, PRIVATE_KEY).then(signed => {
    var tran = httpWeb3.eth
      .sendSignedTransaction(signed.rawTransaction)
      .on('confirmation', (confirmationNumber, receipt) => {
        console.log('=> confirmation: ' + confirmationNumber);
      })
      .on('transactionHash', hash => {
        console.log('=> hash');
        console.log(hash);
        //return hash;
      })
      .on('receipt', receipt => {
        console.log('=> reciept');
        console.log(receipt);
      })
      .on('error', console.error);
  });
};
