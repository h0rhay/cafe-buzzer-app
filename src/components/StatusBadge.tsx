import { memo } from "react";
import type { BuzzerStatus } from "../lib/api/buzzers";

interface StatusBadgeProps {
  status: BuzzerStatus;
  isOverdue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const STATUS_STYLES = {
  active: {
    base: 'bg-blue-100 text-blue-800',
    overdue: 'bg-red-100 text-red-800'
  },
  ready: 'bg-green-100 text-green-800',
  picked_up: 'bg-gray-100 text-gray-800',
  canceled: 'bg-red-100 text-red-800',
  expired: 'bg-gray-100 text-gray-600'
} as const;

const SIZE_STYLES = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base'
} as const;

const STATUS_TEXT: Record<BuzzerStatus, string> = {
  active: 'Active',
  ready: 'Ready',
  picked_up: 'Picked Up',
  canceled: 'Canceled',
  expired: 'Expired'
};

const StatusBadge = memo(function StatusBadge({ 
  status, 
  isOverdue = false, 
  size = 'md',
  className = '' 
}: StatusBadgeProps) {
  const getStatusStyle = () => {
    if (status === 'active') {
      return isOverdue ? STATUS_STYLES.active.overdue : STATUS_STYLES.active.base;
    }
    return STATUS_STYLES[status] || STATUS_STYLES.active.base;
  };

  const displayText = status === 'active' && isOverdue ? 'Overdue' : STATUS_TEXT[status];

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${SIZE_STYLES[size]}
      ${getStatusStyle()}
      ${className}
    `}>
      {displayText}
    </span>
  );
});

export { StatusBadge };
