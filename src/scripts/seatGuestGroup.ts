import { FloorState, TableState, GroupStatus } from "../Types";

/**
 * Transitions a group from the waiting state (or instant walk-in) to a physical table.
 * Updates the table status to 'Occupied' and handles bar capacity deduction if necessary.
 */
export function seatGuestGroup(
  currentState: FloorState,
  groupId: string,
  tableId: string
): FloorState {
  const group = currentState.activeGroups.find(g => g.id === groupId);
  const table = currentState.tables.find(t => t.id === tableId);

  // Guard clause: enforce that the target table must be completely free
  if (!group || !table || table.currentState !== TableState.FREE) {
    return currentState;
  }

  const wasWaitingAtBar = group.currentStatus === GroupStatus.WAITING_AT_BAR;

  // Mark the target table as Occupied
  const updatedTables = currentState.tables.map(t =>
    t.id === tableId ? { ...t, currentState: TableState.OCCUPIED } : t
  );

  // Transition group status to Seated and link the table ID
  const updatedGroups = currentState.activeGroups.map(g =>
    g.id === groupId
      ? { ...g, currentStatus: GroupStatus.SEATED, assignedTableId: tableId }
      : g
  );

  // Remove the group from the bar queue list if they were waiting there
  const updatedBarQueue = wasWaitingAtBar
    ? currentState.barQueue.filter(entry => entry.groupId !== groupId)
    : currentState.barQueue;

  // Deduct headcount from the bar counter if they transitioned out of the bar
  const updatedBarCount = wasWaitingAtBar
    ? currentState.bar.currentWaitingCount - group.groupSize
    : currentState.bar.currentWaitingCount;

  return {
    ...currentState,
    tables: updatedTables,
    bar: { ...currentState.bar, currentWaitingCount: updatedBarCount },
    activeGroups: updatedGroups,
    barQueue: updatedBarQueue,
  };
}
