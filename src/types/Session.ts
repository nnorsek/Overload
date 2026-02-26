import type { ClientInfo } from "./Client";

export type SessionType =
  | "Personal Training"
  | "Nutrition Consultation"
  | "Group Class"
  | "Strength & Conditioning"
  | "HIIT"
  | "Yoga"
  | "Pilates"
  | "Stretching"
  | "Meditation"
  | "Massage Therapy"
  | "Meal Planning"
  | "Fitness Assessment"
  | "Goal Review"
  | "Bootcamp"
  | "Virtual Session";

export type SessionStatus = "Confirmed" | "Cancelled" | "Pending" | "Completed";

export type Session = {
  id: number;
  client: ClientInfo;
  duration: number;
  type: SessionType;
  sessionDate: string;
  status: SessionStatus;
};
