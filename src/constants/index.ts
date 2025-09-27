export const CONTRACT_ADDRESS="0x700663B92515B32F4CCE819BE40607ED691Bcb54"
export const CONTRACT_ABI=[
        {
            "type": "function",
            "name": "increment",
            "inputs": [],
            "outputs": [],
            "stateMutability": "nonpayable"
        },
        {
            "type": "function",
            "name": "number",
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
            "name": "setNumber",
            "inputs": [
                {
                    "name": "newNumber",
                    "type": "uint256",
                    "internalType": "uint256"
                }
            ],
            "outputs": [],
            "stateMutability": "nonpayable"
        }
    ]