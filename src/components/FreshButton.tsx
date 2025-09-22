import React from 'react';

interface FreshButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'tertiary' | 'order';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const FreshButton: React.FC<FreshButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-5 py-2 text-sm min-w-28';
      case 'lg': return 'px-10 py-4 text-lg min-w-32';
      default: return 'px-8 py-3 text-base min-w-28';
    }
  };

  const getVariantClasses = () => {
    const baseClasses = 'border-t-2 border-l-2 border-b-4 border-r-4';

    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-[var(--fresh-primary)] text-[var(--fresh-primary-foreground)] border-black hover:bg-[var(--fresh-primary-hover)]`;
      case 'secondary':
        return `${baseClasses} bg-white text-gray-900 border-gray-400 hover:bg-gray-50`;
      case 'accent':
        return `${baseClasses} bg-[var(--fresh-accent)] text-[var(--fresh-accent-foreground)] border-black hover:bg-[var(--fresh-accent-hover)]`;
      case 'order':
        // Signature FRESH "ORDER NOW" button with asymmetric black borders
        return `${baseClasses} bg-white text-black border-black hover:bg-gray-50`;
      case 'outline':
        return `${baseClasses} bg-white text-[var(--fresh-primary)] border-[var(--fresh-primary)] hover:bg-[var(--fresh-primary)]/5`;
      case 'tertiary':
        return `${baseClasses} text-[var(--fresh-primary)] bg-transparent border-transparent hover:border-[var(--fresh-primary)]/30`;
      default:
        return `${baseClasses} bg-[var(--fresh-primary)] text-[var(--fresh-primary-foreground)] border-[var(--fresh-primary)] hover:bg-[var(--fresh-primary-hover)]`;
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center rounded-full
        font-bold uppercase tracking-wide transition-all duration-200
        focus:outline-none focus:ring-4 focus:ring-[var(--fresh-primary)]/20
        hover:translate-x-0.5 hover:translate-y-0.5
        active:border-t-4 active:border-l-4 active:border-b-2 active:border-r-2
        active:translate-x-0 active:translate-y-0
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0
        ${getSizeClasses()}
        ${getVariantClasses()}
        ${className}
      `}
      style={{fontFamily: '"Rubik", -apple-system, BlinkMacSystemFont, sans-serif', ...({} as React.CSSProperties)}}
    >
      {children}
    </button>
  );
};