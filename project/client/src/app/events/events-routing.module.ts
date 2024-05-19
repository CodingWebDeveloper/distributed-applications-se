import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateEventComponent } from './create-event/create-event.component';
import { SearchComponent } from './search/search.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { AdminGuard } from '../core/guards/admin.guard';

const routes: Routes = [
  {
    canActivate: [AdminGuard],
    path: 'create',
    component: CreateEventComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: ':id',
    component: EventDetailsComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
