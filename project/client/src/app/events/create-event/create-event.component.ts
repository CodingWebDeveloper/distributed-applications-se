import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ICreateEvent } from 'src/app/shared/models/event';
import { EventsService } from '../events.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ICategory } from 'src/app/shared/models/category';
import { ILevel } from 'src/app/shared/models/level';
import { formatDate } from '@angular/common';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent implements OnInit, OnDestroy {
  @ViewChild('fileDropRef') fileDropEl?: ElementRef;
  files: any[] = [];
  presenterImageFiles: any[] = [];
  categories: ICategory[] = [];
  levels: ILevel[] = [];
  editor!: Editor;
  html = '';

  constructor(
    private fb: FormBuilder,
    private eventsService: EventsService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.getCategories();
    this.getLevels();
  }

  eventForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: [0, [Validators.required, Validators.min(1)]],
    level: [0, [Validators.required, Validators.min(1)]],
    date: [
      formatDate(new Date(), 'yyyy-MM-dd hh:mm', 'en'),
      Validators.required,
    ],
    duration: [0, [Validators.required, Validators.min(1)]],
    location: ['', Validators.required],
    presenterName: ['', Validators.required],
    presenterRole: ['', Validators.required],
  });

  /**
   * on file drop handler
   */
  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(e?: any) {
    if (e && e.target) {
      let files: any[] = e.target.files;
      this.prepareFilesList(files);
    }
  }

  /**
   * handle file from browsing
   */
  presenterImageBrowseHandler(e?: any) {
    if (e && e.target) {
      let files: any[] = e.target.files;
      this.preparePresenterImageFilesList(files);
    }
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    if (this.files[index].progress < 100) {
      console.log('Upload in progress.');
      return;
    }
    this.files.splice(index, 1);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files?: Array<any>) {
    if (files) {
      const newFiles = [];

      for (const item of files) {
        item.progress = 0;
        newFiles.push(item);
      }

      this.files = newFiles;

      if (this.fileDropEl) {
        this.fileDropEl.nativeElement.value = '';
        this.uploadFilesSimulator(0);
      }
    }
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  preparePresenterImageFilesList(files?: Array<any>) {
    if (files) {
      const newFiles = [];

      for (const item of files) {
        item.progress = 0;
        newFiles.push(item);
      }

      this.presenterImageFiles = newFiles;
    }
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  onSubmit() {
    const eventDto: ICreateEvent = {
      title: this.eventForm.get('title')?.value ?? '',
      description: this.eventForm.get('description')?.value ?? '',
      date: this.eventForm.get('date')?.value ?? '',
      duration: this.eventForm.get('duration')?.value ?? 0,
      location: this.eventForm.get('location')?.value ?? '',
      presenterName: this.eventForm.get('presenterName')?.value ?? '',
      presenterRole: this.eventForm.get('presenterRole')?.value ?? '',
      categoryId: this.eventForm.get('category')?.value ?? 0,
      levelId: this.eventForm.get('level')?.value ?? 0,
      image: this.files && this.files.length > 0 ? this.files[0] : null,
      presenterImage:
        this.presenterImageFiles && this.presenterImageFiles.length > 0
          ? this.presenterImageFiles[0]
          : null,
    };

    this.eventsService.createEvent(eventDto).subscribe({
      next: (response) => {
        this.eventForm.reset();
        this.toastr.success('Event created successfully');
        this.router.navigateByUrl('/');
      },
    });
  }

  getCategories() {
    this.eventsService.getCategories().subscribe({
      next: (response) => (this.categories = response),
      error: (error) => console.log(error),
    });
  }

  getLevels() {
    this.eventsService.getLevels().subscribe({
      next: (response) => (this.levels = response),
      error: (error) => console.log(error),
    });
  }
}
