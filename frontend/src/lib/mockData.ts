import { Event, SwapRequest, User } from '@/types';

export const currentUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
};

export const mockEvents: Event[] = [
  {
    id: 'event-1',
    title: 'Team Meeting',
    startTime: '2025-11-10T09:00:00',
    endTime: '2025-11-10T10:00:00',
    status: 'BUSY',
    ownerId: 'user-1',
    ownerName: 'John Doe',
  },
  {
    id: 'event-2',
    title: 'Gym Session',
    startTime: '2025-11-12T18:00:00',
    endTime: '2025-11-12T19:00:00',
    status: 'SWAPPABLE',
    ownerId: 'user-1',
    ownerName: 'John Doe',
  },
  {
    id: 'event-3',
    title: 'Dentist Appointment',
    startTime: '2025-11-15T14:00:00',
    endTime: '2025-11-15T15:00:00',
    status: 'SWAP_PENDING',
    ownerId: 'user-1',
    ownerName: 'John Doe',
  },
];

export const mockMarketplaceSlots: Event[] = [
  {
    id: 'market-1',
    title: 'Yoga Class',
    startTime: '2025-11-11T07:00:00',
    endTime: '2025-11-11T08:00:00',
    status: 'SWAPPABLE',
    ownerId: 'user-2',
    ownerName: 'Sarah Smith',
  },
  {
    id: 'market-2',
    title: 'Piano Lesson',
    startTime: '2025-11-13T16:00:00',
    endTime: '2025-11-13T17:00:00',
    status: 'SWAPPABLE',
    ownerId: 'user-3',
    ownerName: 'Mike Johnson',
  },
  {
    id: 'market-3',
    title: 'Study Group',
    startTime: '2025-11-14T19:00:00',
    endTime: '2025-11-14T21:00:00',
    status: 'SWAPPABLE',
    ownerId: 'user-4',
    ownerName: 'Emma Wilson',
  },
  {
    id: 'market-4',
    title: 'Swimming Session',
    startTime: '2025-11-16T06:00:00',
    endTime: '2025-11-16T07:00:00',
    status: 'SWAPPABLE',
    ownerId: 'user-5',
    ownerName: 'David Brown',
  },
];

export const mockIncomingRequests: SwapRequest[] = [
  {
    id: 'req-1',
    requesterId: 'user-2',
    requesterName: 'Sarah Smith',
    targetUserId: 'user-1',
    targetUserName: 'John Doe',
    offeredSlotId: 'market-1',
    offeredSlot: mockMarketplaceSlots[0],
    requestedSlotId: 'event-2',
    requestedSlot: mockEvents[1],
    status: 'PENDING',
    createdAt: '2025-11-05T10:30:00',
  },
];

export const mockOutgoingRequests: SwapRequest[] = [
  {
    id: 'req-2',
    requesterId: 'user-1',
    requesterName: 'John Doe',
    targetUserId: 'user-3',
    targetUserName: 'Mike Johnson',
    offeredSlotId: 'event-3',
    offeredSlot: mockEvents[2],
    requestedSlotId: 'market-2',
    requestedSlot: mockMarketplaceSlots[1],
    status: 'PENDING',
    createdAt: '2025-11-04T15:20:00',
  },
];
