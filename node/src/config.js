const neonjs = require('@cityofzion/neon-js');

let WIF_KEY = "KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr";
let account = new neonjs.wallet.Account(WIF_KEY);
let contract = "56825a1bb0a83b179f68ded8eb942a350ccf510e";
let contractAddress = "AH5b7MhMTaCxyLQyFCSQnLJkYwx8bqjGNA";

// you can choose either neondb or neoscan,
// there is a switch function that will automatically switch between neoscan (v1) and neondb (v2) if exception is thrown
let net = {
    neoscan: "http://35.197.153.172:4000/api/main_net",
    neondb: "http://35.197.153.172:5000"
};

let rpcUrl = {
    local: [
        "http://35.197.153.172:30333",
        "http://35.197.153.172:30334",
        "http://35.197.153.172:30335",
        "http://35.197.153.172:30336"
    ]
};

module.exports = {
  neonjs: neonjs,
  account: account,
  net: net,
  rpcUrl: rpcUrl,
  contract: contract,
  contractAddress: contractAddress,
  retry: 5
};

