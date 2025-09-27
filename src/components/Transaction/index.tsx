// 'use client';

// import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/constants';
// import { Button, LiveFeedback } from '@worldcoin/mini-apps-ui-kit-react';
// import { MiniKit } from '@worldcoin/minikit-js';
// import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react';
// import { useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';
// import { walletAuth } from '@/auth/wallet';
// import { useMiniKit } from '@worldcoin/minikit-js/minikit-provider';
// import { createPublicClient, http } from 'viem';
// import { worldchainSepolia, worldchain } from 'viem/chains';

// export const Transaction = () => {
//   const session = useSession();
//   const { isInstalled } = useMiniKit();
//   const [buttonState, setButtonState] = useState<
//     'pending' | 'success' | 'failed' | undefined
//   >(undefined);
//   const [whichButton, setWhichButton] = useState<'increment' | 'setNumber'>(
//     'increment',
//   );
//   const [currentNumber, setCurrentNumber] = useState<number | null>(null);

//   // This triggers the useWaitForTransactionReceipt hook when updated
//   const [transactionId, setTransactionId] = useState<string>('');

//   // Feel free to use your own RPC provider for better performance
//   const client = createPublicClient({
//     chain: worldchainSepolia,
//     transport: http(),
//   });

//   const {
//     isLoading: isConfirming,
//     isSuccess: isConfirmed,
//     isError,
//     error,
//   } = useWaitForTransactionReceipt({
//     client: client,
//     appConfig: {
//       app_id: process.env.NEXT_PUBLIC_APP_ID as `app_${string}`,
//     },
//     transactionId: transactionId,
//   });

//   // Auto-login useEffect
//   useEffect(() => {
//     const autoLogin = async () => {
//       if (isInstalled && session.status === 'unauthenticated') {
//         try {
//           await walletAuth();
//         } catch (error) {
//           console.error('Auto wallet auth failed:', error);
//         }
//       }
//     };

//     autoLogin();
//   }, [isInstalled, session.status]);

//   useEffect(() => {
//     if (transactionId && !isConfirming) {
//       if (isConfirmed) {
//         console.log('Transaction confirmed!');
//         setButtonState('success');
//         setTimeout(() => {
//           setButtonState(undefined);
//         }, 3000);
//       } else if (isError) {
//         console.error('Transaction failed:', error);
//         setButtonState('failed');
//         setTimeout(() => {
//           setButtonState(undefined);
//         }, 3000);
//       }
//     }
//   }, [isConfirmed, isConfirming, isError, error, transactionId]);

//   const onClickIncrement = async () => {
//     setTransactionId('');
//     setWhichButton('increment');
//     setButtonState('pending');

//     try {
//       const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
//         transaction: [
//           {
//             address: CONTRACT_ADDRESS,
//             abi: CONTRACT_ABI,
//             functionName: 'increment',
//             args: [],
//           },
//         ],
//       });

//       if (finalPayload.status === 'success') {
//         console.log(
//           'Transaction submitted, waiting for confirmation:',
//           finalPayload.transaction_id,
//         );
//         console.log('Full finalPayload:', finalPayload);
//         setTransactionId(finalPayload.transaction_id);
//       } else {
//         console.error('Transaction submission failed:', finalPayload);
//         setButtonState('failed');
//         setTimeout(() => {
//           setButtonState(undefined);
//         }, 3000);
//       }
//     } catch (err) {
//       console.error('Error sending transaction:', err);
//       setButtonState('failed');
//       setTimeout(() => {
//         setButtonState(undefined);
//       }, 3000);
//     }
//   };

//   const onClickSetNumber = async () => {
//     setTransactionId('');
//     setWhichButton('setNumber');
//     setButtonState('pending');

//     try {
//       const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
//         transaction: [
//           {
//             address: CONTRACT_ADDRESS,
//             abi: CONTRACT_ABI,
//             functionName: 'setNumber',
//             args: [42], // Setting to 42 as example
//           },
//         ],
//       });

//       if (finalPayload.status === 'success') {
//         console.log(
//           'Transaction submitted, waiting for confirmation:',
//           finalPayload.transaction_id,
//         );
//         setTransactionId(finalPayload.transaction_id);
//       } else {
//         console.error('Transaction submission failed:', finalPayload);
//         setButtonState('failed');
//         setTimeout(() => {
//           setButtonState(undefined);
//         }, 3000);
//       }
//     } catch (err) {
//       console.error('Error sending transaction:', err);
//       setButtonState('failed');
//       setTimeout(() => {
//         setButtonState(undefined);
//       }, 3000);
//     }
//   };

//   const fetchCurrentNumber = async () => {

//     console.log("session data:", session?.data)
//     console.log("session user:", session?.data?.user)
//     console.log("user address is: ", session?.data?.user?.walletAddress)
//     console.log("user is: ", MiniKit.user)
//     try {
//       const result = await client.readContract({
//         address: CONTRACT_ADDRESS as `0x${string}`,
//         abi: CONTRACT_ABI,
//         functionName: 'number',
//       });
//       setCurrentNumber(Number(result));
//     } catch (err) {
//       console.error('Error fetching current number:', err);
//     }
//   };

//   return (
//     <div className="grid w-full gap-4">
//       <p className="text-lg font-semibold text-white">Counter Contract</p>
//       <div className="flex items-center gap-2">
//         <p className="text-sm text-white">Current Number: {currentNumber !== null ? currentNumber : 'Not loaded'}</p>
//         <Button
//           onClick={fetchCurrentNumber}
//           size="sm"
//           variant="secondary"
//         >
//           Refresh
//         </Button>
//       </div>
//       <LiveFeedback
//         label={{
//           failed: 'Transaction failed',
//           pending: 'Transaction pending',
//           success: 'Counter incremented!',
//         }}
//         state={whichButton === 'increment' ? buttonState : undefined}
//         className="w-full"
//       >
//         <Button
//           onClick={onClickIncrement}
//           disabled={buttonState === 'pending'}
//           size="lg"
//           variant="primary"
//           className="w-full"
//         >
//           Increment Counter
//         </Button>
//       </LiveFeedback>
//       <LiveFeedback
//         label={{
//           failed: 'Transaction failed',
//           pending: 'Transaction pending',
//           success: 'Number set to 42!',
//         }}
//         state={whichButton === 'setNumber' ? buttonState : undefined}
//         className="w-full"
//       >
//         <Button
//           onClick={onClickSetNumber}
//           disabled={buttonState === 'pending'}
//           size="lg"
//           variant="tertiary"
//           className="w-full"
//         >
//           Set Number to 42
//         </Button>
//       </LiveFeedback>
//     </div>
//   );
// };