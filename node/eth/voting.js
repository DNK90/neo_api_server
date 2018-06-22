var Web3 = require('web3');
const providerHTTP = 'http://35.198.207.57:8545';
const web3Http = new Web3(providerHTTP);

const account = {
  address: '0x329A2423852033071a08C241a12b81d555e10725',
  privateKey:
    '0x2886cab6bbefa542a6e23bc0e9b56ea47b03a5b44891d4ba894332ab9986c647'
};

module.exports = async (childAddr, voter, candidate) => {
  //neo network code
  const networkName =
    '0x6e656f0000000000000000000000000000000000000000000000000000000000';
  const ABI_TOOLKIT = require('./Voting.json');
  const kardiaContract = new web3Http.eth.Contract(ABI_TOOLKIT.abi, childAddr);
  const query = kardiaContract.methods.vote(candidate, voter, networkName);
  const encodedABI = query.encodeABI();

  const gas = await kardiaContract.methods
    .vote(candidate, voter, networkName)
    .estimateGas();
  // console.log(gas);
  const tx = {
    from: account.address,
    to: childAddr,
    gas: gas + 50000,
    data: encodedABI
  };

  const signed = await web3Http.eth.accounts.signTransaction(
    tx,
    account.privateKey
  );
  const receipt = await web3Http.eth.sendSignedTransaction(
    signed.rawTransaction
  );
  // console.log(receipt);
  return receipt.transactionHash;
};
