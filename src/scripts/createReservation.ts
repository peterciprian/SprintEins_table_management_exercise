import { FloorState, ReservationBlock } from "../Types";

/**
 * Creates a reservation block window for a table.
 * This is the actual time-based lock used by the floor state.
 */
export function createReservationBlock(
  currentState: FloorState,
  reservationData: {
    id: string;
    contactName: string;
    partySize: number;
    guestProfileId: string | null;
    blockStartTime: Date;
    blockEndTime: Date;
  },
  assignedTableId: string
): FloorState {
  const assignedTable = currentState.tables.find((table) => table.id === assignedTableId);

  if (!assignedTable || assignedTable.maxCapacity < reservationData.partySize) {
    return currentState;
  }

  const blockStartTime = new Date(reservationData.blockStartTime);
  const blockEndTime = new Date(reservationData.blockEndTime);

  const newBlock: ReservationBlock = {
    id: `BLOCK-${reservationData.id}`,
    tableId: assignedTableId,
    guestProfileId: reservationData.guestProfileId,
    blockStartTime,
    blockEndTime,
  };

  return {
    ...currentState,
    activeBlocks: [...currentState.activeBlocks, newBlock],
  };
}
