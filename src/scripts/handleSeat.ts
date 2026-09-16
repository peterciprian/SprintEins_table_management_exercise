import type React from 'react';
import type { FloorState } from '../Types';
import { seatGuestGroup } from './seatGuestGroup';

/** Seats a waiting guest group at the selected table. */
export function handleSeat(groupId: string, selectedTableId: string, setState: React.Dispatch<React.SetStateAction<FloorState>>) {
    if (!selectedTableId) { 
        console.error('No table selected for seating guest group', { groupId });
        return; 
    }
  setState((current) => seatGuestGroup(current, groupId, selectedTableId));
  console.log('Seat guest group', { groupId, selectedTableId });
}