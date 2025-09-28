'use client';

import { KARAM_CONTRACT_ABI, LOCAL_KARAM_CONTRACT_ADDRESS } from '../../../src/constants';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { useState } from 'react';
import { createPublicClient, createWalletClient, http, formatEther, parseEther } from 'viem';
import { foundry } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

export default function AnotherTestPage() {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  const localReadClient = createPublicClient({
    chain:foundry,
    transport:http()
  })


  //(anvil first key)
  const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' as `0x${string}`);



  const localWalletClient =  createWalletClient({
    account,
    chain: foundry,
    transport: http(),
  });

  const addResult = (action: string, result: any) => {
    setResults(prev => [...prev, {
      action,
      result: typeof result === 'object' ? JSON.stringify(result, null, 2) : result.toString(),
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testRegister = async () => {
    setIsLoading(true);
    try {
      addResult('Starting Register', 'Calling register() function...');

      const hash = await localWalletClient.writeContract({
        address: LOCAL_KARAM_CONTRACT_ADDRESS as `0x${string}`,
        abi: KARAM_CONTRACT_ABI,
        functionName: 'register',
        args: []
      });

      addResult('Register Transaction Hash', hash);

      // Wait for transaction receipt
      const receipt = await localReadClient.waitForTransactionReceipt({ hash });
      addResult('Register Transaction Receipt', `Status: ${receipt.status}, Block: ${receipt.blockNumber}`);

    } catch (error: any) {
      addResult('Register Error', error.message);
    }
    setIsLoading(false);
  };

  const testReadAllMappings = async () => {
    setIsLoading(true);
    try {
      const userAddress = account.address;

      // Test isRegistered
      const isRegistered = await localReadClient.readContract({
        address: LOCAL_KARAM_CONTRACT_ADDRESS as `0x${string}`,
        abi: KARAM_CONTRACT_ABI,
        functionName: 'isRegistered',
        args: [userAddress]
      });
      addResult('isRegistered', isRegistered);

      // Test karma balance
      const karma = await localReadClient.readContract({
        address: LOCAL_KARAM_CONTRACT_ADDRESS as `0x${string}`,
        abi: KARAM_CONTRACT_ABI,
        functionName: 'karma',
        args: [userAddress]
      }) as bigint;
      addResult('Karma Balance', `${formatEther(karma)} karma`);

      // Test daily given karma
      const karmaGivenInDay = await localReadClient.readContract({
        address: LOCAL_KARAM_CONTRACT_ADDRESS as `0x${string}`,
        abi: KARAM_CONTRACT_ABI,
        functionName: 'karmaGivenInDay',
        args: [userAddress]
      }) as bigint;
      addResult('Karma Given Today', `${formatEther(karmaGivenInDay)} karma`);

      // Test daily slashed karma
      const karmaSlashedInDay = await localReadClient.readContract({
        address: LOCAL_KARAM_CONTRACT_ADDRESS as `0x${string}`,
        abi: KARAM_CONTRACT_ABI,
        functionName: 'karmaSlashedInDay',
        args: [userAddress]
      }) as bigint;
      addResult('Karma Slashed Today', `${formatEther(karmaSlashedInDay)} karma`);

      // Test total received
      const totalReceived = await localReadClient.readContract({
        address: LOCAL_KARAM_CONTRACT_ADDRESS as `0x${string}`,
        abi: KARAM_CONTRACT_ABI,
        functionName: 'totalKarmaReceivedByUser',
        args: [userAddress]
      }) as bigint;
      addResult('Total Karma Received', `${formatEther(totalReceived)} karma`);

      // Test total slashed
      const totalSlashed = await localReadClient.readContract({
        address: LOCAL_KARAM_CONTRACT_ADDRESS as `0x${string}`,
        abi: KARAM_CONTRACT_ABI,
        functionName: 'totalKarmaSlashedOfUser',
        args: [userAddress]
      }) as bigint;
      addResult('Total Karma Slashed', `${formatEther(totalSlashed)} karma`);

      // Test social connections
      const socialConnections = await localReadClient.readContract({
        address: LOCAL_KARAM_CONTRACT_ADDRESS as `0x${string}`,
        abi: KARAM_CONTRACT_ABI,
        functionName: 'socialConnections',
        args: [userAddress]
      }) as [string, string, string];
      addResult('Social Connections', {
        twitter: socialConnections[0] || 'Not connected',
        github: socialConnections[1] || 'Not connected',
        discord: socialConnections[2] || 'Not connected'
      });

    } catch (error: any) {
      addResult('Read Mappings Error', error.message);
    }
    setIsLoading(false);
  };

  const testGiveKarma = async () => {
    setIsLoading(true);
    try {
      // Give karma to a test address (using a different address)
      const testReceiver = '0xCDF770392F1E5E61725Cc9522c80070134D50eC7'; // Random test address
      const amount = parseEther('10'); // 10 karma

      addResult('Starting Give Karma', `Giving 10 karma to ${testReceiver}`);

      const hash = await localWalletClient.writeContract({
        address: LOCAL_KARAM_CONTRACT_ADDRESS as `0x${string}`,
        abi: KARAM_CONTRACT_ABI,
        functionName: 'giveKarma',
        args: [testReceiver, amount, 'Test karma transfer']
      });

      addResult('Give Karma Transaction Hash', hash);

      const receipt = await localReadClient.waitForTransactionReceipt({ hash });
      addResult('Give Karma Transaction Receipt', `Status: ${receipt.status}, Block: ${receipt.blockNumber}`);

    } catch (error: any) {
      addResult('Give Karma Error', error.message);
    }
    setIsLoading(false);
  };

  const testSlashKarma = async () => {
    setIsLoading(true);
    try {
      const testReceiver = '0xCDF770392F1E5E61725Cc9522c80070134D50eC7';
      const amount = parseEther('5'); // 5 karma

      addResult('Starting Slash Karma', `Slashing 5 karma from ${testReceiver}`);

      const hash = await localWalletClient.writeContract({
        address: LOCAL_KARAM_CONTRACT_ADDRESS as `0x${string}`,
        abi: KARAM_CONTRACT_ABI,
        functionName: 'slashKarma',
        args: [testReceiver, amount, 'Test karma slash']
      });

      addResult('Slash Karma Transaction Hash', hash);

      const receipt = await localReadClient.waitForTransactionReceipt({ hash });
      addResult('Slash Karma Transaction Receipt', `Status: ${receipt.status}, Block: ${receipt.blockNumber}`);

    } catch (error: any) {
      addResult('Slash Karma Error', error.message);
    }
    setIsLoading(false);
  };

  const testConnectSocial = async () => {
    setIsLoading(true);
    try {
      addResult('Starting Connect Social', 'Connecting Twitter handle...');

      const hash = await localWalletClient.writeContract({
        address: LOCAL_KARAM_CONTRACT_ADDRESS as `0x${string}`,
        abi: KARAM_CONTRACT_ABI,
        functionName: 'connectSocial',
        args: [0, 'testuser123'] // 0 = Twitter
      });

      addResult('Connect Social Transaction Hash', hash);

      const receipt = await localReadClient.waitForTransactionReceipt({ hash });
      addResult('Connect Social Transaction Receipt', `Status: ${receipt.status}, Block: ${receipt.blockNumber}`);

    } catch (error: any) {
      addResult('Connect Social Error', error.message);
    }
    setIsLoading(false);
  };

  const testAllUsers = async () => {
    setIsLoading(true);
    try {
      // Try to get all users
        try {
          const users = await localReadClient.readContract({
            address: LOCAL_KARAM_CONTRACT_ADDRESS as `0x${string}`,
            abi: KARAM_CONTRACT_ABI,
            functionName: 'getAllUsers',

          }) 

          console.log(users)
        } catch {

          console.log("error")
        }
      }



     catch (error: any) {
      addResult('All Users Error', error.message);
    }
    setIsLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="px-3 py-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-black mb-6">Contract Testing Page</h1>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            onClick={testRegister}
            disabled={isLoading}
            variant="primary"
            size="sm"
          >
            Test Register
          </Button>

          <Button
            onClick={testReadAllMappings}
            disabled={isLoading}
            variant="secondary"
            size="sm"
          >
            Read All Mappings
          </Button>

          <Button
            onClick={testGiveKarma}
            disabled={isLoading}
            variant="primary"
            size="sm"
          >
            Test Give Karma
          </Button>

          <Button
            onClick={testSlashKarma}
            disabled={isLoading}
            variant="secondary"
            size="sm"
          >
            Test Slash Karma
          </Button>

          <Button
            onClick={testConnectSocial}
            disabled={isLoading}
            variant="primary"
            size="sm"
          >
            Test Connect Social
          </Button>

          <Button
            onClick={testAllUsers}
            disabled={isLoading}
            variant="secondary"
            size="sm"
          >
            Test All Users
          </Button>
        </div>

        <div className="flex gap-3 mb-6">
          <Button
            onClick={clearResults}
            variant="tertiary"
            size="sm"
            className="flex-1"
          >
            Clear Results
          </Button>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-300">
          <h3 className="font-semibold text-black mb-4">Test Results:</h3>

          {isLoading && (
            <div className="flex items-center gap-2 mb-4">
              <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full"></div>
              <span className="text-sm text-gray-600">Running test...</span>
            </div>
          )}

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-gray-500 text-sm">No tests run yet. Click a button above to start testing.</p>
            ) : (
              results.map((result, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-black text-sm">{result.action}</h4>
                    <span className="text-xs text-gray-500">{result.timestamp}</span>
                  </div>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words">
                    {result.result}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 bg-gray-100 rounded-xl p-4 border-2 border-gray-300">
          <h3 className="font-semibold text-black mb-2">Test Account Info:</h3>
          <p className="text-sm text-gray-600 mb-1">
            Address: {account.address}
          </p>
          <p className="text-sm text-gray-600">
            Chain: Worldchain Sepolia
          </p>
        </div>
      </div>
    </div>
  );
}