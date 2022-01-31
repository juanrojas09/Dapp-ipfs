const img = artifacts.require("img"); //para levantar el smart contract

module.exports = function(deployer) {
  deployer.deploy(img);
};
