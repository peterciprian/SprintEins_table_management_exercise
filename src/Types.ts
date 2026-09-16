export type Table = {
  id: string;
  tableNumber: string;
  minCapacity: number;
  maxCapacity: number;
  currentState: TableState;
};

export enum TableState {
  FREE = "FREE",
  OCCUPIED = "OCCUPIED",
  BLOCKED = "BLOCKED",
}

export type BarArea = {
  maxCapacity: number;
  currentWaitingCount: number;
};

export type ReservationBlock = {
  id: string;
  tableId: string;
  blockStartTime: Date;
  blockEndTime: Date;
  guestProfileId: string | null;
};

export type GuestGroup = {
  id: string;
  groupSize: number;
  currentStatus: GroupStatus;
  arrivalTime: Date;
  assignedTableId: string | null;
  guestProfileId: string | null;
};

export enum GroupStatus {
  SEATED = "SEATED",
  WAITING_AT_BAR = "WAITING_AT_BAR",
  LEFT = "LEFT",
}

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

export type FloorState = {
  tables: Table[];
  bar: BarArea;
  activeGroups: GuestGroup[];
  barQueue: BarQueueEntry[];
  activeBlocks: ReservationBlock[];
};
