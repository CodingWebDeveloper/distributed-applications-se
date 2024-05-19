import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IEvent } from '../shared/models/event';
import { EventParams } from '../shared/models/eventParams';
import { IPagination } from '../shared/models/pagination';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getEvents(eventParams: EventParams) {
    const {
      sort,
      pageNumber,
      pageSize,
      search,
      filter,
      categoryIds,
      levelIds,
    } = eventParams;

    return this.http.get<IPagination<IEvent[]>>(
      this.baseUrl +
        `events?sort=${sort}&pageIndex=${pageNumber}&pageSize=${pageSize}${
          search ? `&search=${search}` : ''
        }&filter=${filter}${categoryIds
          .map((categoryId) => `&categoryIds=${categoryId}`)
          .join('')}${levelIds
          .map((levelId) => `&levelIds=${levelId}`)
          .join('')}`
    );
  }
}
