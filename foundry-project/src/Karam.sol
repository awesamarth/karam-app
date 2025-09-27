// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

contract Karam {
    error LimitExceeded();
    error NotOwner();
    error NotEnoughKarma();
    error AlreadyRegistered();

    event KarmaGiven(
      address indexed from,
      address indexed to,
      uint256 amount,
      string reason,
      uint256 timestamp
  );

  event KarmaSlashed(
      address indexed slasher,
      address indexed victim,
      uint256 amount,
      string reason,
      uint256 timestamp
  );

    //     struct DailyData {
    //       uint256 karmaGivenInDay;
    //       uint256 karmaSlashedInDay;
    //   }no

    struct Connections{
        string twitterUsername;
        string githubUsername;
        string discordUsername;
    }

    

    uint256 lastUpdated;
    address owner;

    address[] public allUsers;

    mapping (address=> bool) public isRegistered;
    mapping (address => Connections) public socialConnections;
    mapping(address => uint256) public karma;
    mapping (address=> string) twitterUsername;
    mapping(address => uint256) karmaGivenInDay;
    mapping(address => uint256) karmaSlashedInDay;
    mapping (address => uint256) totalKarmaSlashedOfUser;
    mapping (address => uint256) totalKarmaReceivedByUser;
    mapping(address => mapping(address => uint256)) karmaGivenOneToOtherInDay;
    mapping(address => mapping(address => uint256)) karmaSlashedOneToOtherInDay;

    modifier givingLimitChecker(address _receiver, uint amount) {
        if (karmaGivenInDay[msg.sender] >= 30 ether) {
            revert LimitExceeded();
        }
        _;
    }

    modifier slashingLimitChecker(address _receiver, uint amount) {
        if (karmaSlashedInDay[msg.sender] >= 20 ether) {
            revert LimitExceeded();
        }

        if (karmaSlashedOneToOtherInDay[msg.sender][_receiver] >= 5 ether) {
            revert LimitExceeded();
        }
        _;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotOwner();
        }
        _;
    }

    constructor() {
        lastUpdated = block.timestamp;
        owner = msg.sender;
    }

    function register() public {
        if (isRegistered[msg.sender]){
            revert AlreadyRegistered();
        }
        karma[msg.sender] = 500 ether;
        allUsers.push(msg.sender);
    }

    function giveKarma(address _receiver, uint _amount, string memory _reason) public givingLimitChecker(_receiver, _amount) {
        //assuming the above parameter (amount) is in ether
        if (karma[msg.sender]<_amount){
            revert NotEnoughKarma();
        }
        karma[_receiver] += _amount;
        karma[msg.sender] -= _amount;
        karmaGivenInDay[msg.sender] += _amount;


        emit KarmaGiven(msg.sender, _receiver, _amount, _reason, block.timestamp);
    }

    function slashKarma(address _receiver, uint _amount, string memory _reason) public slashingLimitChecker(_receiver, _amount) {
        if (karma[msg.sender]<_amount/5){
            revert NotEnoughKarma();
        }
        karma[_receiver] -= _amount;
        karma[msg.sender] -= _amount / 5;
        karmaSlashedInDay[msg.sender] += _amount;

        emit KarmaSlashed(msg.sender, _receiver, _amount, _reason, block.timestamp);
    }

    function connectSocial(uint _whichPlatform, string memory _username) public {
        // 0 for twitter
        // 1 for github
        // 2 for discord

        if (_whichPlatform == 0) {
            socialConnections[msg.sender].twitterUsername = _username;
            twitterUsername[msg.sender] = _username;
        } else if (_whichPlatform == 1) {
            socialConnections[msg.sender].githubUsername = _username;
        } else if (_whichPlatform == 2) {
            socialConnections[msg.sender].discordUsername = _username;
        }

        karma[msg.sender] += 25;
    }

    function dailyReset() public onlyOwner() {
        for (uint i = 0; i < allUsers.length; i++) {
            address user = allUsers[i];
            karmaGivenInDay[user] = 0;
            karmaSlashedInDay[user] = 0;

            for (uint j = 0; j < allUsers.length; j++) {
                address otherUser = allUsers[j];
                karmaGivenOneToOtherInDay[user][otherUser] = 0;
                karmaSlashedOneToOtherInDay[user][otherUser] = 0;
            }
        }
    }

    function redistibuteKarma() public onlyOwner() {
        for (uint i = 0; i < allUsers.length; i++) {
            address user = allUsers[i];
            if (karma[user] < 100) {
                karma[user] +=30;
            }
            else {
                // gonna give them 
                karma[user] = (3 * karma[user])/10; 
            } 
            
        }
    }
}
