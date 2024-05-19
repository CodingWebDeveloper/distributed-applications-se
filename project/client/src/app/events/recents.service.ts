import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ICreateRecent } from '../shared/models/event';

@Injectable({
  providedIn: 'root',
})
export class RecentsService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addToRecents(dto: ICreateRecent) {
    return this.http.post<number>(this.baseUrl + 'recents', dto);
  }
}
