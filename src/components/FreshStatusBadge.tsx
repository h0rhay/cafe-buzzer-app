import React from 'react';

interface FreshStatusBadgeProps {
  children: React.ReactNode;
  variant?: 'highlight' | 'success' | 'warning' | 'error' | 'time';
  className?: string;
}

export const FreshStatusBadge: React.FC<FreshStatusBadgeProps> = ({
  children,
  variant = 'highlight',
  className = ''
}) => {
  const getVariantClasses = () => {
    const baseClasses = 'border-2';

    switch (variant) {
      case 'success':
        return `${baseClasses} bg-[var(--fresh-success)] text-[var(--fresh-success-foreground)] border-[var(--fresh-success)]`;
      case 'warning':
        return `${baseClasses} bg-[var(--fresh-warning)] text-[var(--fresh-warning-foreground)] border-[var(--fresh-warning)]`;
      case 'error':
        return `${baseClasses} bg-[var(--fresh-error)] text-[var(--fresh-error-foreground)] border-[var(--fresh-error)]`;
      case 'time':
        return `${baseClasses} bg-gray-800 text-white border-gray-800`;
      default:
        return `${baseClasses} bg-gray-500 text-white border-gray-500`;
    }
  };

  return (
    <div className={`
      inline-flex items-center px-3 py-1 rounded-full
      text-xs font-bold uppercase tracking-wide
      ${getVariantClasses()}
      ${className}
    `}>
      {children}
    </div>
  );
};