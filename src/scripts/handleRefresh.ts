import type React from 'react';
import type { FloorState } from '../Types';
import { refreshTableStatesByTime } from './refreshTableStatesByTime';

/** Refreshes free and blocked table states for the current time. */
export function handleRefresh(setState: React.Dispatch<React.SetStateAction<FloorState>>) {
  const now = new Date();
  console.log('Refreshing table states', now.toISOString());
  setState((current) => refreshTableStatesByTime(current, now));
}