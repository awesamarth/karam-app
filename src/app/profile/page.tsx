'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const session = useSession();
  const router = useRouter();
  const [karmaBalance] = useState<number>(500);
  const [totalGiven] = useState<number>(250);
  const [totalReceived] = useState<number>(750);

  // Mock karma history - will replace with actual data
  const karmaHistory = [
    {
      id: 1,
      type: 'received',
      from: 'alex',
      amount: 10,
      reason: 'for helping with the project',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      type: 'given',
      to: 'sarah',
      amount: 15,
      reason: 'great presentation today',
      timestamp: '5 hours ago',
    },
    {
      id: 3,
      type: 'slashed',
      from: 'john',
      amount: -5,
      reason: 'being late to meeting',
      timestamp: '1 day ago',
    },
    {
      id: 4,
      type: 'received',
      from: 'mike',
      amount: 20,
      reason: 'excellent code review',
      timestamp: '2 days ago',
    },
    {
      id: 5,
      type: 'given',
      to: 'alice',
      amount: 8,
      reason: 'helping with bug fix',
      timestamp: '3 days ago',
    },
    {
      id: 6,
      type: 'received',
      from: 'bob',
      amount: 12,
      reason: 'great teamwork',
      timestamp: '4 days ago',
    },
    {
      id: 7,
      type: 'slashed',
      from: 'carol',
      amount: -3,
      reason: 'missed deadline',
      timestamp: '5 days ago',
    },
    {
      id: 8,
      type: 'given',
      to: 'dave',
      amount: 25,
      reason: 'outstanding performance',
      timestamp: '1 week ago',
    },
  ];

  if (session.status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full"></div>
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
        <h1 className="text-xl font-bold text-black">Profile</h1>
      </div>

      {/* Profile Info Card */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-6 border-2 border-gray-300 text-center">
        {/* Profile Picture */}
        <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center border-2 border-gray-400 mx-auto mb-4">
          <span className="text-black text-2xl font-bold">
            {session?.data?.user?.username?.charAt(0).toUpperCase() || 'A'}
          </span>
        </div>

        {/* User Info */}
        <h2 className="text-xl font-bold text-black mb-2">
          {session?.data?.user?.username || 'Anonymous User'}
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          {session?.data?.user?.walletAddress?.slice(0, 6)}...{session?.data?.user?.walletAddress?.slice(-4)}
        </p>

        {/* Karma Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-black">{karmaBalance}</div>
            <div className="text-xs text-gray-600">Current</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalReceived}</div>
            <div className="text-xs text-gray-600">Received</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalGiven}</div>
            <div className="text-xs text-gray-600">Given</div>
          </div>
        </div>
      </div>

      {/* Connected Platforms */}
      <div className="bg-gray-100 rounded-xl p-4 mb-6 border-2 border-gray-300">
        <h3 className="font-semibold mb-3 text-black">Connected Platforms</h3>
        <div className="flex gap-3 mb-3">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">G</span>
          </div>
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">D</span>
          </div>
        </div>
        <Button
          variant="tertiary"
          size="sm"
          className="text-black border-black hover:bg-black hover:text-white"
        >
          Connect More Platforms
        </Button>
      </div>

      {/* Karma History */}
      <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-300">
        <h3 className="font-semibold text-black mb-4">Karma History</h3>

        {/* Scrollable History */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {karmaHistory.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
            >
              {/* Status Indicator */}
              <div
                className={`w-2 h-2 rounded-full ${
                  activity.type === 'received'
                    ? 'bg-green-500'
                    : activity.type === 'given'
                    ? 'bg-blue-500'
                    : 'bg-red-500'
                }`}
              ></div>

              {/* Activity Info */}
              <div className="flex-1">
                <p className="text-sm font-medium text-black">
                  {activity.type === 'received' && `${activity.from} gave you ${activity.amount} karma`}
                  {activity.type === 'given' && `You gave ${activity.to} ${activity.amount} karma`}
                  {activity.type === 'slashed' && `${activity.from} slashed your karma`}
                </p>
                <p className="text-xs text-gray-600">{activity.reason}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
              </div>

              {/* Amount */}
              <span
                className={`text-sm font-bold ${
                  activity.type === 'received'
                    ? 'text-green-600'
                    : activity.type === 'given'
                    ? 'text-blue-600'
                    : 'text-red-600'
                }`}
              >
                {activity.type === 'received' && `+${activity.amount}`}
                {activity.type === 'given' && `-${activity.amount}`}
                {activity.type === 'slashed' && `${activity.amount}`}
              </span>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <Button
          variant="tertiary"
          size="sm"
          className="w-full mt-4"
        >
          Load More History
        </Button>
      </div>
      </div>
    </div>
  );
}