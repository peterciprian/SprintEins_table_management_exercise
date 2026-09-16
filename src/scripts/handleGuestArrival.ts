import { GuestGroup, FloorState, BarQueueEntry, GroupStatus } from "../Types";

/**
 * Handles the arrival of walk-in guest groups.
 * Enforces Maria's rule: If the group cannot completely fit into the bar area, 
 * they do not split up; they leave together immediately.
 */
export function handleGuestArrival(
  currentState: FloorState,
  newGroupData: { id: string; groupSize: number; guestProfileId: string | null }
): FloorState {
  const barMaxCapacity = currentState.bar.maxCapacity;
  const barCurrentCount = currentState.bar.currentWaitingCount;
  
  // Check if the entire group can physically fit into the bar area
  const fitsInBar = barCurrentCount + newGroupData.groupSize <= barMaxCapacity;

  const newGroup: GuestGroup = {
    id: newGroupData.id,
    groupSize: newGroupData.groupSize,
    guestProfileId: newGroupData.guestProfileId,
    arrivalTime: new Date(),
    // Set status to 'Left' if bar capacity is exceeded, otherwise put them in the queue
    currentStatus: fitsInBar ? GroupStatus.WAITING_AT_BAR : GroupStatus.LEFT,
    assignedTableId: null,
  };

  const updatedActiveGroups = [...currentState.activeGroups, newGroup];

  // If they don't fit, return early with the updated group marked as 'Left'
  if (!fitsInBar) {
    return {
      ...currentState,
      activeGroups: updatedActiveGroups,
    };
  }

  // Create a new queue slot entry for the bar area
  const newBarQueueEntry: BarQueueEntry = {
    id: `BQ-${newGroupData.id}`,
    groupId: newGroupData.id,
    joinedAt: new Date(),
  };

  return {
    ...currentState,
    bar: {
      ...currentState.bar,
      currentWaitingCount: barCurrentCount + newGroupData.groupSize,
    },
    activeGroups: updatedActiveGroups,
    barQueue: [...currentState.barQueue, newBarQueueEntry],
  };
}
