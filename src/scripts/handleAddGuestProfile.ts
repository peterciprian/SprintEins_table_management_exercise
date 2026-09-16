import type React from 'react';
import type { GuestExpectation, GuestProfile } from '../Types';

type AddGuestProfileOptions = {
  guestProfileId: string;
  guestName: string;
  guestPhone: string;
  guestIsRegular: boolean;
  guestExpectationText: string;
  setGuestProfiles: React.Dispatch<React.SetStateAction<GuestProfile[]>>;
  setGuestExpectations: React.Dispatch<React.SetStateAction<GuestExpectation[]>>;
  setSelectedGuestProfileId: React.Dispatch<React.SetStateAction<string>>;
  setGuestProfileId: React.Dispatch<React.SetStateAction<string>>;
};

/** Saves or updates a guest profile and its regular-guest expectation. */
export function handleAddGuestProfile(options: AddGuestProfileOptions) {
  const trimmedId = options.guestProfileId.trim();
  const trimmedName = options.guestName.trim();

  if (!trimmedId || !trimmedName) return;

  const profile: GuestProfile = { id: trimmedId, name: trimmedName, phoneNumber: options.guestPhone || null, isRegular: options.guestIsRegular };
  options.setGuestProfiles((current) => {
    const existing = current.find((item) => item.id === trimmedId);
    return existing ? current.map((item) => (item.id === trimmedId ? profile : item)) : [...current, profile];
  });

  if (options.guestIsRegular) {
    const expectation: GuestExpectation = { id: `EXP-${trimmedId}`, guestProfileId: trimmedId, preferenceNotes: options.guestExpectationText.trim() || 'No preference noted', lastUpdated: new Date() };
    options.setGuestExpectations((current) => current.some((item) => item.guestProfileId === trimmedId) ? current.map((item) => (item.guestProfileId === trimmedId ? expectation : item)) : [...current, expectation]);
  }

  options.setSelectedGuestProfileId(trimmedId);
  options.setGuestProfileId(trimmedId);
  console.log('Guest profile saved', profile);
}