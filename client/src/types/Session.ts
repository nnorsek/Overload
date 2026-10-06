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

export type ClientSummary = {
  clientId: number;
  firstName: string;
  lastName: string;
};

export type Session = {
  id: number;
  clients: ClientSummary[];
  duration: number;
  sessionDate: string;
  status: SessionStatus;
};

// Shape returned by GET /trainer/sessions
export type ServerSession = {
  sessionId: number;
  clients: ClientSummary[];
  scheduledStart: string;
  scheduledEnd: string;
  status: "CONFIRMED" | "CANCELLED" | "PENDING" | "COMPLETED";
  notes: string | null;
};
