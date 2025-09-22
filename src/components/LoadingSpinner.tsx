import { memo } from "react";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const SIZE_STYLES = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8', 
  lg: 'h-12 w-12'
} as const;

const LoadingSpinner = memo(function LoadingSpinner({ 
  size = 'md', 
  className = '',
  label = 'Loading...'
}: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <div 
        className={`
          animate-spin rounded-full border-b-2 border-blue-600
          ${SIZE_STYLES[size]}
          ${className}
        `}
        role="status"
        aria-label={label}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
});

export { LoadingSpinner };
