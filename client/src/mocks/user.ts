import type { AuthUser } from "@/context/AuthContext";

export const mockUser: AuthUser = {
  token: "mock-token",
  role: "ROLE_TRAINER",
  email: "trainer@overload.dev",
  id: "1",
};
