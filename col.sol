// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;


contract Karam{

    error LimitExceeded();


//     struct DailyData {
//       uint256 karmaGivenInDay;
//       uint256 karmaSlashedInDay;
//   }

    uint deploymentTimestamp;
    uint constant TWENTY_FOUR_HOURS = 86400 ;

    mapping (address => uint256) karma;
    mapping (address => uint256) karmaGivenInDay;
    mapping (address => uint256) karmaSlashedInDay;
    mapping (address => mapping(address =>uint)) karmaGivenOneToOtherInDay;
    mapping (address => mapping(address =>uint)) karmaSlashedOneToOtherInDay;



    modifier givingLimitChecker(address _receiver, uint8 amount) {
        if (karmaGivenInDay[msg.sender]>=30 ether){
            revert LimitExceeded();
        }
        _;
    }


    modifier slashingLimitChecker(address _receiver, uint8 amount) {
        if (karmaSlashedInDay[msg.sender]>=20 ether){
            revert LimitExceeded();
        }

        if (karmaSlashedOneToOtherInDay[msg.sender][_receiver]>=5 ether){
            revert LimitExceeded();

        }
        _;
    }

    function register() public {
        karma[msg.sender] = 500 ether;
    }


    function giveKarma(address _receiver, uint8 _amount)  public givingLimitChecker(_receiver, _amount)  {
        //assuming the above parameter (amount) is in ether
        karma[_receiver] +=_amount;
        karma[msg.sender] -=_amount;
    }

    function slashKarma(address _receiver, uint8 _amount) public slashingLimitChecker(_receiver, _amount) {
        karma[_receiver] -=_amount;
        karma[msg.sender] -=_amount/5;
    }




    


}