import { EventStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: EventStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusConfig = {
    BUSY: { label: 'Busy', className: 'status-busy' },
    SWAPPABLE: { label: 'Swappable', className: 'status-swappable' },
    SWAP_PENDING: { label: 'Pending', className: 'status-pending' },
  };

  const config = statusConfig[status];

  return (
    <Badge className={cn(config.className, 'font-medium', className)}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
