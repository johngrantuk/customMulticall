const { expect } = require("chai");

describe("PoolState", function() {
  let factory;
  let pool;
  let POOL;
  let WETH;
  let DAI;
  let weth;
  let dai;
  let poolState;
  let admin;
  let MAX = ethers.constants.MaxUint256;
  let poolAddr;

  before(async () => {
      const accounts = await ethers.getSigners();
      admin = await accounts[0].getAddress();
      console.log(admin)

      const Factory = await ethers.getContractFactory("BFactory");
      factory = await Factory.deploy();
      await factory.deployed();

      const PoolState = await ethers.getContractFactory("PoolState");
      poolState = await PoolState.deploy();

      const TToken = await ethers.getContractFactory("TToken");
      weth = await TToken.deploy('Wrapped Ether', 'WETH', 18);
      dai = await TToken.deploy('Dai Stablecoin', 'DAI', 18);

      await dai.deployed();

      WETH = weth.address;
      DAI = dai.address;

      // admin balances
      await weth.mint(admin, ethers.utils.parseEther('200'));
      await dai.mint(admin, ethers.utils.parseEther('200'));

      POOL = await factory.newBPool();
      POOL = await POOL.wait();
      // find pool addr
      POOL.events.forEach(event => {
        if(event.event === 'LOG_NEW_POOL'){
          poolAddr = event.args[1];
          console.log(event.args[1])
        }
      })

      const BPool = await ethers.getContractFactory("BPool");
      pool = BPool.attach(poolAddr);
      pool.connect(accounts[0])

      await weth.approve(poolAddr, MAX);
      await dai.approve(poolAddr, MAX);

      await pool.bind(WETH, ethers.utils.parseEther('50'), ethers.utils.parseEther('2'));
      await pool.bind(DAI, ethers.utils.parseEther('60'), ethers.utils.parseEther('7'));
      await pool.finalize();
  });

  it("Should confirm pool deployed ok", async function() {
      const swapFee = await pool.getSwapFee();
      const wethBal = await pool.getBalance(WETH);
      const daiBal = await pool.getBalance(DAI);
      expect(wethBal.toString()).to.equal(ethers.utils.parseEther('50').toString());
      expect(daiBal.toString()).to.equal(ethers.utils.parseEther('60').toString());
      expect(swapFee).to.equal(1000000000000);
  });

  it("Should output correct addresses", async function() {
    let pools =
    {
        "pools": [
          {
            "id": poolAddr,
            "tokens": [
              {
                "address": WETH
              },
              {
                "address": DAI
              }
            ]
          }
        ]
    }

    let addresses = [];
    let total = 0;
    pools.pools.forEach((pool, index) => {
      console.log(`${index} ${pool.id}`);
      addresses.push([pool.id]);
      total += 1;
      pool.tokens.forEach((token, tokenIndex) => {
        addresses[index].push(token.address);
        total += 2;
      })
    })

    let onChainInfo = await poolState.getPoolInfo(addresses, total);

    expect(onChainInfo[0]).to.equal(1000000000000); // swapFee
    expect(onChainInfo[1]).to.equal(ethers.utils.parseEther('50').toString()); // token balance
    expect(onChainInfo[2]).to.equal(ethers.utils.parseEther('2').toString()); // token weight
    expect(onChainInfo[3]).to.equal(ethers.utils.parseEther('60').toString()); // token balance
    expect(onChainInfo[4]).to.equal(ethers.utils.parseEther('7').toString()); // token weight
  });
});
