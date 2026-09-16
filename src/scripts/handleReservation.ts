import type React from 'react';
import type { FloorState } from '../Types';
import { createReservationBlock } from './createReservation';

type ReservationOptions = { state: FloorState; selectedGuestProfileId: string; guestProfileId: string; reservationStart: string; reservationEnd: string; selectedTableId: string; partySize: number; guestName: string; setState: React.Dispatch<React.SetStateAction<FloorState>> };

/** Creates a reservation block for the selected table and time range. */
export function handleReservation(options: ReservationOptions) {
  const guestProfile = options.selectedGuestProfileId || options.guestProfileId || null;
  const blockStartTime = new Date(options.reservationStart);
  const blockEndTime = new Date(options.reservationEnd);
  if (Number.isNaN(blockStartTime.getTime()) || Number.isNaN(blockEndTime.getTime()) || blockEndTime <= blockStartTime) { console.log('Invalid reservation block time range', options); return; }
  const chosenTable = options.state.tables.find((table) => table.id === options.selectedTableId);
  if (!chosenTable || chosenTable.maxCapacity < options.partySize) { console.log('No suitable table for party size', options); return; }
  options.setState((current) => createReservationBlock(current, { id: `RB-${Date.now()}`, contactName: options.guestName || 'Demo Guest', partySize: options.partySize, guestProfileId: guestProfile, blockStartTime, blockEndTime }, options.selectedTableId));
  console.log('Reservation block created', { selectedTableId: options.selectedTableId, partySize: options.partySize, guestProfile, blockStartTime, blockEndTime });
}