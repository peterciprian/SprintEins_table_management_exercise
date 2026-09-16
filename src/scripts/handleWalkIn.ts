import type React from 'react';
import type { FloorState } from '../Types';
import { handleGuestArrival } from './handleGuestArrival';

/** Adds a walk-in group to the floor state. */
export function handleWalkIn(groupSize: number, selectedTableId: string, selectedGuestProfileId: string, guestProfileId: string, setState: React.Dispatch<React.SetStateAction<FloorState>>) {
  const guestProfile = selectedGuestProfileId || guestProfileId || null;
  console.log('Walk-in added', { groupSize, selectedTableId, guestProfile });
  setState((current) => handleGuestArrival(current, { id: `G-${Date.now()}`, groupSize, guestProfileId: guestProfile }));
}