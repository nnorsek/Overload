// Set to false when the database is back.
const MOCKS_ENABLED = false;

// Hook tests exercise the real fetch path, so mocks are always off under Vitest.
export const USE_MOCKS = MOCKS_ENABLED && import.meta.env.MODE !== "test";

export { mockUser } from "./user";
export { mockClients } from "./clients";
export { mockSessions } from "./sessions";
export { mockExercises } from "./exercises";
export { mockWorkouts } from "./workouts";
