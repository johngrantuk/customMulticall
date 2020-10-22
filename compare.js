require('dotenv').config();
const { ethers } = require("ethers");
const { JsonRpcProvider } = require('@ethersproject/providers');
const sor = require('@balancer-labs/sor');
const _ =  require('lodash');

const provider = new JsonRpcProvider(
        `https://kovan.infura.io/v3/${process.env.INFURA}`
    );

const contractAddress = "0x71c7f1086aFca7Aa1B0D4d73cfa77979d10D3210";

(async function() {

    // Creates a call for 1000 pools using same pool repeated. Needed because Kovan only has ~400 pools
    let subgraphPool =
        {
          "id": "0x01d96547765270e8a215b4a752ef0d3c3eb9667a",
          "publicSwap": true,
          "swapFee": "0.002",
          "tokens": [
            {
              "address": "0x34737f90fd62bc9b897760cd16f3dfa4418096e1",
              "balance": "2.593678079307815044",
              "decimals": 18,
              "denormWeight": "10",
              "id": "0x01d96547765270e8a215b4a752ef0d3c3eb9667a-0x34737f90fd62bc9b897760cd16f3dfa4418096e1",
              "symbol": "DyDAI"
            },
            {
              "address": "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa",
              "balance": "1.70109057842948047",
              "decimals": 18,
              "denormWeight": "10",
              "id": "0x01d96547765270e8a215b4a752ef0d3c3eb9667a-0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa",
              "symbol": "DAI"
            },
            {
              "address": "0xe7bc397dbd069fc7d0109c0636d06888bb50668c",
              "balance": "68.04362314",
              "decimals": 8,
              "denormWeight": "10",
              "id": "0x01d96547765270e8a215b4a752ef0d3c3eb9667a-0xe7bc397dbd069fc7d0109c0636d06888bb50668c",
              "symbol": "cDAI"
            }
          ],
          "tokensList": [
            "0xe7bc397dbd069fc7d0109c0636d06888bb50668c",
            "0x34737f90fd62bc9b897760cd16f3dfa4418096e1",
            "0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa"
          ],
          "totalWeight": "30"
        };

    let poolsArray = [];
    noPools = 0;
    while(noPools < 1000){
      poolsArray.push(subgraphPool);
      noPools++;
    }

    pools = { pools: poolsArray };


    // Use Subgraph pools (check .env is correct)
    // let pools = await sor.getAllPublicSwapPools();

    console.log(`No Of Pools: ${pools.pools.length}`);

    let poolsMulticall = _.cloneDeep(pools);

    if(!_.isEqual(pools, poolsMulticall)){
      console.log('ERROR');
      return;
    }

    console.time('multicall');
    let customPools = await sor.getAllPoolDataOnChainNew(
        poolsMulticall,
        contractAddress,
        provider
    );
    console.timeEnd('multicall');

    console.log(
    `Swap fee: ${customPools.pools[0].swapFee.toString()}`
    );
    console.log(
        `Total Weight: ${customPools.pools[0].totalWeight.toString()}`
    );

    customPools.pools[0].tokens.forEach(token => {
        console.log(token.address);
        console.log(token.balance.toString());
        console.log(token.denormWeight.toString());
    });


    poolsMulticall = _.cloneDeep(pools);

    console.time('multicall');
    let multicallPools = await sor.getAllPoolDataOnChain(
        poolsMulticall,
        // '0xeefba1e63905ef1d7acba5a8513c70307c1ce441', // Address of Multicall contract
        '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
        provider
    );
    console.timeEnd('multicall');

    console.log(
    `Swap fee: ${multicallPools.pools[0].swapFee.toString()}`
    );
    console.log(
        `Total Weight: ${multicallPools.pools[0].totalWeight.toString()}`
    );

    multicallPools.pools[0].tokens.forEach(token => {
        console.log(token.address);
        console.log(token.balance.toString());
        console.log(token.denormWeight.toString());
    });
    

    // Check results are the same
    if(!_.isEqual(customPools, multicallPools)){
      console.log('ERROR WITH O/P');
      return;
    }

})();
