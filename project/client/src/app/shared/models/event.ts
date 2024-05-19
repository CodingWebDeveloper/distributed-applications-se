import { ILink } from './link';

export interface IEvent {
  id: number;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  participants: number;
  date: string;
  formattedStartDate: string;
  formattedEndDate: string;
  duration: number;
  location: string;
  presenterImage: string;
  presenterName: string;
  presenterRole: string;
  links: ILink[];
}

export interface IBaseInputEvent {
  title: string;
  description: string;
  date: string;
  categoryId: number;
  levelId: number;
  image: any;
  presenterImage: any;
  duration: number;
  location: string;
  presenterName: string;
  presenterRole: string;
}

export interface ICreateEvent extends IBaseInputEvent {}

export interface IEditEvent extends IBaseInputEvent {
  id: number;
  imageUrl: string;
  presenterImageUrl: string;
}

export interface IEnrollUser {
  userId: string;
  eventId: number;
}

export interface ICreateFavorite {
  userId: string;
  eventId: number;
}

export interface ICreateRecent {
  userId: string;
  eventId: number;
}

export interface IEventShortDetails {
  id: number;
  title: string;
  date: string;
  formattedStartDate: string;
  formattedEndDate: string;
  location: string;
}
