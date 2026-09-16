import { FloorState, TableState, type Table } from '../Types';

const initialTables: Table[] = [
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

export const initialFloorState: FloorState = {
  tables: initialTables,
  bar: { maxCapacity: 10, currentWaitingCount: 0 },
  activeGroups: [],
  barQueue: [],
  activeBlocks: [],
};