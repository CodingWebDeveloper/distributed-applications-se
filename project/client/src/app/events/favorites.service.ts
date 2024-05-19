import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ICreateFavorite } from '../shared/models/event';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  addToFavorites(dto: ICreateFavorite) {
    return this.http.post<number>(this.baseUrl + 'favorites', dto);
  }

  removeFromFavorites(dto: ICreateFavorite) {
    const { userId, eventId } = dto;

    return this.http.delete(this.baseUrl + `favorites/${userId}/${eventId}`);
  }
}
