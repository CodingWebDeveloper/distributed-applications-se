import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from './components/text-input/text-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressComponent } from './components/progress/progress.component';

@NgModule({
  declarations: [TextInputComponent, ProgressComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
  ],
  exports: [
    TextInputComponent,
    ReactiveFormsModule,
    BsDropdownModule,
    ProgressComponent,
  ],
})
export class SharedModule {}
