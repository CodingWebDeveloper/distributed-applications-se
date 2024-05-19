import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EventParams } from 'src/app/shared/models/eventParams';
import { EventsService } from '../events.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { ICategory } from 'src/app/shared/models/category';
import { ILevel } from 'src/app/shared/models/level';
import { IEvent } from 'src/app/shared/models/event';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @ViewChild('search') searchTerm?: ElementRef;
  params = new EventParams();
  categories: ICategory[] = [];
  levels: ILevel[] = [];
  newestEvents: IEvent[] = [];

  constructor(private eventsService: EventsService, private router: Router) {}

  ngOnInit(): void {
    this.getCategories();
    this.initializeEventParams();
    this.getLevels();
    this.getNewestEvents();
  }

  onSearch() {
    this.params.search = this.searchTerm?.nativeElement.value;
    this.eventsService.setEventParams(this.params);
    this.router.navigateByUrl('/');
  }

  onFilterChange(filter: string) {
    this.params.filter = filter;
  }

  getCategories() {
    this.eventsService.getCategories().subscribe({
      next: (response) => (this.categories = response),
      error: (error) => console.log(error),
    });
  }

  onCategoryCheck(id: number) {
    if (this.params.categoryIds.includes(id)) {
      this.params.categoryIds = this.params.categoryIds.filter(
        (categoryId) => categoryId !== id
      );
    } else {
      this.params.categoryIds.push(id);
    }
  }

  onRatingChange(value: number) {
    this.params.rating = value;
  }

  initializeEventParams() {
    this.eventsService.eventParams$.pipe(take(1)).subscribe({
      next: (params) => {
        if (params) {
          this.params = params;
        }
      },
    });
  }

  getLevels() {
    this.eventsService.getLevels().subscribe({
      next: (response) => (this.levels = response),
      error: (error) => console.log(error),
    });
  }

  onLevelCheck(id: number) {
    if (this.params.levelIds.includes(id)) {
      this.params.levelIds = this.params.levelIds.filter(
        (levelId) => levelId !== id
      );
    } else {
      this.params.levelIds.push(id);
    }
  }

  getNewestEvents() {
    this.eventsService.getNewestEvents().subscribe({
      next: (response) => (this.newestEvents = response),
      error: (err) => console.log(err),
    });
  }

  onEventClick(id: number) {
    this.router.navigateByUrl(`/events/${id}`);
  }
}
