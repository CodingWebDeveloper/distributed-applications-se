import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { EventsService } from 'src/app/events/events.service';
import { EventParams } from 'src/app/shared/models/eventParams';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  @ViewChild('search') searchTerm?: ElementRef;
  eventParams = new EventParams();

  constructor(
    public accountService: AccountService,
    public router: Router,
    private eventsService: EventsService
  ) {}

  ngOnInit(): void {
    this.eventsService.eventParams$.pipe(take(1)).subscribe({
      next: (params) => {
        if (params) {
          this.eventParams = params;
        }
      },
    });
  }

  onSearch() {
    this.eventParams.search = this.searchTerm?.nativeElement.value;
    this.eventsService.setEventParams(this.eventParams);
  }
}
