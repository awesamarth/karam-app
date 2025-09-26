// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;


contract Karam{

    error LimitExceeded();


//     struct DailyData {
//       uint256 karmaGivenInDay;
//       uint256 karmaSlashedInDay;
//   }

    uint deploymentTimestamp;
    uint constant TWENTY_FOUR_HOURS = 86400;

    mapping (address => uint256) karma;
    mapping (address => uint256) karmaGivenInDay;
    mapping (address => uint256) karmaSlashedInDay;
    mapping (address => mapping(address =>uint)) karmaGivenOneToOtherInDay;
    mapping (address => mapping(address =>uint)) karmaSlashedOneToOtherInDay;

    








    modifier givingLimitCheckGiver(address _receiver, uint8 amount) {
        if (karmaGivenInDay[msg.sender]>=30){
            revert LimitExceeded();
        }

        _;

    }

    function register() public {
        karma[msg.sender] = 500;
        
    }


    function giveKarma(address _receiver, uint _amount) public  {
        karma[_receiver] +=_amount;


    }


}