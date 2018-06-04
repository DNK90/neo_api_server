const cfg = require("./config");
const neonjs = cfg.neonjs;
let contract = cfg.contract;

module.exports = function(_type) {
    let rqBody = {
        method: "invoke",
        params: [
            contract,
            [
                {
                    "type": "String",
                    "value": "getRate"
                },
                {
                    "type": "Array",
                    "value": [
                        {
                            "type": "String",
                            "value": _type
                        }
                    ]
                }
            ]
        ]
    }
    console.log(JSON.stringify(rqBody));
    neonjs.rpc.queryRPC("http://35.197.153.172:5000", rqBody).then(function(r) {

        let result = r.result;
        if (result.state.includes("HALT")) {
            let state = result.stack[0].value;

            console.log("state=" + state);
            return state
        }
    }).catch(function(err) {
        console.log("err");
        console.log(JSON.stringify(err));
    });
};
