import type { SessionStatus } from "../types/Session";

export const sessionColor = (status: SessionStatus) => {
  switch (status) {
    case "Confirmed":
      return { base: "bg-green-500", hover: "hover:bg-green-500/80" };
    case "Pending":
      return { base: "bg-yellow-500", hover: "hover:bg-yellow-500/80" };
    case "Cancelled":
      return { base: "bg-red-500", hover: "hover:bg-red-500/80" };
    case "Completed":
      return { base: "bg-blue-500", hover: "hover:bg-blue-500/80" };
    default:
      return { base: "bg-gray-500", hover: "hover:bg-gray-500/80" };
  }
};
