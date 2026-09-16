import React from "react";
import { Card } from "./Card";
import {
  GroupStatus,
  TableState,
  type GuestExpectation,
  type GuestProfile,
} from "./Types";
import { handleAddGuestProfile } from "./scripts/handleAddGuestProfile";
import { handleRefresh } from "./scripts/handleRefresh";
import { handleReservation } from "./scripts/handleReservation";
import { handleSeat } from "./scripts/handleSeat";
import { handleWalkIn } from "./scripts/handleWalkIn";
import { initialFloorState } from "./scripts/initialFloorState";

/** Renders and coordinates the restaurant reservation manager interface. */
export function App() {
  const [state, setState] = React.useState(initialFloorState);
  const [groupSize, setGroupSize] = React.useState(3);
  const [partySize, setPartySize] = React.useState(4);
  const [selectedTableId, setSelectedTableId] = React.useState("");
  const [selectedGuestProfileId, setSelectedGuestProfileId] =
    React.useState("");
  const [reservationStart, setReservationStart] = React.useState(
    new Date().toISOString().slice(0, 16),
  );
  const [reservationEnd, setReservationEnd] = React.useState(
    new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
  );
  const [guestProfileId, setGuestProfileId] = React.useState("");
  const [guestName, setGuestName] = React.useState("");
  const [guestPhone, setGuestPhone] = React.useState("");
  const [guestIsRegular, setGuestIsRegular] = React.useState(false);
  const [guestExpectationText, setGuestExpectationText] = React.useState("");
  const [guestProfiles, setGuestProfiles] = React.useState<GuestProfile[]>([]);
  const [guestExpectations, setGuestExpectations] = React.useState<
    GuestExpectation[]
  >([]);
  const availableTables = state.tables.filter(
    (table) =>
      table.currentState === TableState.FREE && table.maxCapacity >= partySize,
  );
  const regularGuestRows = guestProfiles
    .filter((profile) => profile.isRegular)
    .map((profile) => {
      const expectation = guestExpectations.find(
        (item) => item.guestProfileId === profile.id,
      );
      const currentGroup = state.activeGroups.find(
        (group) => group.guestProfileId === profile.id,
      );
      const locationText = currentGroup?.assignedTableId
        ? `currently at table ${state.tables.find((table) => table.id === currentGroup.assignedTableId)?.tableNumber ?? currentGroup.assignedTableId}`
        : currentGroup?.currentStatus === GroupStatus.WAITING_AT_BAR
          ? "currently waiting at the bar"
          : "currently not seated";
      return { profile, expectation, locationText };
    });

  const reservationBlockRows = state.activeBlocks.map((block) => ({
    block,
    profile: guestProfiles.find((item) => item.id === block.guestProfileId),
    tableNumber:
      state.tables.find((table) => table.id === block.tableId)?.tableNumber ??
      block.tableId,
  }));

  return (
    <main
      style={{
        fontFamily: "sans-serif",
        maxWidth: 960,
        margin: "32px auto",
        padding: 20,
      }}
    >
      <h1>Table Reservation Manager</h1>
      <section id="check-in"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Card
          title="Walk-in guest"
          content={
            <>
              <label>
                Group size
                <input
                  type="number"
                  min={1}
                  value={groupSize}
                  onChange={(event) => setGroupSize(Number(event.target.value))}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 6,
                    marginBottom: 12,
                  }}
                />
              </label>
              <label>
                Guest profile
                <select
                  value={selectedGuestProfileId}
                  onChange={(event) =>
                    setSelectedGuestProfileId(event.target.value)
                  }
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 6,
                    marginBottom: 12,
                  }}
                >
                  <option value="">No profile</option>
                  {guestProfiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                onClick={() =>
                  handleWalkIn(
                    groupSize,
                    selectedTableId,
                    selectedGuestProfileId,
                    guestProfileId,
                    setState,
                  )
                }
              >
                Add to bar queue
              </button>
            </>
          }
        />
        <Card
          title="Reservation block"
          content={
            <>
              <label>
                Party size
                <input
                  type="number"
                  min={1}
                  value={partySize}
                  onChange={(event) => setPartySize(Number(event.target.value))}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 6,
                    marginBottom: 12,
                  }}
                />
              </label>
              <label>
                Guest profile
                <select
                  value={selectedGuestProfileId}
                  onChange={(event) =>
                    setSelectedGuestProfileId(event.target.value)
                  }
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 6,
                    marginBottom: 12,
                  }}
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
                  onChange={(event) => setReservationStart(event.target.value)}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 6,
                    marginBottom: 12,
                  }}
                />
              </label>
              <label>
                End
                <input
                  type="datetime-local"
                  value={reservationEnd}
                  onChange={(event) => setReservationEnd(event.target.value)}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 6,
                    marginBottom: 12,
                  }}
                />
              </label>
              <label>
                Table
                <select
                  value={selectedTableId}
                  onChange={(event) => setSelectedTableId(event.target.value)}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 6,
                    marginBottom: 12,
                  }}
                >
                  <option value="">Select a table</option>
                  {availableTables.map((table) => (
                    <option key={table.id} value={table.id}>
                      Table {table.tableNumber} ({table.maxCapacity} max)
                    </option>
                  ))}
                </select>
              </label>
              <button
                onClick={() =>
                  handleReservation({
                    state,
                    selectedGuestProfileId,
                    guestProfileId,
                    reservationStart,
                    reservationEnd,
                    selectedTableId,
                    partySize,
                    guestName,
                    setState,
                  })
                }
              >
                Create reservation block
              </button>
            </>
          }
        />
        <Card
          title="Guest profile"
          content={
            <>
              <label>
                Guest ID
                <input
                  value={guestProfileId}
                  onChange={(event) => setGuestProfileId(event.target.value)}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 6,
                    marginBottom: 12,
                  }}
                />
              </label>
              <label>
                Name
                <input
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 6,
                    marginBottom: 12,
                  }}
                />
              </label>
              <label>
                Phone
                <input
                  value={guestPhone}
                  onChange={(event) => setGuestPhone(event.target.value)}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 6,
                    marginBottom: 12,
                  }}
                />
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={guestIsRegular}
                  onChange={(event) => setGuestIsRegular(event.target.checked)}
                />
                Regular guest
              </label>
              <label style={{ display: "block", marginTop: 12 }}>
                Expectation
                {guestIsRegular ? "" : " (only regular guests can have one)"}
                <input
                  value={guestExpectationText}
                  onChange={(event) =>
                    setGuestExpectationText(event.target.value)
                  }
                  disabled={!guestIsRegular}
                  style={{
                    display: "block",
                    width: "100%",
                    marginTop: 6,
                    marginBottom: 12,
                  }}
                />
              </label>
              <button
                onClick={() =>
                  handleAddGuestProfile({
                    guestProfileId,
                    guestName,
                    guestPhone,
                    guestIsRegular,
                    guestExpectationText,
                    setGuestProfiles,
                    setGuestExpectations,
                    setSelectedGuestProfileId,
                    setGuestProfileId,
                  })
                }
              >
                Add guest profile
              </button>
            </>
          }
        />
        <Card
          title="Floor controls"
          content={
            <>
              <button
                onClick={() => handleRefresh(setState)}
                style={{ marginBottom: 8 }}
              >
                Refresh table states
              </button>
              <p>
                Bar capacity: {state.bar.currentWaitingCount}/
                {state.bar.maxCapacity}
              </p>
            </>
          }
        />
      </section>
      <section id="tables"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        {state.tables.map((table) => {
          const seatedGuests = state.activeGroups.find((g) => g.assignedTableId === table.id)?.groupSize ?? 0;
          const reservedFrom = state.activeBlocks.find((b) => b.tableId === table.id)?.blockStartTime;
          const reservedTo = state.activeBlocks.find((b) => b.tableId === table.id)?.blockEndTime;
          return (
          <button
            type="button"
            key={table.id}
            onClick={() => setSelectedTableId(table.id)}
            style={{
              border:
                table.id === selectedTableId
                  ? "4px solid #888"
                  : "1px solid #ccc",
              borderRadius: 8,
              padding: 12,
              background: table.id === selectedTableId ? "#f3f3f3" : "#fff",
              opacity: table.currentState === TableState.FREE ? 1 : 0.65,
              cursor: "pointer",
              font: "inherit",
              textAlign: "left",
              width: "100%",
            }}
          >
            <strong>Table {table.tableNumber}</strong>
            <p style={{ marginTop: 8 }}>Status: {table.currentState}</p>
            <p>Capacity: {table.minCapacity}-{table.maxCapacity}</p>
            {seatedGuests > 0 && <p>{seatedGuests} guests seated</p>}
            {reservedFrom && reservedTo && (
              <p>
                Reserved from {reservedFrom.toLocaleTimeString()} to {reservedTo.toLocaleTimeString()}
              </p>
            )}            </button>
        )})}
      </section>
      <section id="active-groups"
        style={{
          marginTop: 28,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        <Card
          title="Active groups"
          content={
            <>
              {state.activeGroups.length === 0 ? (
                <p>No groups yet.</p>
              ) : (
                <ul>
                  {state.activeGroups.map((group) => (
                    <li key={group.id} style={{ marginBottom: 8 }}>
                      {group.id} · {group.groupSize} guests ·{" "}
                      {group.currentStatus}
                    </li>
                  ))}
                </ul>
              )}
            </>
          }
        />
        <Card
          title="Bar queue"
          content={
            <>
              {state.barQueue.length === 0 ? (
                <p>Queue empty.</p>
              ) : (
                <ul>
                  {state.barQueue.map((entry) => (
                    <li key={entry.id}>
                      {entry.groupId} ·{" "}
                      {
                        state.activeGroups.find((g) => g.id === entry.groupId)
                          ?.groupSize
                      }{" "}
                      guests
                      <button
                        onClick={() =>
                          handleSeat(entry.groupId, selectedTableId, setState)
                        }
                        style={{ marginLeft: 8 }}
                      >
                        Seat at selected table
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          }
        />
      </section>
      <section style={{ marginTop: 28 }}>
        <Card
          title="Reservation blocks"
          content={
            reservationBlockRows.length === 0 ? (
              <p>No reservation blocks yet.</p>
            ) : (
              <ul>
                {reservationBlockRows.map(({ block, profile, tableNumber }) => (
                  <li key={block.id} style={{ marginBottom: 8 }}>
                    {profile
                      ? `guest ${profile.id} (${profile.name})`
                      : "guest profile unknown"}{" "}
                    on table {tableNumber}
                  </li>
                ))}
              </ul>
            )
          }
        />
      </section>
      <section style={{ marginTop: 28 }}>
        <Card
          title="Regular guest expectations"
          content={
            regularGuestRows.length === 0 ? (
              <p>No regular guest expectations saved.</p>
            ) : (
              <ul>
                {regularGuestRows.map(
                  ({ profile, expectation, locationText }) => (
                    <li key={profile.id} style={{ marginBottom: 8 }}>
                      {expectation
                        ? `guest ${profile.id} named ${profile.name} wants to ${expectation.preferenceNotes.toLowerCase()}, currently ${locationText}`
                        : `guest ${profile.id} named ${profile.name} has no expectation saved, currently ${locationText}`}
                    </li>
                  ),
                )}
              </ul>
            )
          }
        />
      </section>
    </main>
  );
}
