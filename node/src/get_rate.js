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
    neonjs.rpc.queryRPC("http://localhost:5000", rqBody).then(function(r) {

        let result = r.result;
        if (result.state.includes("HALT")) {
            let state = Number.parseInt(neonjs.u.fixed82num(result.stack[0].value) * Math.pow(10, 8));
            console.log(state);
            return state
        }
    }).catch(function(err) {
        console.log(JSON.stringify(err));
    });
};
