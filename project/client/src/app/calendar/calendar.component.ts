import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { isSameMonth, isSameDay, addMinutes, format } from 'date-fns';
import {
  CalendarEvent,
  CalendarView,
  CalendarEventTimesChangedEvent,
} from 'angular-calendar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, take } from 'rxjs';
import { ICategory } from '../shared/models/category';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ILevel } from '../shared/models/level';
import { EventsService } from '../events/events.service';
import {
  ICreateEvent,
  IEditEvent,
  IEvent,
  IEventShortDetails,
} from '../shared/models/event';
import { AccountService } from '../account/account.service';
import { IUser } from '../shared/models/user';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @ViewChild('modalContentEdit', { static: true })
  modalContentEdit!: TemplateRef<any>;
  @ViewChild('modalContentCreate', { static: true })
  modalContentCreate!: TemplateRef<any>;
  @ViewChild('modalContentDetails', { static: true })
  modalContentDetails!: TemplateRef<any>;

  file!: any;
  presenterImage!: any;
  categories!: ICategory[];
  levels!: ILevel[];

  currUser!: IUser | null;
  currEvent!: IEventShortDetails;
  editor!: Editor;
  html = '';
  eventForm = this.fb.group({
    id: [0, Validators.required],
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: [0, [Validators.required, Validators.min(1)]],
    date: [
      moment(new Date()).utc().format('yyyy-MM-D HH:mm'),
      Validators.required,
    ],
    level: [0, [Validators.required, Validators.min(1)]],
    duration: [0, [Validators.required, Validators.min(30)]],
    location: ['', [Validators.required]],
    presenterName: ['', Validators.required],
    presenterRole: ['', Validators.required],
    imageUrl: ['', Validators.required],
    presenterImageUrl: ['', Validators.required],
  });

  createEventForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: [0, [Validators.required, Validators.min(1)]],
    date: [
      moment(new Date()).utc().format('yyyy-MM-D HH:mm'),
      Validators.required,
    ],
    level: [0, [Validators.required, Validators.min(1)]],
    duration: [0, [Validators.required, Validators.min(30)]],
    location: ['', [Validators.required]],
    presenterName: ['', Validators.required],
    presenterRole: ['', Validators.required],
  });

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  CalendarView = CalendarView;
  events!: CalendarEvent[];
  refresh = new Subject<void>();
  activeDayIsOpen: boolean = true;

  constructor(
    private modal: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private eventsService: EventsService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    // Used for admin
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.currUser = user;
      if (user?.roles.includes('Admin')) {
        this.eventsService.getAllEvents().subscribe({
          next: (response) => {
            this.events = response.map((event) => {
              const startDate = new Date(event.date);

              return {
                id: event.id,
                start: startDate,
                end: addMinutes(startDate, event.duration),
                title: event.title,
                color: {
                  primary: '#ad2121',
                  secondary: '#FAE3E3',
                },
              };
            });
          },
          error: (err) => {
            console.log(err);
          },
        });

        this.eventsService.getCategories().subscribe({
          next: (response) => {
            this.categories = response;
          },
          error: (err) => {
            console.log(err);
          },
        });

        this.eventsService.getLevels().subscribe({
          next: (response) => {
            this.levels = response;
          },
          error: (err) => {
            console.log(err);
          },
        });
      } else {
        this.eventsService.getMyEvents().subscribe((response) => {
          this.events = response.map((event) => {
            const startDate = new Date(event.date);

            return {
              id: event.id,
              start: startDate,
              end: addMinutes(startDate, event.duration),
              title: event.title,
              color: {
                primary: '#ad2121',
                secondary: '#FAE3E3',
              },
            };
          });
        });
      }
    });

    this.editor = new Editor();
  }

  onSubmit() {
    const dto = {
      id: this.eventForm.value.id ?? 0,
      title: this.eventForm.value.title ?? '',
      description: this.eventForm.value.description ?? '',
      date: this.eventForm.value.date ?? '',
      categoryId: this.eventForm.value.category ?? 0,
      levelId: this.eventForm.value.level ?? 0,
      imageUrl: this.eventForm.value.imageUrl ?? '',
      image: this.file,
      presenterImageUrl: this.eventForm.value.presenterImageUrl ?? '',
      presenterImage: this.presenterImage,
      location: this.eventForm.value.location ?? '',
      duration: this.eventForm.value.duration ?? 0,
      presenterName: this.eventForm.value.presenterName ?? '',
      presenterRole: this.eventForm.value.presenterRole ?? '',
    };

    this.eventsService.editEvent(dto).subscribe(
      (response) => {
        const event = response;
        const startDate = new Date(event.date);

        this.events = this.events.map((localEvent) => {
          if (localEvent.id === response.id) {
            return {
              id: event.id,
              start: startDate,
              end: addMinutes(startDate, event.duration),
              title: event.title,
              color: {
                primary: '#ad2121',
                secondary: '#FAE3E3',
              },
            };
          }

          return localEvent;
        });

        this.handleCloseEdit();
        this.toastr.success('Event edited successfully');
      },
      () => {
        this.toastr.error('Failed to edit event');
      }
    );
  }

  createOnSubmit() {
    const dto = {
      title: this.createEventForm.value.title ?? '',
      description: this.createEventForm.value.description ?? '',
      date: this.createEventForm.value.date ?? '',
      categoryId: this.createEventForm.value.category ?? 0,
      levelId: this.createEventForm.value.level ?? 0,
      image: this.file,
      presenterImage: this.presenterImage,
      location: this.createEventForm.value.location ?? '',
      duration: this.createEventForm.value.duration ?? 0,
      presenterName: this.createEventForm.value.presenterName ?? '',
      presenterRole: this.createEventForm.value.presenterRole ?? '',
    };

    this.eventsService.createEvent(dto).subscribe(
      (response) => {
        // const event = response;
        const event = response;
        const startDate = new Date(event.date);
        const newEvent = {
          id: event.id,
          start: startDate,
          end: addMinutes(startDate, event.duration),
          title: event.title,
          color: {
            primary: '#ad2121',
            secondary: '#FAE3E3',
          },
        };
        this.events = [...this.events, newEvent];

        this.handleCloseCreate();
        this.toastr.success('Event created successfully');
      },
      () => {
        this.toastr.error('Failed to create event');
      }
    );
  }

  onDelete(event: any) {
    event.stopPropagation();
    const id = this.eventForm.value.id;
    if (!id) return;

    this.eventsService.deleteEvent(id).subscribe(
      () => {
        this.events = this.events.filter((e) => e.id !== id);
        this.handleCloseEdit();
        this.toastr.success('Event deleted successfully');
      },
      () => {
        this.toastr.error('Failed to delete event');
      }
    );
  }

  handleCloseEdit() {
    this.eventForm.reset({
      title: '',
      description: '',
      category: 0,
      level: 0,
      date: moment(new Date()).utc().format('yyyy-MM-D HH:mm'),
    });
    this.file = null;
    this.presenterImage = null;
    this.modal.dismissAll();
  }

  handleCloseCreate() {
    this.eventForm.reset({
      title: '',
      description: '',
      category: 0,
      level: 0,
      date: moment(new Date()).utc().format('yyyy-MM-D HH:mm'),
    });
    this.file = null;
    this.presenterImage = null;
    this.modal.dismissAll();
  }

  handleCloseDetails() {
    this.modal.dismissAll();
  }

  handleClickMore() {
    this.router.navigateByUrl(`/events/${this.currEvent.id}`);
    this.handleCloseDetails();
  }

  handleEvent(event: CalendarEvent): void {
    const { id } = event;
    if (!this.currUser) return;

    if (this.currUser.roles.includes('Admin')) {
      this.eventsService.getEventToEditById(Number(id)).subscribe({
        next: (response) => {
          const {
            id,
            title,
            description,
            categoryId,
            date,
            levelId,
            imageUrl,
            presenterImageUrl,
            location,
            duration,
            presenterName,
            presenterRole,
          } = response;

          this.eventForm = this.fb.group({
            id: [id, Validators.required],
            title: [title, Validators.required],
            description: [description, Validators.required],
            category: [categoryId, [Validators.required, Validators.min(1)]],
            date: [
              moment(date).utc().format('yyyy-MM-D HH:mm'),
              Validators.required,
            ],
            level: [levelId, [Validators.required, Validators.min(1)]],
            imageUrl: [imageUrl, [Validators.required]],
            presenterImageUrl: [presenterImageUrl, [Validators.required]],
            duration: [duration, [Validators.required, Validators.min(30)]],
            location: [location, Validators.required],
            presenterName: [presenterName, Validators.required],
            presenterRole: [presenterRole, Validators.required],
          });

          this.modal.open(this.modalContentEdit, { size: 'lg' });
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.eventsService.getEventToEditById(Number(id)).subscribe({
        next: (response) => {
          const { id, title, date, duration, location } = response;
          const startDate = new Date(date);
          const endDate = addMinutes(new Date(date), duration);

          const startDateformat = 'MMM D,  HH:mm A';
          let endDateformat = 'D HH:mm A';
          if (startDate.getDay() === endDate.getDay()) {
            endDateformat = 'HH:mm A';
          }

          this.currEvent = {
            id,
            title,
            date,
            formattedStartDate: moment(date).utc().format(startDateformat),
            formattedEndDate: moment(endDate).utc().format(endDateformat),
            location,
          };

          this.modal.open(this.modalContentDetails, { size: 'md' });
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }

      this.viewDate = date;
    }

    if (!this.currUser?.roles.includes('Admin')) return;

    this.createEventForm.patchValue({
      date: moment(date).format('yyyy-MM-DD HH:mm'),
    });
    this.modal.open(this.modalContentCreate, { size: 'lg' });
  }

  hourClicked(date: Date): void {
    if (!this.currUser?.roles.includes('Admin')) return;

    this.createEventForm.patchValue({
      date: moment(date).format('yyyy-MM-D HH:mm'),
    });
    this.modal.open(this.modalContentCreate, { size: 'lg' });
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }

      return iEvent;
    });

    this.handleEvent(event);
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  openImage(url: string | null | undefined) {
    if (url) {
      window.open(url, '_blank');
    }
  }

  openFile(file: any) {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
  }

  deleteFile() {
    if (this.file.progress < 100) {
      console.log('Upload in progress.');
      return;
    }

    this.file = null;
  }

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

  presenterImageBrowseHandler(e?: any) {
    if (e && e.target) {
      let files: any[] = e.target.files;
      this.preparePresenterImageFilesList(files);
    }
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator() {
    setTimeout(() => {
      const progressInterval = setInterval(() => {
        if (this.file.progress === 100) {
          clearInterval(progressInterval);
          this.uploadFilesSimulator();
        } else {
          this.file.progress += 5;
        }
      }, 200);
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files?: Array<any>) {
    if (files) {
      this.file = files[0];
      this.file.progress = 0;

      this.uploadFilesSimulator();
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

  preparePresenterImageFilesList(files?: Array<any>) {
    if (files && files?.length !== 0) {
      this.presenterImage = files[0];
    }
  }
}
