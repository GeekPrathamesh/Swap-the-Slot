export type EventStatus = 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING';

export interface Event {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: EventStatus;
  ownerId: string;
  ownerName?: string;
}

export interface SwapRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  targetUserId: string;
  targetUserName: string;
  offeredSlotId: string;
  offeredSlot: Event;
  requestedSlotId: string;
  requestedSlot: Event;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
