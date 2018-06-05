const cfg = require("./config");
const neonjs = cfg.neonjs;
let net = cfg.net;
let contract = cfg.contract;
let gas = 2;


/**

if amount is 1000 => rate is 1000/Math.pow(10, 8)

**/
// updateRate("eth", 1000);

module.exports = function(_type, amount, account) {

    if (account === undefined)
      throw("account is undefined");

    let fromAddrScriptHash = neonjs.wallet.getScriptHashFromAddress(account.address);

    neonjs.rpc.queryRPC("http://35.197.153.172:5000", {
        method: "invoke",
        params: [
            contract,
            [
                {
                    "type": "String",
                    "value": "updateRate"
                },
                {
                    "type": "Array",
                    "value": [
                        {
                            "type": "String",
                            "value": _type
                        },
                        {
                            "type": "Integer",
                            "value": amount
                        }
                    ]

                }
            ]
        ]
    }).then(function(r) {
        let result = r.result;
        console.log(result.state.includes('HALT'));
        if (result.state.includes('HALT')) {

            console.log(result.script);
            let tx_output = new neonjs.tx.TransactionOutput({
                assetId: neonjs.CONST.ASSET_ID.GAS,
                scriptHash: fromAddrScriptHash,
                value: new neonjs.u.Fixed8(result.gas_consumed)
            });

            let intents = [tx_output];

            neonjs.api.doInvoke({
                url: "http://35.197.153.172:5000",
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
                return d;
            }).catch(function(err) {
                console.log(JSON.stringify(err));
                throw(err);
            })
        }
    });

};
