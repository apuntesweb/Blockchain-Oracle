const oracle = artifacts.require("Oracle");

module.exports = function (deployer) {
  deployer.deploy(oracle);
};
