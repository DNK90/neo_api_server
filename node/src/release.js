const cfg = require('./config');
let account = cfg.account;
let neonjs = cfg.neonjs;
let contractAddress = cfg.contractAddress;
let net = cfg.net;

function signTx(tx, publicKey) {
    return Promise.resolve(tx.sign(cfg.account.privateKey));
} 


function sendAsset(idx, data) {
    if (idx < cfg.rpcUrl.local.length) {
        data["url"] = cfg.rpcUrl.local[idx];
        let weird = ["balance", "fees", "tx", "override", "response"];
        weird.forEach(function(el) {
            if (data[el]) delete data[el];
        });       

        console.log(JSON.stringify(data));

        cfg.neonjs.api.sendAsset(data)
        .then(function(result) {
            console.log(JSON.stringify(result.response));
            if (result.response.result === false) {
                sendAsset(++idx, data)
            }
            else {
                return result.response.txid;
            }
        })
        .catch(function(err) {
            console.log(err);
            sendAsset(++idx, data);
        });
    } else {
        return false;
    }
}


module.exports = function(_type, toAddress, amount) {

    let intentArg = {};
    console.log(_type);

    if (amount <= 0) {
        throw("amount must be greater than 0");
    }

    if (_type.toLowerCase() === "neo")
        intentArg["NEO"] = amount;
    else if (_type.toLowerCase() === "gas")
        intentArg["GAS"] = amount;
    else
        throw("Invalid type");

    if (toAddress === "") {
        throw("toAddress is empty");
    }

    let config = {
        net: net.neoscan,
        intents: neonjs.api.makeIntent(intentArg, toAddress),
        address: contractAddress,
        sendingFromSmartContract: true,
        publicKey: account.publicKey,
        privateKey: account.privateKey,
        signingFunction: signTx
    };
    return sendAsset(0, config);
};
