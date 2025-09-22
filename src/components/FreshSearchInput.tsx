import React from 'react';

interface FreshSearchInputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
}

export const FreshSearchInput: React.FC<FreshSearchInputProps> = ({
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="21 21l-4.35-4.35"/>
        </svg>
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        className="
          w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200
          bg-gray-50 text-gray-900 placeholder:text-gray-500
          focus:outline-none focus:ring-4 focus:ring-[var(--fresh-primary)]/20
          focus:border-[var(--fresh-primary)] transition-all font-medium
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      />
    </div>
  );
};