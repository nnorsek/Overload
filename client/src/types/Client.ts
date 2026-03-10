export type ClientInfo = {
  id: number;
  name: string;
  current_weight: number;
  age: number;
  startedDate: string;
  starting_weight: number;
  goal: string;
  wantsToLoseWeight: boolean | undefined;
};

export type Client = {
  client_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  starting_weight: number;
  current_weight: number;
  height: number;
  goal: string;
  photo_url: string;
  started_at: string;
};
