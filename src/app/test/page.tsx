'use client';

import { COUNTER_ABI, WORLDMAINNET_COUNTER_ADDRESS } from '@/constants';
import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
import { MiniKit } from '@worldcoin/minikit-js';
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { walletAuth } from '@/auth/wallet';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { createPublicClient, http } from 'viem';
import { sepolia, worldchain } from 'viem/chains';
import { useRouter } from 'next/navigation';
import { createEnsPublicClient } from '@ensdomains/ensjs';

export default function TestPage() {
  const session = useSession();
  const { isInstalled } = useMiniKit();
  const router = useRouter();
  const [buttonState, setButtonState] = useState<
    'pending' | 'success' | 'failed' | undefined
  >(undefined);
  const [currentCount, setCurrentCount] = useState<number | null>(null);

  // This triggers the useWaitForTransactionReceipt hook when updated
  const [transactionId, setTransactionId] = useState<string>('');

  // Use worldchain for mainnet
  const client = createPublicClient({
    chain: worldchain,
    transport: http(),
  });

  const ensClient = createEnsPublicClient({
    chain: sepolia,
    transport: http()
  })

  const searchENSDomains = async (searchTerm: any) => {
    try {
      // Try direct resolution first
      const address = await ensClient.getAddressRecord({
        name: `${searchTerm}.eth`
      });

      console.log('ENS resolved:', address);
      return address;
    } catch (error) {
      console.log('ENS not found or error:', error);
      return null;
    }
  };

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError,
    error,
  } = useWaitForTransactionReceipt({
    client: client,
    appConfig: {
      app_id: process.env.NEXT_PUBLIC_APP_ID as `app_${string}`,
    },
    transactionId: transactionId,
  });

  // Auto-login useEffect
  useEffect(() => {
    const autoLogin = async () => {
      if (isInstalled && session.status === 'unauthenticated') {
        try {
          await walletAuth();
        } catch (error) {
          console.error('Auto wallet auth failed:', error);
        }
      }
    };

    autoLogin();
  }, [isInstalled, session.status]);

  useEffect(() => {
    if (transactionId && !isConfirming) {
      if (isConfirmed) {
        console.log('Transaction confirmed!');
        setButtonState('success');
        setTimeout(() => {
          setButtonState(undefined);
          fetchCurrentCount(); // Refresh count after successful transaction
        }, 3000);
      } else if (isError) {
        console.error('Transaction failed:', error);
        setButtonState('failed');
        setTimeout(() => {
          setButtonState(undefined);
        }, 3000);
      }
    }
  }, [isConfirmed, isConfirming, isError, error, transactionId]);

  const onClickIncrement = async () => {
    setTransactionId('');
    setButtonState('pending');

    try {
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: WORLDMAINNET_COUNTER_ADDRESS,
            abi: COUNTER_ABI,
            functionName: 'increment',
            args: [],
          },
        ],
      });

      if (finalPayload.status === 'success') {
        console.log(
          'Transaction submitted, waiting for confirmation:',
          finalPayload.transaction_id,
        );
        setTransactionId(finalPayload.transaction_id);
      } else {
        console.error('Transaction submission failed:', finalPayload);
        setButtonState('failed');
        setTimeout(() => {
          setButtonState(undefined);
        }, 3000);
      }
    } catch (err) {
      console.error('Error sending transaction:', err);
      setButtonState('failed');
      setTimeout(() => {
        setButtonState(undefined);
      }, 3000);
    }
  };

  const fetchCurrentCount = async () => {
    try {
      const result = await client.readContract({
        address: WORLDMAINNET_COUNTER_ADDRESS as `0x${string}`,
        abi: COUNTER_ABI,
        functionName: 'count',
      });
      setCurrentCount(Number(result));
    } catch (err) {
      console.error('Error fetching current count:', err);
    }
  };

  // Load initial count
  useEffect(() => {
    fetchCurrentCount();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="px-3 py-4 max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => router.back()}
            className="!p-2"
          >
            ←
          </Button>
          <h1 className="text-xl font-bold text-black">Test Counter</h1>
        </div>

        {/* Current Count Display */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6 border-2 border-gray-300 text-center">
          <p className="text-gray-600 text-lg mb-3">current count</p>
          <div className="text-6xl font-bold text-black mb-4">
            {currentCount !== null ? currentCount : '--'}
          </div>
          <Button
            onClick={fetchCurrentCount}
            size="sm"
            variant="tertiary"
            className="mb-4"
          >
            Refresh Count
          </Button>
        </div>

        {/* Increment Button */}
        <div className="bg-gray-100 rounded-xl p-4 border-2 border-gray-300">
          <h3 className="font-semibold text-black mb-4">Actions</h3>
          <LiveFeedback
            label={{
              failed: 'Transaction failed',
              pending: 'Transaction pending',
              success: 'Counter incremented!',
            }}
            state={buttonState}
            className="w-full"
          >
            <Button
              onClick={onClickIncrement}
              disabled={buttonState === 'pending'}
              size="lg"
              variant="primary"
              className="w-full"
            >
              Increment Counter
            </Button>
          </LiveFeedback>
        </div>

        <Button
          onClick={() => searchENSDomains('b.awesamarthsepolia')}
          variant="tertiary"
        >
          Test ENS
        </Button>

        {/* User Info */}
        {session.status === 'authenticated' && (
          <div className="bg-gray-50 rounded-xl p-4 mt-4 border-2 border-gray-300">
            <h3 className="font-semibold text-black mb-2">Session Info</h3>
            <p className="text-sm text-gray-600">
              Address: {session?.data?.user?.walletAddress?.slice(0, 6)}...{session?.data?.user?.walletAddress?.slice(-4)}
            </p>
            <p className="text-sm text-gray-600">
              Username: {session?.data?.user?.username || 'Not set'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}