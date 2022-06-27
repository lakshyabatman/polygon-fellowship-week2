//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract DeadmanSwitchWallet {
    
    mapping(address => uint256) public funds;
    mapping(address => address) public heir;
    mapping(address => uint) public lastCheckIn;

    modifier isHier(address wallet) {
        require(heir[wallet] == msg.sender, "you no heir");
        _;
    }

    modifier isActive(address wallet) {
        require(block.timestamp  - lastCheckIn[wallet] <=10 && heir[wallet] != 0x0000000000000000000000000000000000000000,"not active");
        _;
    }
    modifier isNotActive(address wallet) {
        require(block.timestamp  - lastCheckIn[wallet] > 10 && heir[wallet] != 0x0000000000000000000000000000000000000000," active");
        _;
    }

    function addFunds() public payable isActive(msg.sender) {
        funds[msg.sender]+=msg.value;
         still_live();
    } 

    function removeFunds(uint256 amt) public isActive(msg.sender) {
        require(funds[msg.sender] >=amt, "insufficient funds");
        funds[msg.sender]-=amt;
        payable(msg.sender).transfer(amt);
         still_live();
    } 

    function  setHeir(address wallet) public {
        require(heir[msg.sender] == 0x0000000000000000000000000000000000000000,"already setup");
        heir[msg.sender] = wallet;
         still_live();
    } 

    function still_live() public {
        lastCheckIn[msg.sender] = block.timestamp;
    }

    function withdraw(address wallet) public isHier(wallet) isNotActive(wallet) {

        payable(msg.sender).transfer(funds[wallet]);
        funds[wallet] = 0;
    }

}