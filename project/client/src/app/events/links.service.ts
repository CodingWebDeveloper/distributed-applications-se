import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ICreateLink, ILink } from '../shared/models/link';

@Injectable({
  providedIn: 'root',
})
export class LinksService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createLink(dto: ICreateLink) {
    return this.http.post<ILink>(this.baseUrl + 'links', dto);
  }
}
