import type { Session } from "@/types/Session";

export const mockSessions: Session[] = [
  {
    id: 1,
    clients: [{ clientId: 1, firstName: "Alice", lastName: "Johnson" }],
    duration: 60,
    sessionDate: "2026-10-04T09:00:00Z",
    status: "Confirmed",
  },
  {
    id: 2,
    clients: [{ clientId: 2, firstName: "Bob", lastName: "Smith" }],
    duration: 45,
    sessionDate: "2026-10-04T11:30:00Z",
    status: "Pending",
  },
  {
    id: 3,
    clients: [
      { clientId: 1, firstName: "Alice", lastName: "Johnson" },
      { clientId: 3, firstName: "Carmen", lastName: "Lee" },
    ],
    duration: 60,
    sessionDate: "2026-10-04T17:00:00Z",
    status: "Confirmed",
  },
  {
    id: 4,
    clients: [{ clientId: 3, firstName: "Carmen", lastName: "Lee" }],
    duration: 30,
    sessionDate: "2026-10-02T15:00:00Z",
    status: "Completed",
  },
];
