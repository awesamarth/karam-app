'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { walletAuth } from '@/auth/wallet';
import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { useRouter } from 'next/navigation';
import { KARAM_CONTRACT_ABI, WORLDMAINNET_KARAM_CONTRACT_ADDRESS } from '@/constants';
import { MiniKit } from '@worldcoin/minikit-js';

export default function RegisterPage() {
  const session = useSession();
  const { isInstalled } = useMiniKit();
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState('');

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

  const registerEnsSubdomain = async (username: string) => {
    // TODO: Implement ENS subdomain registration
    console.log('Registering ENS subdomain:', `${username}.karam.eth`);
    // Placeholder function - will be implemented later
  };

  const handleRegister = async () => {
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    setIsRegistering(true);
    try {
      console.log('Registering user on contract...');

      // Call register() contract function
      const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: WORLDMAINNET_KARAM_CONTRACT_ADDRESS,
            abi: KARAM_CONTRACT_ABI,
            functionName: 'register',
            args: [],
          },
        ],
      });

      if (finalPayload.status === 'success') {
        console.log('Registration transaction submitted:', finalPayload.transaction_id);

        // Register ENS subdomain (TODO: implement later)
        await registerEnsSubdomain(username);

        // Wait a bit for transaction to be mined before redirecting
        setTimeout(() => {
          router.push('/?refresh=true');
        }, 2000);
      } else {
        console.error('Registration transaction failed:', finalPayload);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  if (session.status === 'loading') {
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
  //           <div className="rounded-xl p-4  w-full">
  //             <p className="text-sm text-gray-700 text-center">
  //               Download the World App from your app store and try again
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }



  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-300 text-center min-h-[500px] flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-black mb-6">
              Welcome to Karam
            </h1>
            <p className="text-gray-600 text-lg mb-8 mt-8 pt-7 leading-relaxed">
              An unique, contrarian and incorruptible take on social reputation systems where you give your own <b>karma</b> to award someone else.
            </p>
            <Button
              onClick={nextStep}
              size="lg"
              variant="primary"
              className="w-full"
            >
              Next
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-300 min-h-[500px]">
            <h2 className="text-2xl font-bold text-black mb-12 text-center">How it works:</h2>
            <div className="space-y-4 text-sm mb-8 mt-4">
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <p className="text-gray-700 leading-relaxed">Start with 500 karma</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <p className="text-gray-700 leading-relaxed">Give karma to reward someone for their good behavior. All the karma you give to them gets reduced from your karma balance</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <p className="text-gray-700 leading-relaxed">Slash karma to penalize bad behavior. 1/5th of the karma you slash gets slashed from your own karma as well</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  4
                </div>
                <p className="text-gray-700 leading-relaxed">Connect social platforms for bonus karma</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  5
                </div>
                <p className="text-gray-700 leading-relaxed">Karma redistributions can happen anytime between 25 to 50 days from the previous redistribution date</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={prevStep}
                size="lg"
                variant="tertiary"
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={nextStep}
                size="lg"
                variant="primary"
                className="flex-1"
              >
                Next
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-300 min-h-[500px] flex flex-col">
            <h2 className="text-2xl font-bold text-black mb-6 text-center">Choose Your Username</h2>

            {/* User Info */}
            <div className="bg-gray-100 rounded-xl p-4 mb-6 border-2 border-gray-300">
              <h3 className="font-semibold text-black mb-3">Your Account</h3>
              <p className="text-sm text-gray-600 mb-2">
                Address: {session?.data?.user?.walletAddress?.slice(0, 6)}...{session?.data?.user?.walletAddress?.slice(-4)}
              </p>
            </div>

            {/* Username Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-black mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                  placeholder="Enter username"
                  style={{ color: '#000000', backgroundColor: '#ffffff' }}
                  className="w-full px-4 py-6 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black placeholder-gray-500"
                  maxLength={20}
                />
                <div className="absolute right-3 top-1 text-sm text-gray-500">
                  .karam.eth
                </div>
              </div>
              {username && (
                <p className="text-sm text-gray-600 mt-2">
                  Your ENS subdomain: <span className="font-medium">{username}.karam.eth</span>
                </p>
              )}
            </div>

            {/* Register Button */}
            <div className="mt-auto">
              <Button
                onClick={handleRegister}
                disabled={isRegistering || !username.trim()}
                size="lg"
                variant="primary"
                className="w-full mb-4"
              >
                {isRegistering ? 'Registering...' : 'Register & Start Using Karam'}
              </Button>

              <Button
                onClick={prevStep}
                size="lg"
                variant="tertiary"
                className="w-full"
                disabled={isRegistering}
              >
                Back
              </Button>
            </div>

            {/* Footer */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                By registering, you agree to participate in the Karam community
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="px-3 py-4 max-w-sm mx-auto">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex gap-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  step <= currentStep ? 'bg-black' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {renderStep()}
      </div>
    </div>
  );
}