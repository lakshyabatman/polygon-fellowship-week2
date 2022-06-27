const HDWalletProvider = require('@truffle/hdwallet-provider')
const secrets = require('./secrets.json');
const { POSClient, use } = require('@maticnetwork/maticjs')
const { Web3ClientPlugin } = require('@maticnetwork/maticjs-web3')

use(Web3ClientPlugin)

const privateKey = secrets.privateKey
const userAddress = secrets.address

const rootToken = "0x1a1b1c158388de1b51176680e2a6390e1b21e6c9";
const amount = "0.0001";


const getPOSClient = (network = 'testnet', version = 'mumbai') => {
  const posClient = new POSClient()
  return posClient.init({
    log: true,
    network: network,
    version: version,
    child: {
      provider: new HDWalletProvider(privateKey, secrets.mumbai),
      defaultConfig: {
        from: userAddress,
      },
    },
    parent: {
      provider: new HDWalletProvider(privateKey, secrets.goerli),
      defaultConfig: {
        from: userAddress,
      },
    },
  })
}


const aprroval = async () => {
    console.log("Approving")
    var client = await getPOSClient();
    const erc20Token = client.erc20(rootToken, true);

    const result = await erc20Token.approve(amount);

    const txHash = await result.getTransactionHash();
    console.log(txHash);
    const rcpt = await result.getReceipt();
    console.log(rcpt);
    console.log("Approved!")
}


const deposit = async () => {
    console.log("Depositing")
    var client = await getPOSClient();
    const erc20Token = client.erc20(rootToken, true);

    const result = await erc20Token.deposit(amount, userAddress, {
        userAddress, 

      });
    
    const txHash = await result.getTransactionHash();
    console.log(txHash);
    const rcpt = await result.getReceipt();
    console.log(rcpt);
    console.log("Completed!")
}

(async () => {
    await aprroval();
    await deposit()
})();