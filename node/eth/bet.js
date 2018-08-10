var Web3 = require('web3');
const providerHTTP = 'http://35.198.207.57:8545';
const kardiaWeb3 = new Web3(providerHTTP);

const account = {
  address: '0x329A2423852033071a08C241a12b81d555e10725',
  privateKey:
    '0x2886cab6bbefa542a6e23bc0e9b56ea47b03a5b44891d4ba894332ab9986c647'
};

const updateBetOnKardia = async (
  childAddr,
  candidate,
  neoValue,
  voter
) => {
  const networkName =
    '0x6e656f0000000000000000000000000000000000000000000000000000000000';
  const kardiaWeb3 = new Web3(providerHTTP);
  const kardiaMasterAddr = '0x148b78bb97ef5e42d0f92c080a1dda836c80be83';
  const ABI_TOOLKIT = require('./MasterKardia.json');
  const kardiaContract = new kardiaWeb3.eth.Contract(
    ABI_TOOLKIT.abi,
    kardiaMasterAddr
  );
  console.log('kardiaMasterAddr', kardiaMasterAddr);
  console.log('childAddr', childAddr);
  console.log('candidate', candidate);
  console.log('neoValue', neoValue);
  // temp hardcode 10neo = 1 kai
  let kardiaValue = neoValue / Math.pow(10, 9); //kai
  kardiaValue = kardiaWeb3.utils.toWei(kardiaValue.toString()); //convert to wei
  const query = kardiaContract.methods.onBet(
    childAddr,
    candidate,
    kardiaValue,
    networkName,
    neoValue,
    voter
  );
  const encodedABI = query.encodeABI();
  // console.log(encodedABI);
  const gas = await kardiaContract.methods
    .onBet(childAddr, candidate, kardiaValue, networkName, neoValue, voter)
    .estimateGas();
  console.log(gas);

  const tx = {
    from: account.address,
    to: kardiaMasterAddr,
    gas: gas + 50000,
    data: encodedABI
  };

  const signed = await kardiaWeb3.eth.accounts.signTransaction(
    tx,
    account.privateKey
  );
  const receipt = await kardiaWeb3.eth.sendSignedTransaction(
    signed.rawTransaction
  );
  return receipt.transactionHash;
};
module.exports = updateBetOnKardia;

// updateBetOnKardia('0x993F8767be9655B14b66d6FFc8A7453B7Fb7c427', '0x3200000000000000000000000000000000000000000000000000000000000000', 10, 'voter');
