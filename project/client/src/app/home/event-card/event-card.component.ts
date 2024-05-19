import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { EventsService } from 'src/app/events/events.service';
import { FavoritesService } from 'src/app/events/favorites.service';
import {
  ICreateFavorite,
  IEnrollUser,
  IEvent,
} from 'src/app/shared/models/event';
import { IUser } from 'src/app/shared/models/user';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
})
export class EventCardComponent implements OnInit {
  @Input() event?: IEvent;
  @Input() myEvents: IEvent[] = [];
  @Input() myFavorites: IEvent[] = [];
  currentUser?: IUser;

  constructor(
    private eventsService: EventsService,
    private accountService: AccountService,
    private toastrService: ToastrService,
    private favoritesService: FavoritesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  onEventEnroll() {
    if (this.currentUser && this.event) {
      const enrollUserDto: IEnrollUser = {
        userId: this.currentUser.id,
        eventId: this.event.id,
      };

      this.eventsService.enrollUser(enrollUserDto).subscribe({
        next: () => {
          this.getMyEvents();
          this.toastrService.success('You enrolled for this event');
        },
        error: (err) => console.log(err),
      });
    }
  }

  onEventReject() {
    if (this.currentUser && this.event) {
      const enrollUserDto: IEnrollUser = {
        userId: this.currentUser.id,
        eventId: this.event.id,
      };

      this.eventsService.rejectUser(enrollUserDto).subscribe({
        next: () => {
          this.getMyEvents();
          this.toastrService.success('You rejected this event');
        },
        error: (err) => console.log(err),
      });
    }
  }

  onAddToFavorites() {
    if (this.currentUser && this.event) {
      const addToFavoritesDto: ICreateFavorite = {
        userId: this.currentUser.id,
        eventId: this.event.id,
      };

      this.favoritesService.addToFavorites(addToFavoritesDto).subscribe({
        next: () => {
          this.getMyFavorites();
          this.toastrService.success('You added this event to favorites');
        },
        error: (err) => console.log(err),
      });
    }
  }

  onRemoveFromFavorites() {
    if (this.currentUser && this.event) {
      const addToFavoritesDto: ICreateFavorite = {
        userId: this.currentUser.id,
        eventId: this.event.id,
      };

      this.favoritesService.removeFromFavorites(addToFavoritesDto).subscribe({
        next: () => {
          this.getMyFavorites();
          this.toastrService.success('You removed this event from favorites');
        },
        error: (err) => console.log(err),
      });
    }
  }

  checkIfEventExists() {
    return this.myEvents.some((e) => e.id === this.event?.id);
  }

  checkIfFavoriteExists() {
    return this.myFavorites.some((f) => f.id === this.event?.id);
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

  getCurrentUser() {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (response) => {
        if (response) {
          this.currentUser = response;
        }
      },
      error: (err) => console.log(err),
    });
  }

  onCardClick() {
    if (this.event) {
      this.router.navigateByUrl(`/events/${this.event.id}`);
    }
  }
}
