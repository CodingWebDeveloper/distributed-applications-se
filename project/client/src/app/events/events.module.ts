import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateEventComponent } from './create-event/create-event.component';
import { EventsRoutingModule } from './events-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DndDirective } from './dnd.directive';
import { ProgressComponent } from '../shared/components/progress/progress.component';
import { SearchComponent } from './search/search.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  declarations: [
    CreateEventComponent,
    DndDirective,
    SearchComponent,
    EventDetailsComponent,
  ],
  imports: [CommonModule, EventsRoutingModule, SharedModule, NgxEditorModule],
})
export class EventsModule {}
