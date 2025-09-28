'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { KARAM_CONTRACT_ABI, WORLDMAINNET_KARAM_CONTRACT_ADDRESS } from '@/constants';
import { createPublicClient, http, formatEther, parseEther } from 'viem';
import { worldchain } from 'viem/chains';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MiniKit } from '@worldcoin/minikit-js';
import { KarmaModal } from './modal';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const session = useSession();
  const address = params.address as string;

  const [profileData, setProfileData] = useState({
    karma: 0,
    totalReceived: 0,
    totalSlashed: 0,
    isRegistered: false,
    socialConnections: {
      twitter: '',
      github: '',
      discord: ''
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<'give' | 'slash' | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState<string>('');
  const [isTransacting, setIsTransacting] = useState<boolean>(false);
  const [userLimits, setUserLimits] = useState({
    myKarma: 0,
    dailyGiven: 0,
    dailySlashed: 0,
    slashedToThisUser: 0
  });

  const worldchainPublicClient = createPublicClient({
    chain: worldchain,
    transport: http(),
  });

  const fetchProfileData = async (userAddress: string) => {
    try {
      setIsLoading(true);
      console.log('Fetching profile data for address:', userAddress);

      const [
        registrationStatus,
        karmaAmount,
        totalReceived,
        totalSlashed,
        connections
      ] = await worldchainPublicClient.multicall({
        contracts: [
          {
            address: WORLDMAINNET_KARAM_CONTRACT_ADDRESS as `0x${string}`,
            abi: KARAM_CONTRACT_ABI,
            functionName: 'isRegistered',
            args: [userAddress as `0x${string}`]
          },
          {
            address: WORLDMAINNET_KARAM_CONTRACT_ADDRESS as `0x${string}`,
            abi: KARAM_CONTRACT_ABI,
            functionName: 'karma',
            args: [userAddress as `0x${string}`]
          },
          {
            address: WORLDMAINNET_KARAM_CONTRACT_ADDRESS as `0x${string}`,
            abi: KARAM_CONTRACT_ABI,
            functionName: 'totalKarmaReceivedByUser',
            args: [userAddress as `0x${string}`]
          },
          {
            address: WORLDMAINNET_KARAM_CONTRACT_ADDRESS as `0x${string}`,
            abi: KARAM_CONTRACT_ABI,
            functionName: 'totalKarmaSlashedOfUser',
            args: [userAddress as `0x${string}`]
          },
          {
            address: WORLDMAINNET_KARAM_CONTRACT_ADDRESS as `0x${string}`,
            abi: KARAM_CONTRACT_ABI,
            functionName: 'socialConnections',
            args: [userAddress as `0x${string}`]
          }
        ]
      });

      console.log('Profile contract call results:', {
        registrationStatus,
        karmaAmount,
        totalReceived,
        totalSlashed,
        connections
      });

      if (registrationStatus.status === 'success') {
        const registered = registrationStatus.result as boolean;
        if (!registered) {
          console.log('User not registered');
          setIsLoading(false);
          return;
        }
      }

      setProfileData({
        karma: karmaAmount.status === 'success' ? Number(formatEther(karmaAmount.result as bigint)) : 0,
        totalReceived: totalReceived.status === 'success' ? Number(formatEther(totalReceived.result as bigint)) : 0,
        totalSlashed: totalSlashed.status === 'success' ? Number(formatEther(totalSlashed.result as bigint)) : 0,
        isRegistered: registrationStatus.status === 'success' ? registrationStatus.result as boolean : false,
        socialConnections: connections.status === 'success' ? {
          twitter: (connections.result as [string, string, string])[0] || '',
          github: (connections.result as [string, string, string])[1] || '',
          discord: (connections.result as [string, string, string])[2] || ''
        } : {
          twitter: '',
          github: '',
          discord: ''
        }
      });

    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserLimits = async (myAddress: string) => {
    if (!session.data?.user?.walletAddress) return;

    try {
      console.log('Fetching user limits for:', myAddress);

      const [
        myKarma,
        dailyGiven,
        dailySlashed,
        slashedToThisUser
      ] = await worldchainPublicClient.multicall({
        contracts: [
          {
            address: WORLDMAINNET_KARAM_CONTRACT_ADDRESS as `0x${string}`,
            abi: KARAM_CONTRACT_ABI,
            functionName: 'karma',
            args: [myAddress as `0x${string}`]
          },
          {
            address: WORLDMAINNET_KARAM_CONTRACT_ADDRESS as `0x${string}`,
            abi: KARAM_CONTRACT_ABI,
            functionName: 'karmaGivenInDay',
            args: [myAddress as `0x${string}`]
          },
          {
            address: WORLDMAINNET_KARAM_CONTRACT_ADDRESS as `0x${string}`,
            abi: KARAM_CONTRACT_ABI,
            functionName: 'karmaSlashedInDay',
            args: [myAddress as `0x${string}`]
          },
          {
            address: WORLDMAINNET_KARAM_CONTRACT_ADDRESS as `0x${string}`,
            abi: KARAM_CONTRACT_ABI,
            functionName: 'karmaSlashedToUserInDay',
            args: [myAddress as `0x${string}`, address as `0x${string}`]
          }
        ]
      });

      console.log('User limits results:', {
        myKarma,
        dailyGiven,
        dailySlashed,
        slashedToThisUser
      });

      setUserLimits({
        myKarma: myKarma.status === 'success' ? Number(formatEther(myKarma.result as bigint)) : 0,
        dailyGiven: dailyGiven.status === 'success' ? Number(formatEther(dailyGiven.result as bigint)) : 0,
        dailySlashed: dailySlashed.status === 'success' ? Number(formatEther(dailySlashed.result as bigint)) : 0,
        slashedToThisUser: slashedToThisUser.status === 'success' ? Number(formatEther(slashedToThisUser.result as bigint)) : 0
      });

    } catch (error) {
      console.error('Error fetching user limits:', error);
    }
  };

  useEffect(() => {
    if (address) {
      fetchProfileData(address);

      // Check if this is the current user's profile
      if (session.status === 'authenticated' && session.data?.user?.walletAddress) {
        const currentUser = session.data.user.walletAddress;
        setIsCurrentUser(address.toLowerCase() === currentUser.toLowerCase());

        // Fetch user limits for modal functionality
        if (address.toLowerCase() !== currentUser.toLowerCase()) {
          fetchUserLimits(currentUser);
        }
      }
    }
  }, [address, session.status, session.data?.user?.walletAddress]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!profileData.isRegistered) {
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
            <h1 className="text-xl font-bold text-black">Profile</h1>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-300 text-center min-h-[400px] flex flex-col justify-center items-center">
            <div className="text-6xl mb-6">🚫</div>
            <h2 className="text-2xl font-bold text-black mb-4">User Not Registered</h2>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              This user hasn't joined the Karam community yet.
            </p>
            <p className="text-sm text-gray-500 break-all">
              {address}
            </p>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold text-black">
            {isCurrentUser ? 'My Profile' : 'Profile'}
          </h1>
        </div>

        {/* Main Profile Card */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-4 border-2 border-gray-300 text-center">
          {/* Profile Picture */}
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center border-2 border-gray-400 mx-auto mb-4">
            <span className="text-black text-2xl font-bold">
              {address.slice(2, 4).toUpperCase()}
            </span>
          </div>

          {/* Address */}
          <p className="text-sm text-gray-600 mb-4 break-all">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>

          {/* Current Karma */}
          <div className="mb-6">
            <p className="text-gray-600 text-lg mb-2">current karma</p>
            <div className="text-6xl font-bold text-black mb-4">
              {profileData.karma}
            </div>
          </div>

          {/* Action Buttons - only show if not current user */}
          {!isCurrentUser && (
            <div className="flex gap-4 w-full">
              <Button
                onClick={() => setShowModal('give')}
                variant="primary"
                size="lg"
                className="flex-1"
              >
                Give Karma
              </Button>
              <Button
                onClick={() => setShowModal('slash')}
                variant="secondary"
                size="lg"
                className="flex-1"
              >
                Slash Karma
              </Button>
            </div>
          )}

          <KarmaModal
            type={showModal || 'give'}
            isOpen={showModal !== null}
            onClose={() => setShowModal(null)}
            targetAddress={address}
            amount={amount}
            setAmount={setAmount}
            reason={reason}
            setReason={setReason}
            onConfirm={async () => {
              setIsTransacting(true);
              try {
                const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
                  transaction: [{
                    address: WORLDMAINNET_KARAM_CONTRACT_ADDRESS,
                    abi: KARAM_CONTRACT_ABI,
                    functionName: showModal === 'give' ? 'giveKarma' : 'slashKarma',
                    args: [address, parseEther(amount.toString()), reason],
                  }],
                });
                if (finalPayload.status === 'success') {
                  setShowModal(null);
                  setAmount(0);
                  setReason('');
                  setTimeout(() => fetchProfileData(address), 2000);
                }
              } catch (error) {
                console.error('Transaction failed:', error);
              } finally {
                setIsTransacting(false);
              }
            }}
            isTransacting={isTransacting}
            maxAmount={showModal === 'give' ?
              Math.min(userLimits.myKarma, 30 - userLimits.dailyGiven) :
              Math.min(20 - userLimits.dailySlashed, 5 - userLimits.slashedToThisUser)
            }
            userLimits={userLimits}
          />
        </div>

        {/* Stats Section */}
        <div className="bg-gray-100 rounded-xl p-4 mb-6 border-2 border-gray-300">
          <h3 className="font-semibold text-black mb-4">Karma Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Total Received</span>
              <span className="font-medium text-green-600">+{profileData.totalReceived}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Total Slashed</span>
              <span className="font-medium text-red-600">-{profileData.totalSlashed}</span>
            </div>

          </div>
        </div>


        {/* Recent Activity Placeholder */}
        <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-300">
          <h3 className="font-semibold text-black mb-4">Recent Activity</h3>
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">Activity history coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}