const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DeadmanSwitchWallet", function () {
  it("Should work properly", async function () {
    const Contract = await ethers.getContractFactory("DeadmanSwitchWallet");
    const contract = await Contract.deploy();
    const signers = await ethers.getSigners();
    await contract.deployed();


    await contract.setHeir(signers[0].address);

    const tnx = await contract.addFunds({
      value: ethers.utils.parseEther("1")
    })

    await tnx.wait();


  //  expect(await contract.withdraw(signers[0].address)).throws("VM Exception while processing transaction: reverted with reason string ' active'")



  });
});
