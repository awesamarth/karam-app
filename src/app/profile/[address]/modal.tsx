import { Button } from '@worldcoin/mini-apps-ui-kit-react';

interface KarmaModalProps {
  type: 'give' | 'slash';
  isOpen: boolean;
  onClose: () => void;
  targetAddress: string;
  amount: number;
  setAmount: (amount: number) => void;
  reason: string;
  setReason: (reason: string) => void;
  onConfirm: () => void;
  isTransacting: boolean;
  maxAmount: number;
  userLimits: {
    myKarma: number;
    dailyGiven: number;
    dailySlashed: number;
    slashedToThisUser: number;
  };
}

export function KarmaModal({
  type,
  isOpen,
  onClose,
  targetAddress,
  amount,
  setAmount,
  reason,
  setReason,
  onConfirm,
  isTransacting,
  maxAmount,
  userLimits
}: KarmaModalProps) {
  if (!isOpen) return null;

  const isGive = type === 'give';
  const cost = isGive ? amount : Math.ceil(amount / 5);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">
            {isGive ? 'Give Karma' : 'Slash Karma'}
          </h2>
          <button
            onClick={onClose}
            disabled={isTransacting}
            className="text-gray-500 hover:text-black text-xl"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">To: {targetAddress.slice(0, 6)}...{targetAddress.slice(-4)}</p>
        </div>

        {/* Amount Slider */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-black mb-2">
            Amount: {amount} karma
          </label>
          <input
            type="range"
            min="0"
            max={maxAmount}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={isTransacting}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>{maxAmount}</span>
          </div>
        </div>

        {/* Limits Display */}
        <div className="mb-4 text-xs text-gray-600 space-y-1">
          {isGive ? (
            <>
              <div>Daily given: {userLimits.dailyGiven}/30</div>
              <div>Your karma: {userLimits.myKarma}</div>
            </>
          ) : (
            <>
              <div>Daily slashed: {userLimits.dailySlashed}/20</div>
              <div>To this user: {userLimits.slashedToThisUser}/5</div>
            </>
          )}
        </div>

        {/* Cost Display */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm">
            <div className="flex justify-between">
              <span>{isGive ? 'You give:' : 'They lose:'}</span>
              <span className={isGive ? 'text-green-600' : 'text-red-600'}>
                {isGive ? '+' : '-'}{amount}
              </span>
            </div>
            {!isGive && (
              <div className="flex justify-between text-red-600">
                <span>You lose:</span>
                <span>-{cost}</span>
              </div>
            )}
          </div>
        </div>

        {/* Reason Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-black mb-2">
            Reason*
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isTransacting}
            placeholder={`Why are you ${isGive ? 'giving' : 'slashing'} karma?`}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-black resize-none"
            rows={3}
            maxLength={200}
            style={{ color: '#000000', backgroundColor: '#ffffff' }}
          />
          <div className="text-xs text-gray-500 mt-1">{reason.length}/200</div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 w-full">
          <Button
            onClick={onClose}
            disabled={isTransacting}
            variant="secondary"
            size="lg"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isTransacting || amount === 0 || !reason.trim() || amount > maxAmount}
            variant={isGive ? "primary" : "secondary"}
            size="lg"
            className="flex-1"
          >
            {isTransacting ? 'Processing...' : `${isGive ? 'Give' : 'Slash'} Karma`}
          </Button>
        </div>
      </div>
    </div>
  );
}