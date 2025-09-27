// contracts/src/CoinFlip.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@pythnetwork/entropy-sdk-solidity/IEntropyV2.sol";
import "@pythnetwork/entropy-sdk-solidity/IEntropyConsumer.sol";

contract Redistribution is IEntropyConsumer {
    event EntropyRequested(uint64 sequenceNumber);
    event EntropyResult(uint64 sequenceNumber, uint result);


    address owner;


    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    IEntropyV2 entropy;

    constructor(address _entropy) {
        entropy = IEntropyV2(_entropy);
        owner = msg.sender;
    }



    // This method is required by the IEntropyConsumer interface
    function getEntropy() internal view override returns (address) {
        return address(entropy);
    }

    function request() external payable onlyOwner {
        // get the required fee
        uint128 requestFee = entropy.getFeeV2();
        // check if the user has sent enough fees
        if (msg.value < requestFee) revert("not enough fees");

        // pay the fees and request a random number from entropy
        uint64 sequenceNumber = entropy.requestV2{value: requestFee}();

        // emit event
        emit EntropyRequested(sequenceNumber);
    }

    function entropyCallback(
        uint64 sequenceNumber,
        address,
        bytes32 randomNumber
    ) internal override {
        uint result = uint256(randomNumber) % 3;
        

        emit EntropyResult(sequenceNumber, result);
    }

    receive() external payable {}
    fallback() external payable {}
}
