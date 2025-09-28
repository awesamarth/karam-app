export const OPSEPOlIA_REDISTRIBUTION_CONTRACT_ADDRESS="0x96298722D056F03b245Df2f5860319DEe3eE7cFE"

export const WORLDMAINNET_KARAM_CONTRACT_ADDRESS="0x858bf798C977F8FC522a5116b6D6c1dD6Af5fB35"

export const LOCAL_KARAM_CONTRACT_ADDRESS="0x5FbDB2315678afecb367f032d93F642f64180aa3"


export const KARAM_CONTRACT_ABI=[
        {
            "type": "constructor",
            "inputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "allUsers",
            "inputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "connectSocial",
            "inputs": [
                {
                    "name": "_whichPlatform",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "_username",
                    "type": "string",
                    "internalType": "string"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "dailyReset",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "getAllUsers",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "address[]",
                    "internalType": "address[]"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "giveKarma",
            "inputs": [
                {
                    "name": "_receiver",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "_amount",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "_reason",
                    "type": "string",
                    "internalType": "string"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "isRegistered",
            "inputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "bool",
                    "internalType": "bool"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "karma",
            "inputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "karmaGivenInDay",
            "inputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "karmaGivenOneToOtherInDay",
            "inputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "karmaSlashedInDay",
            "inputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "karmaSlashedOneToOtherInDay",
            "inputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "redistibuteKarma",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "register",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "slashKarma",
            "inputs": [
                {
                    "name": "_receiver",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "_amount",
                    "type": "uint256",
                    "internalType": "uint256"
                },
                {
                    "name": "_reason",
                    "type": "string",
                    "internalType": "string"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "socialConnections",
            "inputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [
                {
                    "name": "twitterUsername",
                    "type": "string",
                    "internalType": "string"
                },
                {
                    "name": "githubUsername",
                    "type": "string",
                    "internalType": "string"
                },
                {
                    "name": "discordUsername",
                    "type": "string",
                    "internalType": "string"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "totalKarmaReceivedByUser",
            "inputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "totalKarmaSlashedOfUser",
            "inputs": [
                {
                    "name": "",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "event",
            "name": "KarmaGiven",
            "inputs": [
                {
                    "name": "from",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "to",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                },
                {
                    "name": "reason",
                    "type": "string",
                    "indexed": false,
                    "internalType": "string"
                },
                {
                    "name": "timestamp",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "KarmaSlashed",
            "inputs": [
                {
                    "name": "slasher",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "victim",
                    "type": "address",
                    "indexed": true,
                    "internalType": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                },
                {
                    "name": "reason",
                    "type": "string",
                    "indexed": false,
                    "internalType": "string"
                },
                {
                    "name": "timestamp",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        },
        {
            "type": "error",
            "name": "AlreadyRegistered",
            "inputs": []
        },
        {
            "type": "error",
            "name": "LimitExceeded",
            "inputs": []
        },
        {
            "type": "error",
            "name": "NotEnoughKarma",
            "inputs": []
        },
        {
            "type": "error",
            "name": "NotOwner",
            "inputs": []
        }
    ]
export const REDISTRIBUTION_CONTRACT_ABI = [
        {
            "type": "constructor",
            "inputs": [
                {
                    "name": "_entropy",
                    "type": "address",
                    "internalType": "address"
                }
            ],
            "stateMutability": "nonpayable"
        },
        {
            "type": "fallback",
            "stateMutability": "payable"
        },
        {
            "type": "receive",
            "stateMutability": "payable"
        },
        {
            "type": "function",
            "name": "_entropyCallback",
            "inputs": [
                {
                    "name": "sequence",
                    "type": "uint64",
                    "internalType": "uint64"
                },
                {
                    "name": "provider",
                    "type": "address",
                    "internalType": "address"
                },
                {
                    "name": "randomNumber",
                    "type": "bytes32",
                    "internalType": "bytes32"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "request",
            "inputs": [],
            "outputs": [],
            "stateMutability": "payable"
        },
        {
            "type": "event",
            "name": "EntropyRequested",
            "inputs": [
                {
                    "name": "sequenceNumber",
                    "type": "uint64",
                    "indexed": false,
                    "internalType": "uint64"
                }
            ],
            "anonymous": false
        },
        {
            "type": "event",
            "name": "EntropyResult",
            "inputs": [
                {
                    "name": "sequenceNumber",
                    "type": "uint64",
                    "indexed": false,
                    "internalType": "uint64"
                },
                {
                    "name": "result",
                    "type": "uint256",
                    "indexed": false,
                    "internalType": "uint256"
                }
            ],
            "anonymous": false
        }
    ]
export const COUNTER_ABI= [
        {
            "type": "function",
            "name": "count",
            "inputs": [],
            "outputs": [
                {
                    "name": "",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "stateMutability": "view"
        },
        {
            "type": "function",
            "name": "increment",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
        }
    ]