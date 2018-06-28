const Web3 = require('web3');
const MAIN_ACCOUNT = '0x040040B7E137a0999B42A31bB085f95A354B53a1';
const SMC_ADDRESS = '0xbc9cef3ed845214373fb3e5971f5c9f0352f9c94'; //ropsten
const ABI_DEFINITION = require('./Master.json');

const PRIVATE_KEY =
    '0xb0b8b5a8199891fe81d9b830effdd9fc50dbfa3522fa15d20c5074c99b41b3bc';
const CHILD_SMC_ADDRESS = '0xc2e2179b99ed34b8bf94ac0065a5efe4de2e8e7d';

const providerHTTP = 'http://35.198.245.107:8545';

module.exports = async (to, amount) => {
    let web3 = new Web3(providerHTTP);
    let contract = new web3.eth.Contract(ABI_DEFINITION, SMC_ADDRESS);
    let query = contract.methods.forwardEvent(CHILD_SMC_ADDRESS, to, amount, 5);
    let encodedABI = query.encodeABI();
    let tx = {
        from: MAIN_ACCOUNT,
        to: SMC_ADDRESS,
        gas: 40000,
        data: encodedABI
    };

    web3.eth.accounts.signTransaction(tx, PRIVATE_KEY).then(signed => {
        let tran = web3.eth
            .sendSignedTransaction(signed.rawTransaction)
            .on('confirmation', (confirmationNumber, receipt) => {
                console.log('=> confirmation: ' + confirmationNumber);
            })
            .on('transactionHash', hash => {
                console.log('=> hash');
                console.log(hash);
            })
            .on('receipt', receipt => {
                console.log('=> receipt');
                console.log(receipt);
            })
            .on('error', console.error);
    });
};
