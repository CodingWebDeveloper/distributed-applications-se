import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { EventCardComponent } from './event-card/event-card.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

@NgModule({
  declarations: [HomeComponent, EventCardComponent],
  imports: [CommonModule, SharedModule, TooltipModule.forRoot()],
  exports: [HomeComponent],
})
export class HomeModule {}
