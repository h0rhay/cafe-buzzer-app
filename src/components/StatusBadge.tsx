import { memo } from "react";
import type { BuzzerStatus } from "../lib/api/buzzers";
import { FreshStatusBadge } from './FreshStatusBadge';

interface StatusBadgeProps {
  status: BuzzerStatus;
  isOverdue?: boolean;
  className?: string;
}

const STATUS_TEXT: Record<BuzzerStatus, string> = {
  active: 'Active',
  ready: 'Ready',
  picked_up: 'Picked Up',
  canceled: 'Canceled',
  expired: 'Expired'
};

// Map BuzzerStatus to Fresh variant
const getStatusVariant = (status: BuzzerStatus, isOverdue: boolean) => {
  if (status === 'active') {
    return isOverdue ? 'error' : 'highlight';
  }
  switch (status) {
    case 'ready':
      return 'success';
    case 'canceled':
      return 'error';
    case 'picked_up':
    case 'expired':
      return 'time';
    default:
      return 'highlight';
  }
};

const StatusBadge = memo(function StatusBadge({
  status,
  isOverdue = false,
  className = ''
}: StatusBadgeProps) {
  const variant = getStatusVariant(status, isOverdue);
  const displayText = status === 'active' && isOverdue ? 'Overdue' : STATUS_TEXT[status];

  return (
    <FreshStatusBadge
      variant={variant}
      className={className}
    >
      {displayText}
    </FreshStatusBadge>
  );
});

export { StatusBadge };
