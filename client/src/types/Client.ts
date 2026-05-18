export type ClientInfo = {
  id: number;
  name: string;
  currentWeight: number;
  age: number;
  startedDate: string;
  startingWeight: number;
  goal: string;
  wantsToLoseWeight: boolean | undefined;
};

export type Client = {
  clientId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  startingWeight: number;
  currentWeight: number;
  height: number;
  goal: string;
  photoUrl: string;
  startedAt: string;
};
