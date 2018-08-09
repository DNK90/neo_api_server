const neonjs = require('@cityofzion/neon-js');

let WIF_KEY = "KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr";
let account = new neonjs.wallet.Account(WIF_KEY);
let contract = "56825a1bb0a83b179f68ded8eb942a350ccf510e";
let votingContract = "fb0ee411f0e4a2a8efd1f09edca45608422fa2d5";
let betContract = "e30caf8ae757f9807b9aae2cd4160958c8d3f4d2";
let contractAddress = "AH5b7MhMTaCxyLQyFCSQnLJkYwx8bqjGNA";
let validType = ["1", "3", "4", "5"];

// you can choose either neondb or neoscan,
// there is a switch function that will automatically switch between neoscan (v1) and neondb (v2) if exception is thrown
let net = {
    neoscan: "http://localhost:4000/api/main_net",
    neondb: "http://localhost:5000"
};

let rpcUrl = {
    local: [
        "http://localhost:30333",
        "http://localhost:30334",
        "http://localhost:30335",
        "http://localhost:30336"
    ]
};

module.exports = {
    neonjs: neonjs,
    account: account,
    net: net,
    rpcUrl: rpcUrl,
    pythonRPC: 'http://localhost:5000',
    contract: contract,
    votingContract: votingContract,
    betContract: betContract,
    contractAddress: contractAddress,
    retry: 5,
    validType: validType,
    NEO: "3",
    GAS: "4",
    KAI: "5",
    ETH: "1"
};

