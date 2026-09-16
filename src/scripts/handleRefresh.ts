import type React from 'react';
import { TableState, type FloorState } from '../Types';

/** Refreshes free and blocked table states for the current time. */
export function handleRefresh(setState: React.Dispatch<React.SetStateAction<FloorState>>) {
  const now = new Date();
  console.log('Refreshing table states', now.toISOString());
  setState((current) => refreshTableStatesByTime(current, now));
}

/**
 * Automatically adjusts the 'Free' or 'Blocked' status of all vacant tables.
 * This runs periodically to reflect the real floor state relative to active reservation time windows.
 */
function refreshTableStatesByTime(currentState: FloorState, currentTime: Date): FloorState {
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
