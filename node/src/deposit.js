const cfg = require("./config");
const neonjs = cfg.neonjs;
let account = cfg.account;
let net = cfg.net;
let sb = new neonjs.sc.ScriptBuilder();

let fromAddrScriptHash = neonjs.wallet.getScriptHashFromAddress(account.address);
let contract = cfg.contract;
let gas = 2;

function signTx(tx, publicKey) {
    return Promise.resolve(neonjs.tx.signTransaction(tx, account.privateKey))
}

function load_tx_output(_type, amount, toScriptHash) {

  console.log("type of amount: " + typeof(amount));
  console.log(amount);

  if (typeof(amount) !== 'number') {
    amount = Number.parseFloat(amount);
  }

  if (amount <= 0) {
    throw("amount should be a number and greater than 0");
  }

  let assetId = "";
  switch(_type.toLowerCase()) {
    case "gas": assetId = neonjs.CONST.ASSET_ID.GAS; break;
    case "neo":
    default: assetId = neonjs.CONST.ASSET_ID.NEO
  }

  return new neonjs.tx.TransactionOutput({
    assetId: assetId,
    scriptHash: toScriptHash,
    value: new neonjs.u.Fixed8(amount)
  });
}


/**
asset is an JSON
{
  "type": "neo" or "gas",
  "amount": 100
}
**/
module.exports = function(_type, asset, receiver) {

    let rqBody = {
        method: "invoke",
        params: [
            contract,
            [
                {
                    "type": "String",
                    "value": "deposit"
                },
                {
                    "type": "Array",
                    "value": [
                        {
                            "type": "String",
                            "value": _type
                        },
                        {
                            "type": "String",
                            "value": receiver
                        }
                    ]

                }
            ]
        ]
    };

    console.log(rqBody);

    neonjs.rpc.queryRPC("http://35.197.153.172:5000", rqBody).then(function(r) {
        let result = r.result;
        console.log(result.state);
        if (result.state.includes('BREAK')) {

            console.log(result.script);
            let tx_output = load_tx_output("gas", result.gas_consumed, fromAddrScriptHash);
            let sent_asset = load_tx_output(asset.type, asset.amount, contract);
            let intents = [tx_output, sent_asset];

            neonjs.api.doInvoke({
                url: "http://35.197.153.172:5000",
                net: net.neoscan,
                intents: intents,
                script: result.script,
                address: account.address,
                publicKey: account.publicKey,
                signingFunction: signTx,
                privateKey: account.privateKey,
                gas: Math.ceil(result.gas_consumed),
                override: {
                    attributes: [
                        {
                            data: neonjs.u.hash160(neonjs.wallet.getVerificationScriptFromPublicKey(account.publicKey)),
                            usage: neonjs.tx.TxAttrUsage.Script
                        }
                    ]
                }
            }).then(function(d) {
                console.log(JSON.stringify(d));
            }).catch(function(err) {
                console.log(JSON.stringify(err));
            })
        }
    });
};
