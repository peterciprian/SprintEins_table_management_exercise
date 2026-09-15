import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  FloorState,
  GroupStatus,
  TableState,
  type EnhancedTable,
  type GuestExpectation,
  type GuestProfile,
} from './Types';
import { handleGuestArrival } from './scripts/handleGuestArrival';
import { createReservationBlock } from './scripts/createReservation';
import { seatGuestGroup } from './scripts/seatGuestGroup';
import { refreshTableStatesByTime } from './scripts/refreshTableStatesByTime';

const initialTables: EnhancedTable[] = [
  { id: 'T1', tableNumber: '1', minCapacity: 1, maxCapacity: 3, currentState: TableState.FREE },
  { id: 'T2', tableNumber: '2', minCapacity: 1, maxCapacity: 3, currentState: TableState.FREE },
  { id: 'T3', tableNumber: '3', minCapacity: 1, maxCapacity: 3, currentState: TableState.FREE },
  { id: 'T4', tableNumber: '4', minCapacity: 1, maxCapacity: 3, currentState: TableState.FREE },
  { id: 'T5', tableNumber: '5', minCapacity: 2, maxCapacity: 5, currentState: TableState.FREE },
  { id: 'T6', tableNumber: '6', minCapacity: 2, maxCapacity: 5, currentState: TableState.FREE },
  { id: 'T7', tableNumber: '7', minCapacity: 2, maxCapacity: 5, currentState: TableState.FREE },
  { id: 'T8', tableNumber: '8', minCapacity: 2, maxCapacity: 5, currentState: TableState.FREE },
  { id: 'T9', tableNumber: '9', minCapacity: 4, maxCapacity: 8, currentState: TableState.FREE },
  { id: 'T10', tableNumber: '10', minCapacity: 4, maxCapacity: 8, currentState: TableState.FREE },
  { id: 'T11', tableNumber: '11', minCapacity: 4, maxCapacity: 8, currentState: TableState.FREE },
  { id: 'T12', tableNumber: '12', minCapacity: 4, maxCapacity: 8, currentState: TableState.FREE },
];

const initialState: FloorState = {
  tables: initialTables,
  bar: { maxCapacity: 10, currentWaitingCount: 0 },
  activeGroups: [],
  barQueue: [],
  activeBlocks: [],
};

