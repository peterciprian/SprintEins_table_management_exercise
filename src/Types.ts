export type Table = {
  id: string;
  tableNumber: string;
  minCapacity: number;
  maxCapacity: number;
};

export type BarArea = {
  maxCapacity: number;
  currentWaitingCount: number;
};

export enum TableState {
  FREE = "FREE",
  OCCUPIED = "OCCUPIED",
  BLOCKED = "BLOCKED",
}

export type EnhancedTable = Table & {
  currentState: TableState;
};

export type ReservationBlock = {
  id: string;
  tableId: string;
  reservationId: string;
  blockStartTime: Date;
  blockEndTime: Date;
};

export enum GroupStatus {
  SEATED = "SEATED",
  WAITING_AT_BAR = "WAITING_AT_BAR",
  LEFT = "LEFT",
}

export type GuestGroup = {
  id: string;
  groupSize: number;
  currentStatus: GroupStatus;
  arrivalTime: Date;
  assignedTableId: string | null;
};

export type BarQueueEntry = {
  id: string;
  groupId: string;
  joinedAt: Date;
};

export type GuestProfile = {
  id: string;
  name: string;
  phoneNumber: string | null;
  isRegular: boolean;
};

export type GuestExpectation = {
  id: string;
  guestProfileId: string;
  preferenceNotes: string;
  lastUpdated: Date;
};
export type EnhancedReservationBlock = ReservationBlock & {
  guestProfileId: string | null;
};

export type EnhancedGuestGroup = GuestGroup & {
  guestProfileId: string | null;
};

export type FloorState = {
  tables: EnhancedTable[];
  bar: BarArea;
  activeGroups: EnhancedGuestGroup[];
  barQueue: BarQueueEntry[];
  activeBlocks: EnhancedReservationBlock[];
};
