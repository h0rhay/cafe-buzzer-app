import React from 'react';

interface FreshProductCardProps {
  name: string;
  calories: string;
  price: string;
  count?: number;
  isSelected?: boolean;
  onToggle?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  imageBg?: string;
  imageUrl?: string;
  className?: string;
}

export const FreshProductCard: React.FC<FreshProductCardProps> = ({
  name,
  calories,
  price,
  count = 0,
  isSelected = false,
  onToggle,
  onIncrement,
  onDecrement,
  imageBg = 'bg-gray-100',
  imageUrl,
  className = ''
}) => {
  return (
    <div className={`
      relative rounded-2xl overflow-hidden transition-all duration-200
      ${isSelected
        ? 'bg-[var(--fresh-selection-yellow)] border-t-2 border-l-2 border-b-4 border-r-4 border-gray-800 shadow-lg hover:shadow-xl'
        : 'bg-white border-t-2 border-l-2 border-b-4 border-r-4 border-gray-300 hover:border-gray-400 hover:shadow-md'
      }
      ${className}
    `}>
      {/* Main content area */}
      <div className="p-4 pb-3">
        {/* Product image or placeholder */}
        <div className={`w-16 h-16 ${imageBg} rounded-full mx-auto mb-3 border-2 border-gray-200 flex items-center justify-center overflow-hidden`}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          )}
        </div>

        {/* Counter controls for selected items */}
        {isSelected && count > 0 && (
          <div className="flex items-center justify-center mb-3">
            <div className="flex items-center bg-white rounded-full border-2 border-gray-300 overflow-hidden">
              <button
                onClick={onDecrement}
                className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                aria-label={`Decrease ${name} quantity`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18"/>
                </svg>
              </button>
              <span className="px-3 py-1 font-bold text-gray-900 min-w-[2rem] text-center">{count}</span>
              <button
                onClick={onIncrement}
                className="p-2 hover:bg-gray-50 text-gray-600 transition-colors"
                aria-label={`Increase ${name} quantity`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14m-7-7h14"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        <h3 className="font-bold text-center mb-1 text-gray-900">
          {name}
        </h3>
      </div>

      {/* Bottom info section */}
      <div className={`px-4 py-2 text-center text-sm ${isSelected ? 'bg-gray-100/50' : 'bg-gray-50'}`}>
        <p className="text-gray-600">{calories} - {price}</p>
      </div>

      {/* Clickable area for selection (only when not selected) */}
      {!isSelected && (
        <button
          onClick={onToggle}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label={`Add ${name}`}
        />
      )}
    </div>
  );
};