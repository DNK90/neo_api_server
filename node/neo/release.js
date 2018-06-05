const cfg = require('./config');
let neonjs = cfg.neonjs;
let contractAddress = cfg.contractAddress;
let net = cfg.net;
let account = cfg.account;


module.exports = function(_type, toAddress, amount) {

    if (account === undefined)
        throw("account is undefined");

    let intentArg = {};
    console.log(_type);

    if (amount <= 0) {
        throw("amount must be greater than 0");
    }

    if (_type.toLowerCase() === "3")
        intentArg["GAS"] = amount;
    else if (_type.toLowerCase() === "4")
        intentArg["NEO"] = amount;
    else
        throw("Invalid type");

    if (toAddress === "") {
        throw("toAddress is empty");
    }

    let intents = neonjs.api.makeIntent(intentArg, toAddress);

    let config = {
        url: "http://35.197.153.172:30333",
        net: net.neoscan,
        intents: intents,
        address: contractAddress,
        sendingFromSmartContract: true,
        publicKey: account.publicKey,
        signingFunction: function signTx(tx, publicKey) {
          return Promise.resolve(tx.sign(account.privateKey))
        },
        privateKey: account.privateKey,
        fees: 0.1
    };
    // return sendAsset(0, config);
    neonjs.api.sendAsset(config).then(function(result) {
        console.log(result);
    }).catch(function(err) {
        console.log(err);
    })
};
