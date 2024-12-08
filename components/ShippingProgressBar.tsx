import React from 'react';

interface ShippingProgressBarProps {
  currentAmount: number;
  freeShippingThreshold: number;
}

const ShippingProgressBar: React.FC<ShippingProgressBarProps> = ({ currentAmount, freeShippingThreshold }) => {
  const progress = Math.min((currentAmount / freeShippingThreshold) * 100, 100);
  const remainingAmount = Math.max(freeShippingThreshold - currentAmount, 0);

  return (
    <div className="mt-4 mb-6">
      {remainingAmount > 0 ? (
        <p className="text-sm mb-2 text-gray-600">
          Add <span className="font-semibold">€{remainingAmount.toFixed(2)}</span> for free shipping
        </p>
      ) : (
        <p className="text-sm mb-2 text-green-600 font-semibold">
          You've qualified for free shipping!
        </p>
      )}
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-black h-full rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ShippingProgressBar;

