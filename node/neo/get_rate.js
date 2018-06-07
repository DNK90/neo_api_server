const cfg = require("./util").load_env();
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
    neonjs.rpc.queryRPC(cfg.pythonRPC, rqBody).then(function(r) {

        let result = r.result;
        if (result.state.includes("HALT")) {
            let state = result.stack[0].value;

            console.log("state=" + neonjs.u.fixed82num(state));
            return neonjs.u.fixed82num(state);
        }
    }).catch(function(err) {
        console.log("err");
        console.log(JSON.stringify(err));
    });
};
