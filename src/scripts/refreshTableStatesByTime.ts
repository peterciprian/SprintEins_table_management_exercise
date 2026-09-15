import { FloorState, TableState } from "../Types";
/**
 * Automatically adjusts the 'Free' or 'Blocked' status of all vacant tables.
 * This runs periodically to reflect the real floor state relative to active reservation time windows.
 */
export function refreshTableStatesByTime(currentState: FloorState, currentTime: Date): FloorState {
  const updatedTables = currentState.tables.map(table => {
    // If guests are actively eating there, do not alter its status
    if (table.currentState === TableState.OCCUPIED) {
      return table;
    }

    // Determine if the current time slips inside an existing reservation lock window
    const isCurrentlyBlocked = currentState.activeBlocks.some(
      block =>
        block.tableId === table.id &&
        currentTime >= block.blockStartTime &&
        currentTime <= block.blockEndTime
    );

    // Turn the table to 'Blocked' so walk-ins cannot accidentally sit down
    return {
      ...table,
      currentState: isCurrentlyBlocked ? TableState.BLOCKED : TableState.FREE,
    };
  });

  return {
    ...currentState,
    tables: updatedTables,
  };
}
