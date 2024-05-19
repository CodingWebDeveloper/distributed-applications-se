export interface ILink {
  id: number;
  name: string;
  path: string;
  eventId: number;
}

export interface ICreateLink {
  name: string;
  path: string;
  eventId: number;
}
