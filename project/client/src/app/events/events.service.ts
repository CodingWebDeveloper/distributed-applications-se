import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ICreateEvent,
  IEditEvent,
  IEnrollUser,
  IEvent,
} from '../shared/models/event';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { EventParams } from '../shared/models/eventParams';
import { ICategory } from '../shared/models/category';
import { ILevel } from '../shared/models/level';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  baseUrl = environment.apiUrl;
  private eventParamsSource = new BehaviorSubject<EventParams | null>(
    new EventParams()
  );

  eventParams$ = this.eventParamsSource.asObservable();

  constructor(private http: HttpClient) {}

  createEvent(eventDto: ICreateEvent) {
    const {
      title,
      description,
      location,
      duration,
      presenterName,
      presenterRole,
      categoryId,
      levelId,
      date,
      image,
      presenterImage,
    } = eventDto;
    const formData = new FormData();

    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('duration', duration.toString());
    formData.append('presenterName', presenterName);
    formData.append('presenterRole', presenterRole);
    formData.append('categoryId', categoryId.toString());
    formData.append('levelId', levelId.toString());
    formData.append('date', date);
    formData.append('image', image);
    formData.append('presenterImage', presenterImage);

    return this.http.post<IEvent>(this.baseUrl + 'events', formData);
  }

  editEvent(eventDto: IEditEvent) {
    const {
      id,
      title,
      description,
      categoryId,
      levelId,
      date,
      image,
      duration,
      location,
      presenterName,
      presenterRole,
      presenterImage,
    } = eventDto;
    const formData = new FormData();

    formData.append('id', id.toString());
    formData.append('title', title);
    formData.append('description', description);
    formData.append('categoryId', categoryId.toString());
    formData.append('levelId', levelId.toString());
    formData.append('date', date);
    formData.append('image', image);
    formData.append('duration', duration.toString());
    formData.append('location', location);
    formData.append('presenterName', presenterName);
    formData.append('presenterRole', presenterRole);
    formData.append('presenterImage', presenterImage);

    return this.http.put<IEditEvent>(this.baseUrl + 'events', formData);
  }

  deleteEvent(id: number) {
    return this.http.delete(`${this.baseUrl}events/${id}`);
  }

  setEventParams(params: EventParams) {
    this.eventParamsSource.next(params);
  }

  getCategories() {
    return this.http.get<ICategory[]>(this.baseUrl + 'categories');
  }

  getLevels() {
    return this.http.get<ILevel[]>(this.baseUrl + 'levels');
  }

  enrollUser(dto: IEnrollUser) {
    return this.http.post<number>(this.baseUrl + 'events/enroll', dto);
  }

  rejectUser(dto: IEnrollUser) {
    const { userId, eventId } = dto;

    return this.http.delete(
      this.baseUrl + `events/reject/${userId}/${eventId}`
    );
  }

  getAllEvents() {
    return this.http.get<IEditEvent[]>(`${this.baseUrl}events/all`);
  }

  getMyEventById(id: number) {
    return this.http.get<IEditEvent>(`${this.baseUrl}events/my-event/${id}`);
  }

  getEventToEditById(id: number) {
    return this.http.get<IEditEvent>(`${this.baseUrl}events/${id}`);
  }

  getMyEvents() {
    return this.http.get<IEvent[]>(this.baseUrl + 'events/my-events');
  }

  getMyFavorites() {
    return this.http.get<IEvent[]>(this.baseUrl + 'events/my-favorites');
  }

  getEventDetails(id: number) {
    return this.http.get<IEvent>(this.baseUrl + `events/${id}/details`);
  }

  getNewestEvents() {
    return this.http.get<IEvent[]>(this.baseUrl + 'events/newest');
  }
}
