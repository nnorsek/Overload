import type { ClientInfo } from "./types/Client";
import type { Session } from "./types/Session";

// Example client objects
export const exampleClients: ClientInfo[] = [
  {
    id: 1,
    name: "Alice Johnson",
    current_weight: 145,
    starting_weight: 160,
    age: 28,
    startedDate: "2026-01-15T00:00:00Z",
    goal: "Lose weight",
    wantsToLoseWeight: true,
  },
  {
    id: 2,
    name: "Bob Smith",
    current_weight: 180,
    starting_weight: 175,
    age: 35,
    startedDate: "2025-11-10T00:00:00Z",
    goal: "Gain muscle",
    wantsToLoseWeight: false,
  },
  {
    id: 3,
    name: "Carmen Lee",
    current_weight: 130,
    starting_weight: 140,
    age: 24,
    startedDate: "2026-02-01T00:00:00Z",
    goal: "Maintain weight",
    wantsToLoseWeight: undefined,
  },
];

// Example session objects
export const exampleSession: Session[] = [
  {
    id: 1,
    client: exampleClients[0],
    duration: 60,
    type: "Personal Training",
    sessionDate: "2026-02-25T10:45:00Z",
    status: "Confirmed",
  },
  {
    id: 2,
    client: exampleClients[1],
    duration: 45,
    type: "HIIT",
    sessionDate: "2026-02-25T10:45:00Z",
    status: "Pending",
  },
];
