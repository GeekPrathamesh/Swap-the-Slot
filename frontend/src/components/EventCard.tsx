import { Event } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from './StatusBadge';
import { Edit, Trash2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  onToggleSwappable?: (event: Event) => void;
  showOwner?: boolean;
}

const EventCard = ({
  event,
  onEdit,
  onDelete,
  onToggleSwappable,
  showOwner = false,
}: EventCardProps) => {
  const startDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground">
                {event.title}
              </h3>
              {showOwner && event.ownerName && (
                <p className="text-sm text-muted-foreground mt-1">
                  by {event.ownerName}
                </p>
              )}
            </div>
            <StatusBadge status={event.status} />
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium">
              {format(startDate, 'MMM dd, yyyy')}
            </p>
            <p>
              {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
            </p>
          </div>

          {(onEdit || onDelete || onToggleSwappable) && (
            <div className="flex flex-wrap gap-2 pt-2">
              {onEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(event)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(event._id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              )}
              {onToggleSwappable && event.status !== 'SWAP_PENDING' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onToggleSwappable(event)}
                  className="text-status-swappable hover:bg-status-swappable/10"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  {event.status === 'SWAPPABLE' ? 'Make Busy' : 'Make Swappable'}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
