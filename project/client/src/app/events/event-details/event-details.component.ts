import { Component, OnInit, TemplateRef } from '@angular/core';
import { RecentsService } from '../recents.service';
import { ActivatedRoute } from '@angular/router';
import {
  ICreateFavorite,
  ICreateRecent,
  IEnrollUser,
  IEvent,
} from 'src/app/shared/models/event';
import { AccountService } from 'src/app/account/account.service';
import { IUser } from 'src/app/shared/models/user';
import { take } from 'rxjs';
import { EventsService } from '../events.service';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators } from '@angular/forms';
import { ICreateLink } from 'src/app/shared/models/link';
import { LinksService } from '../links.service';
import { ToastrService } from 'ngx-toastr';
import { FavoritesService } from '../favorites.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
})
export class EventDetailsComponent implements OnInit {
  currentUser?: IUser;
  event?: IEvent;
  modalRef?: BsModalRef;
  myEvents: IEvent[] = [];
  myFavorites: IEvent[] = [];

  constructor(
    private recentsService: RecentsService,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private eventsService: EventsService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private linksService: LinksService,
    private toastr: ToastrService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
    this.onRecentAdd();
    this.getEventDetails();
    this.getMyEvents();
    this.getMyFavorites();
  }

  linkForm = this.fb.group({
    name: ['', Validators.required],
    path: ['', Validators.required],
  });

  onRecentAdd() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.currentUser && id) {
      const dto: ICreateRecent = {
        userId: this.currentUser.id,
        eventId: Number(id),
      };

      this.recentsService.addToRecents(dto).subscribe();
    }
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

  getEventDetails() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      this.eventsService.getEventDetails(Number(id)).subscribe({
        next: (response) => {
          this.event = response;
          this.event.formattedStartDate = moment(new Date(this.event.date))
            .utc()
            .format('ddd, MMM D, YYYY, h:mm A');

          this.event.formattedEndDate = moment(new Date(this.event.date))
            .add(this.event.duration, 'minutes')
            .utc()
            .format('ddd, MMM D, YYYY, h:mm A');
        },
      });
    }
  }

  openModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template);
  }

  onSubmit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id) {
      const dto: ICreateLink = {
        name: this.linkForm.get('name')?.value ?? '',
        path: this.linkForm.get('path')?.value ?? '',
        eventId: Number(id),
      };

      this.linksService.createLink(dto).subscribe({
        next: () => {
          this.getEventDetails();
          this.linkForm.reset();
          this.toastr.success('Link added successfully');
          this.modalRef?.hide();
        },
        error: (err) => console.log(err),
      });
    }
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
          this.toastr.success('You enrolled for this event');
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
          this.toastr.success('You rejected this event');
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
          this.toastr.success('You added this event to favorites');
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
          this.toastr.success('You removed this event from favorites');
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
}
