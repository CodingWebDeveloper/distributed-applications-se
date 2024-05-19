import { Component, OnInit } from '@angular/core';
import { IEvent } from '../shared/models/event';
import { EventParams } from '../shared/models/eventParams';
import { HomeService } from './home.service';
import { EventsService } from '../events/events.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  events: IEvent[] = [];
  myEvents: IEvent[] = [];
  myFavorites: IEvent[] = [];
  eventParams = new EventParams();
  totalCount = 0;
  numberOfPages = 0;

  constructor(
    private homeService: HomeService,
    private eventsService: EventsService
  ) {}

  ngOnInit(): void {
    this.getMyEvents();

    this.getMyFavorites();

    this.eventsService.eventParams$.subscribe({
      next: (params) => {
        if (params) {
          this.eventParams = params;
          this.eventParams.pageNumber = 1;
          this.getEvents();
        }
      },
    });
  }

  getEvents() {
    this.homeService.getEvents(this.eventParams).subscribe({
      next: (response) => {
        this.events = response.data;
        this.eventParams.pageNumber = response.pageIndex;
        this.eventParams.pageSize = response.pageSize;
        this.totalCount = response.count;
        this.numberOfPages = Math.ceil(response.count / response.pageSize);
      },
      error: (error) => console.log(error),
    });
  }

  loadMore() {
    this.eventParams.pageNumber++;

    this.homeService.getEvents(this.eventParams).subscribe({
      next: (response) => {
        this.events = [...this.events, ...response.data];
        this.eventParams.pageNumber = response.pageIndex;
        this.eventParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
      error: (error) => console.log(error),
    });
  }

  onFilterChange(filter: string) {
    this.eventParams.filter = filter;
  }

  getMyEvents() {
    this.eventsService.getMyEvents().subscribe({
      next: (response) => (this.myEvents = response),
      error: (err) => console.log(err),
    });
  }

  getMyFavorites() {
    this.eventsService.getMyFavorites().subscribe({
      next: (response) => (this.myFavorites = response),
      error: (err) => console.log(err),
    });
  }
}
