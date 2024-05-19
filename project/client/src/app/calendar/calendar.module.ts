import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarRoutingModule } from './calendar-routing.module';
import { SharedModule } from '../shared/shared.module';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroupDirective,
} from '@angular/forms';
import { CalendarComponent } from './calendar.component';
import { CalendarModule as CModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  declarations: [CalendarComponent],
  imports: [
    NgxEditorModule,
    CommonModule,
    CalendarRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    CModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
})
export class CalendarModule {}
