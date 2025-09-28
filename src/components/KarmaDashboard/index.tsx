'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import { walletAuth } from '@/auth/wallet';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { KARAM_CONTRACT_ABI, WORLDMAINNET_KARAM_CONTRACT_ADDRESS } from '@/constants';
import { createPublicClient, http, formatEther } from 'viem';
import { worldchain, sepolia } from 'viem/chains';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { createEnsPublicClient } from '@ensdomains/ensjs';

export const KarmaDashboard = () => {
  const session = useSession();
  const { isInstalled } = useMiniKit();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [karmaBalance, setKarmaBalance] = useState<number>(0);
  const [dailyGiven, setDailyGiven] = useState<number>(0);
  const [dailyLimit] = useState<number>(30);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [socialConnections, setSocialConnections] = useState({
    twitter: '',
    github: '',
    discord: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const worldchainPublicClient = createPublicClient({
    chain: worldchain,
    transport: http(),
  });

  const ensClient = createEnsPublicClient({
    chain: sepolia,
    transport: http()
  });

  const fetchUserData = async (userAddress: string) => {
    try {
      setIsLoading(true);
      console.log('Fetching data for address:', userAddress);

      const [
        registrationStatus,
        karmaAmount,
        dailyKarmaGiven,
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
            functionName: 'karmaGivenInDay',
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

      console.log('Contract call results:', {
        registrationStatus,
        karmaAmount,
        dailyKarmaGiven,
        connections
      });

      if (registrationStatus.status === 'success') {
        const registered = registrationStatus.result as boolean;
        console.log('Registration status:', registered);
        setIsRegistered(registered);

        // Redirect to registration if user is not registered
        if (!registered) {
          console.log('User not registered, redirecting to /register');
          router.push('/register');
          return;
        }
      }

      if (karmaAmount.status === 'success') {
        const karma = Number(formatEther(karmaAmount.result as bigint));
        console.log('Karma balance:', karma);
        setKarmaBalance(karma);
      }

      if (dailyKarmaGiven.status === 'success') {
        const dailyGiven = Number(formatEther(dailyKarmaGiven.result as bigint));
        console.log('Daily karma given:', dailyGiven);
        setDailyGiven(dailyGiven);
      }

      if (connections.status === 'success') {
        const [twitter, github, discord] = connections.result as [string, string, string];
        console.log('Social connections:', { twitter, github, discord });
        setSocialConnections({
          twitter: twitter || '',
          github: github || '',
          discord: discord || ''
        });
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

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

  // Fetch user data when authenticated
  useEffect(() => {
    if (session.status === 'authenticated' && session.data?.user?.walletAddress) {
      fetchUserData(session.data.user.walletAddress);
    } else if (session.status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [session.status, session.data?.user?.walletAddress]);

  // Check for refresh param (set when coming back from registration)
  useEffect(() => {
    const shouldRefresh = searchParams.get('refresh');
    if (shouldRefresh && session.status === 'authenticated' && session.data?.user?.walletAddress) {
      console.log('Refresh param detected, fetching fresh data...');
      // Remove the refresh param from URL
      router.replace('/');
      // Fetch fresh data
      fetchUserData(session.data.user.walletAddress);
    }
  }, [searchParams, session.status, session.data?.user?.walletAddress]);

  // ENS search functionality
  const searchENSDomains = async (searchTerm: string) => {
    try {
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      let addressToNavigate = searchQuery.trim();

      // Check if it's an ENS domain (contains letters and ends with .eth or doesn't have 0x prefix)
      if (!addressToNavigate.startsWith('0x')) {
        console.log('Attempting ENS resolution for:', addressToNavigate);

        // Add .eth if not present
        const ensName = addressToNavigate.endsWith('.eth') ? addressToNavigate : `${addressToNavigate}.eth`;
        const resolvedAddress = await searchENSDomains(addressToNavigate);

        if (resolvedAddress) {
          addressToNavigate = resolvedAddress.value;
          console.log('ENS resolved to address:', addressToNavigate);
        } else {
          alert('ENS domain not found or invalid address');
          setIsSearching(false);
          return;
        }
      }

      // Validate address format
      if (!addressToNavigate.startsWith('0x') || addressToNavigate.length !== 42) {
        alert('Invalid address format');
        setIsSearching(false);
        return;
      }

      // Navigate to profile
      router.push(`/profile/${addressToNavigate}`);
      setSearchQuery(''); // Clear search after navigation

    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle give/slash karma clicks - focus search bar
  const handleGiveKarmaClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      setSearchQuery('');
      // Add a little shake animation or highlight
      searchInputRef.current.style.borderColor = '#22c55e';
      searchInputRef.current.placeholder = 'Search user to give karma to...';
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.style.borderColor = '';
          searchInputRef.current.placeholder = 'Search users (0x... or vitalik.eth)...';
        }
      }, 2000);
    }
  };

  const handleSlashKarmaClick = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      setSearchQuery('');
      // Add a little shake animation or highlight
      searchInputRef.current.style.borderColor = '#ef4444';
      searchInputRef.current.placeholder = 'Search user to slash karma from...';
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.style.borderColor = '';
          searchInputRef.current.placeholder = 'Search users (0x... or vitalik.eth)...';
        }
      }, 2000);
    }
  };

  // Add a refresh button or auto-refresh mechanism
  const refreshData = () => {
    if (session.status === 'authenticated' && session.data?.user?.walletAddress) {
      console.log('Manually refreshing user data...');
      fetchUserData(session.data.user.walletAddress);
    }
  };

  if (session.status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // if (!isInstalled) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
  //       <div className="px-3 py-4 max-w-sm mx-auto">
  //         <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-300 text-center min-h-[400px] flex flex-col justify-center items-center">
  //           <div className="text-6xl mb-6">📱</div>
  //           <h1 className="text-2xl font-bold text-black mb-4">
  //             World App Required
  //           </h1>
  //           <p className="text-gray-600 text-center mb-6 leading-relaxed">
  //             This mini-app can only be accessed through the World App. Please open this link in World App to continue.
  //           </p>
  //           <div className="rounded-xl p-4 w-full">
  //             <p className="text-sm text-gray-700 text-center">
  //               Download the World App from your app store and try again
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="px-3 py-4 max-w-sm mx-auto">
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-6">
        {/* User Profile Picture */}
        <div
          className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center border-2 border-gray-400 cursor-pointer hover:bg-gray-400 transition-colors"
          onClick={() => window.location.href = '/my-profile'}
        >
          <span className="text-black text-sm font-bold">
            {session?.data?.user?.username?.charAt(0).toUpperCase() || 'A'}
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex gap-2">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search users (0x... or vitalik.eth)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSearching}
            style={{ color: '#000000', backgroundColor: '#ffffff' }}
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:border-black disabled:opacity-50 transition-colors duration-200"
          />
          <Button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            variant="primary"
            size="sm"
            className="!px-3"
          >
            {isSearching ? '...' : '🔍'}
          </Button>
        </div>
      </div>

      {/* Main Karma Card */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-4 border-2 border-gray-300 text-center min-h-[450px] mt-15 flex flex-col justify-center items-center">
        <p className="text-gray-600 text-lg mb-3">your karma</p>
        <div className="text-[10rem] font-bold text-black mb-6 leading-none">
          {karmaBalance}
        </div>

        {/* Primary Actions */}
        <div className="flex gap-4 w-full">
          <Button
            onClick={handleGiveKarmaClick}
            variant="primary"
            size="lg"
            className="flex-1"
          >
            Give Karma
          </Button>
          <Button
            onClick={handleSlashKarmaClick}
            variant="secondary"
            size="lg"
            className="flex-1"
          >
            Slash Karma
          </Button>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="bg-gray-100 rounded-xl p-4 mt-15 mb-6 border-2 border-gray-300">
        <h3 className="font-semibold text-black mb-3">Today's Activity</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Karma Given</span>
            <span className="font-medium text-black">{dailyGiven}/30</span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div
              className="bg-black h-2 rounded-full transition-all duration-300"
              style={{ width: `${(dailyGiven / 30) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Social Status */}
      <div className="bg-black text-white rounded-xl p-4 mb-6">
        <h3 className="font-semibold mb-3 text-white">Connected Platforms</h3>
        <div className="flex gap-3">
          <div className={`w-8 h-8 ${socialConnections.twitter ? 'bg-white' : 'bg-gray-600'} rounded-full flex items-center justify-center`}>
            <span className={`${socialConnections.twitter ? 'text-black' : 'text-white'} text-xs font-bold`}>T</span>
          </div>
          <div className={`w-8 h-8 ${socialConnections.github ? 'bg-white' : 'bg-gray-600'} rounded-full flex items-center justify-center`}>
            <span className={`${socialConnections.github ? 'text-black' : 'text-white'} text-xs font-bold`}>G</span>
          </div>
          <div className={`w-8 h-8 ${socialConnections.discord ? 'bg-white' : 'bg-gray-600'} rounded-full flex items-center justify-center`}>
            <span className={`${socialConnections.discord ? 'text-black' : 'text-white'} text-xs font-bold`}>D</span>
          </div>
        </div>
        <p className="text-gray-300 text-xs mt-2">
          {socialConnections.twitter || socialConnections.github || socialConnections.discord
            ? `Connected: ${[socialConnections.twitter && 'Twitter', socialConnections.github && 'GitHub', socialConnections.discord && 'Discord'].filter(Boolean).join(', ')}`
            : 'Connect platforms to earn bonus karma'
          }
        </p>
      </div>

      {/* Recent Activity Preview */}
      <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-300">
        <h3 className="font-semibold text-black mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No recent activity yet</p>
            <p className="text-xs text-gray-400 mt-1">Start giving or slashing karma to see activity here</p>
          </div>
        </div>

        <Button
          variant="tertiary"
          size="sm"
          className="w-full mt-4"
        >
          View All Activity →
        </Button>
      </div>

      {/* Test Button */}
      <div className="mt-4">
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={() => window.location.href = '/test'}
        >
          Test Contract →
        </Button>
      </div>
    </div>
  );
};