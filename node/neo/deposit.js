const cfg = require("./util").load_env();
const neonjs = cfg.neonjs;
let net = cfg.net;
let contract = cfg.contract;

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
  if (_type === cfg.GAS) {
      assetId = neonjs.CONST.ASSET_ID.GAS;
  }
  else if (_type === cfg.NEO) {
      assetId = neonjs.CONST.ASSET_ID.NEO;
  }
  else
      throw("invalid type");

  return new neonjs.tx.TransactionOutput({
    assetId: assetId,
    scriptHash: toScriptHash,
    value: new neonjs.u.Fixed8(amount)
  })
}


/**
asset is an JSON
{
  "type": "neo" or "gas",
  "amount": 100
}
**/
module.exports = function(_type, asset, receiver, account) {

    if (account === undefined)
      throw("account is undefined");

    let fromAddrScriptHash = neonjs.wallet.getScriptHashFromAddress(account.address);
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

    console.log(JSON.stringify(rqBody));

    neonjs.rpc.queryRPC(cfg.pythonRPC, rqBody).then(function(r) {
        let result = r.result;
        console.log(result.state);
        if (result.state.includes('BREAK')) {

            console.log(result.script);
            let tx_output = load_tx_output(cfg.GAS, result.gas_consumed, fromAddrScriptHash);
            let sent_asset = load_tx_output(asset.type, asset.amount / Math.pow(10, 8), contract);
            let intents = [tx_output, sent_asset];

            neonjs.api.doInvoke({
                url: cfg.pythonRPC,
                net: net.neoscan,
                intents: intents,
                script: result.script,
                address: account.address,
                publicKey: account.publicKey,
                signingFunction: function signTx(tx, publicKey) {
                  return Promise.resolve(neonjs.tx.signTransaction(tx, account.privateKey))
                },
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