function App() {
  const [state, setState] = React.useState<FloorState>(initialState);
  const [groupSize, setGroupSize] = React.useState(3);
  const [partySize, setPartySize] = React.useState(4);
  const [selectedTableId, setSelectedTableId] = React.useState('');
  const [selectedGuestProfileId, setSelectedGuestProfileId] = React.useState<string>('');
  const [reservationStart, setReservationStart] = React.useState<string>(new Date().toISOString().slice(0, 16));
  const [reservationEnd, setReservationEnd] = React.useState<string>(
    new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [guestProfileId, setGuestProfileId] = React.useState('');
  const [guestName, setGuestName] = React.useState('');
  const [guestPhone, setGuestPhone] = React.useState('');
  const [guestIsRegular, setGuestIsRegular] = React.useState(false);
  const [guestExpectationText, setGuestExpectationText] = React.useState('');
  const [guestProfiles, setGuestProfiles] = React.useState<GuestProfile[]>([]);
  const [guestExpectations, setGuestExpectations] = React.useState<GuestExpectation[]>([]);

  const handleAddGuestProfile = () => {
    const trimmedId = guestProfileId.trim();
    const trimmedName = guestName.trim();

    if (!trimmedId || !trimmedName) {
      return;
    }

    const profile: GuestProfile = {
      id: trimmedId,
      name: trimmedName,
      phoneNumber: guestPhone || null,
      isRegular: guestIsRegular,
    };

    setGuestProfiles((current) => {
      const existing = current.find((item) => item.id === trimmedId);
      return existing ? current.map((item) => (item.id === trimmedId ? profile : item)) : [...current, profile];
    });

    if (guestIsRegular) {
      const expectation: GuestExpectation = {
        id: `EXP-${trimmedId}`,
        guestProfileId: trimmedId,
        preferenceNotes: guestExpectationText.trim() || 'No preference noted',
        lastUpdated: new Date(),
      };

      setGuestExpectations((current) => {
        const existing = current.find((item) => item.guestProfileId === trimmedId);
        return existing
          ? current.map((item) => (item.guestProfileId === trimmedId ? expectation : item))
          : [...current, expectation];
      });
    }

    setSelectedGuestProfileId(trimmedId);
    setGuestProfileId(trimmedId);
    console.log('Guest profile saved', profile);
  };

  const handleWalkIn = () => {
    const guestProfile = selectedGuestProfileId || guestProfileId || null;
    console.log('Walk-in added', { groupSize, selectedTableId, guestProfile });
    setState((current) =>
      handleGuestArrival(current, {
        id: `G-${Date.now()}`,
        groupSize,
        guestProfileId: guestProfile,
      })
    );
  };

  const availableTables = state.tables.filter(
    (table) => table.currentState === TableState.FREE && table.maxCapacity >= partySize
  );

  const handleReservation = () => {
    const guestProfile = selectedGuestProfileId || guestProfileId || null;
    const blockStartTime = new Date(reservationStart);
    const blockEndTime = new Date(reservationEnd);

    if (Number.isNaN(blockStartTime.getTime()) || Number.isNaN(blockEndTime.getTime()) || blockEndTime <= blockStartTime) {
      console.log('Invalid reservation block time range', { reservationStart, reservationEnd });
      return;
    }

    const chosenTable = state.tables.find((table) => table.id === selectedTableId);
    if (!chosenTable || chosenTable.maxCapacity < partySize) {
      console.log('No suitable table for party size', { partySize, selectedTableId });
      return;
    }

    setState((current) =>
      createReservationBlock(
        current,
        {
          id: `RB-${Date.now()}`,
          contactName: guestName || 'Demo Guest',
          partySize,
          guestProfileId: guestProfile,
          blockStartTime,
          blockEndTime,
        },
        selectedTableId
      )
    );
    console.log('Reservation block created', {
      selectedTableId,
      partySize,
      guestProfile,
      blockStartTime,
      blockEndTime,
    });
  };

  const handleSeat = (groupId: string) => {
    console.log('Seat guest group', { groupId, selectedTableId });
    setState((current) => seatGuestGroup(current, groupId, selectedTableId));
  };

  const handleRefresh = () => {
    const now = new Date();
    console.log('Refreshing table states', now.toISOString());
    setState((current) => refreshTableStatesByTime(current, now));
  };

  const regularGuestRows = guestProfiles
    .filter((profile) => profile.isRegular)
    .map((profile) => {
      const expectation = guestExpectations.find((item) => item.guestProfileId === profile.id);
      const currentGroup = state.activeGroups.find((group) => group.guestProfileId === profile.id);
      const locationText = currentGroup?.assignedTableId
        ? `currently at table ${state.tables.find((table) => table.id === currentGroup.assignedTableId)?.tableNumber ?? currentGroup.assignedTableId}`
        : currentGroup?.currentStatus === GroupStatus.WAITING_AT_BAR
          ? 'currently waiting at the bar'
          : 'currently not seated';

      return {
        profile,
        expectation,
        locationText,
      };
    });

  const reservationBlockRows = state.activeBlocks.map((block) => {
    const profile = guestProfiles.find((item) => item.id === block.guestProfileId);
    const tableNumber = state.tables.find((table) => table.id === block.tableId)?.tableNumber ?? block.tableId;

    return {
      block,
      profile,
      tableNumber,
    };
  });

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 960, margin: '32px auto', padding: 20 }}>
      <h1>Table Reservation Manager</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
          <h3>Walk-in guest</h3>
          <label>
            Group size
            <input
              type="number"
              min={1}
              value={groupSize}
              onChange={(e) => setGroupSize(Number(e.target.value))}
              style={{ display: 'block', width: '100%', marginTop: 6, marginBottom: 12 }}
            />
          </label>
          <label>
            Guest profile
            <select
              value={selectedGuestProfileId}
              onChange={(e) => setSelectedGuestProfileId(e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 6, marginBottom: 12 }}
            >
              <option value="">No profile</option>
              {guestProfiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
          </label>
          <button onClick={handleWalkIn}>Add to bar queue</button>
        </div>

        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
          <h3>Reservation block</h3>
          <label>
            Party size
            <input
              type="number"
              min={1}
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
              style={{ display: 'block', width: '100%', marginTop: 6, marginBottom: 12 }}
            />
          </label>
          <label>
            Guest profile
            <select
              value={selectedGuestProfileId}
              onChange={(e) => setSelectedGuestProfileId(e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 6, marginBottom: 12 }}
            >
              <option value="">No guest profile</option>
              {guestProfiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Start
            <input
              type="datetime-local"
              value={reservationStart}
              onChange={(e) => setReservationStart(e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 6, marginBottom: 12 }}
            />
          </label>
          <label>
            End
            <input
              type="datetime-local"
              value={reservationEnd}
              onChange={(e) => setReservationEnd(e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 6, marginBottom: 12 }}
            />
          </label>
          <label>
            Table
            <select
              value={selectedTableId}
              onChange={(e) => setSelectedTableId(e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 6, marginBottom: 12 }}
            >
              <option value="">Select a table</option>
              {availableTables.map((table) => (
                <option key={table.id} value={table.id}>
                  Table {table.tableNumber} ({table.maxCapacity} max)
                </option>
              ))}
            </select>
          </label>
          <button onClick={handleReservation}>Create reservation block</button>
        </div>

        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
          <h3>Guest profile</h3>
          <label>
            Guest ID
            <input
              value={guestProfileId}
              onChange={(e) => setGuestProfileId(e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 6, marginBottom: 12 }}
            />
          </label>
          <label>
            Name
            <input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 6, marginBottom: 12 }}
            />
          </label>
          <label>
            Phone
            <input
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 6, marginBottom: 12 }}
            />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={guestIsRegular} onChange={(e) => setGuestIsRegular(e.target.checked)} />
            Regular guest
          </label>
          <label style={{ display: 'block', marginTop: 12 }}>
            Expectation{guestIsRegular ? '' : ' (only regular guests can have one)'}
            <input
              value={guestExpectationText}
              onChange={(e) => setGuestExpectationText(e.target.value)}
              disabled={!guestIsRegular}
              style={{ display: 'block', width: '100%', marginTop: 6, marginBottom: 12 }}
            />
          </label>
          <button onClick={handleAddGuestProfile}>Add guest profile</button>
        </div>

        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
          <h3>Floor controls</h3>
          <button onClick={handleRefresh} style={{ marginBottom: 8 }}>Refresh table states</button>
          <div>Bar capacity: {state.bar.currentWaitingCount}/{state.bar.maxCapacity}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        {state.tables.map((table) => {
          const isSelected = table.id === selectedTableId;

          return (
            <div
              key={table.id}
              style={{
                border: isSelected ? '4px solid #888' : '1px solid #ccc',
                borderRadius: 8,
                padding: 12,
                background: isSelected ? '#f3f3f3' : '#fff',
                opacity: table.currentState === TableState.FREE ? 1 : 0.65,
              }}
            >
              <strong>Table {table.tableNumber}</strong>
              <div style={{ marginTop: 8 }}>Status: {table.currentState}</div>
              <div>Capacity: {table.minCapacity}-{table.maxCapacity}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
          <h3>Active groups</h3>
          {state.activeGroups.length === 0 ? (
            <p>No groups yet.</p>
          ) : (
            <ul>
              {state.activeGroups.map((group) => (
                <li key={group.id} style={{ marginBottom: 8 }}>
                  {group.id} · {group.groupSize} guests · {group.currentStatus}
                  {group.currentStatus === GroupStatus.WAITING_AT_BAR && (
                    <button onClick={() => handleSeat(group.id)} style={{ marginLeft: 8 }}>
                      Seat at selected table
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
          <h3>Bar queue</h3>
          {state.barQueue.length === 0 ? (
            <p>Queue empty.</p>
          ) : (
            <ul>
              {state.barQueue.map((entry) => (
                <li key={entry.id}>{entry.groupId}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div style={{ marginTop: 28, border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
        <h3>Reservation blocks</h3>
        {reservationBlockRows.length === 0 ? (
          <p>No reservation blocks yet.</p>
        ) : (
          <ul>
            {reservationBlockRows.map(({ block, profile, tableNumber }) => (
              <li key={block.id} style={{ marginBottom: 8 }}>
                {profile ? `guest ${profile.id} (${profile.name})` : 'guest profile unknown'} on table {tableNumber}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: 28, border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
        <h3>Regular guest expectations</h3>
        {regularGuestRows.length === 0 ? (
          <p>No regular guest expectations saved.</p>
        ) : (
          <ul>
            {regularGuestRows.map(({ profile, expectation, locationText }) => (
              <li key={profile.id} style={{ marginBottom: 8 }}>
                {expectation
                  ? `guest ${profile.id} named ${profile.name} wants to ${expectation.preferenceNotes.toLowerCase()}, currently ${locationText}`
                  : `guest ${profile.id} named ${profile.name} has no expectation saved, currently ${locationText}`}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
