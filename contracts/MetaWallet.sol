//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract MetaWallet is Ownable {
  struct WalletConfig {
    bool exists;
    address wallet;
    string username;
    string bio;
    string avatar;
    Link[20] links;
  }

  struct Link {
    string key;
    string value;
  }

  mapping(address => WalletConfig) public walletMap;

  mapping(uint => address) public addresses;

  uint addressRegistryCount;

  uint claimPrice = 0 ether;
  uint updatePrice = 0 ether;

  event Claim(address indexed _address);
  event Update(address indexed _address, string username, string bio, string avatar, Link[20] links);

  constructor() {
    console.log('Deploying MetaWallet');
  }

  // claim a wallet address
  function claimWallet() public payable {
    if (!walletMap[msg.sender].exists) {
      require(msg.value >= claimPrice, 'Not enough ether to claim wallet');

      WalletConfig storage wallet = walletMap[msg.sender];
      wallet.exists = true;
      wallet.wallet = msg.sender;
      
      addresses[addressRegistryCount] = msg.sender;
      addressRegistryCount++;

      emit Claim(msg.sender);
    }
  }

  function adminClaimWallet(address _address) public onlyOwner {
    if (!walletMap[_address].exists) {
      WalletConfig storage wallet = walletMap[_address];
      wallet.exists = true;
      wallet.wallet = _address;

      addresses[addressRegistryCount] = _address;
      addressRegistryCount++;

      emit Claim(_address);
    }
  }

  // check if wallet address is claimed
  function isClaimedWallet(address _address) public view returns (bool) {
    return walletMap[_address].exists;
  }

  // get claimed wallet by address
  function getWallet(address _address) public view returns (WalletConfig memory) {
    return walletMap[_address];
  }

  // get all verified wallet addresses 
  function getAllWallets() public view returns (address[] memory){
    address[] memory ret = new address[](addressRegistryCount);
    for (uint i = 0; i < addressRegistryCount; i++) {
      ret[i] = addresses[i];
    }
    return ret;
  }

  // update claimed wallet data
  function setWallet(
    string memory _username, 
    string memory _bio, 
    string memory _avatar,
    Link[] memory _links) public payable {
    if (walletMap[msg.sender].exists) {
      require(msg.value >= updatePrice, 'Not enough ether to update wallet');

      walletMap[msg.sender].username = _username;
      walletMap[msg.sender].bio = _bio;
      walletMap[msg.sender].avatar = _avatar;

      for (uint i = 0; i < _links.length; i++) {
        walletMap[msg.sender].links[i] = Link(
          _links[i].key,
          _links[i].value
        );
      }

      // reset other links
      for (uint i = _links.length; i < 20; i++) {
        walletMap[msg.sender].links[i] = Link('', '');
      }

      emit Update(msg.sender, _username, _bio, _avatar, walletMap[msg.sender].links);
    }
  }

  // update claimed wallet data
  function adminSetWallet(
    address _address,
    string memory _username, 
    string memory _bio, 
    string memory _avatar,
    Link[] memory _links) public onlyOwner {
    if (walletMap[_address].exists) {
      walletMap[_address].username = _username;
      walletMap[_address].bio = _bio;
      walletMap[_address].avatar = _avatar;

      for (uint i = 0; i < _links.length; i++) {
        walletMap[_address].links[i] = Link(
          _links[i].key,
          _links[i].value
        );
      }

      // reset other links
      for (uint i = _links.length; i < 20; i++) {
        walletMap[_address].links[i] = Link('', '');
      }

      emit Update(msg.sender, _username, _bio, _avatar, walletMap[msg.sender].links);
    }
  }

  function getClaimPrice() public view onlyOwner returns (uint) {
    return claimPrice; 
  }

  function setClaimPrice(uint _price) public onlyOwner returns (uint) {
    claimPrice = _price;
    return claimPrice;
  }

  function getUpdatePrice() public view onlyOwner returns (uint) {
    return updatePrice; 
  }

  function setUpdatePrice(uint _price) public onlyOwner returns (uint) {
    updatePrice = _price;
    return updatePrice;
  }
}
