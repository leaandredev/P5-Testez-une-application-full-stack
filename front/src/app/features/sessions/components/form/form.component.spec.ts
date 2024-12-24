import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { of } from 'rxjs';
import { Location } from '@angular/common';
import { MockComponent } from 'src/app/testing/mock.component';
import { NgZone } from '@angular/core';
import { TeacherService } from 'src/app/services/teacher.service';
import { Router } from '@angular/router';
import { fireEvent, screen } from '@testing-library/angular';
import { By } from '@angular/platform-browser';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let location: Location;
  let ngZone: NgZone;

  const mockSession = {
    id: 123,
    name: 'ma session',
    description: 'Une description',
    date: new Date('2024-12-04T00:00:00'),
    teacher_id: 456,
    users: [1, 2, 3],
    createdAt: new Date('2024-12-02T00:00:00'),
    updatedAt: new Date('2024-12-03T00:00:00'),
  };

  const mockSessionForm = {
    name: 'ma session',
    description: 'Description modifié',
    date: new Date('2024-12-04T00:00:00'),
    teacher_id: 456,
  };

  const mockNewSessionForm = {
    name: 'ma session 2',
    description: 'Une description supplémentaire',
    date: new Date('2024-12-04T00:00:00'),
    teacher_id: 456,
  };

  const mockTeacher = {
    id: 456,
    lastName: 'Doe',
    firstName: 'John',
    createdAt: new Date('2024-12-01T00:00:00'),
    updatedAt: new Date('2024-12-01T00:00:00'),
  };

  const mockOtherTeacher = {
    id: 457,
    lastName: 'Troy',
    firstName: 'Odysseus',
    createdAt: new Date('2024-12-08T00:00:00'),
    updatedAt: new Date('2024-12-08T00:00:00'),
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true,
    },
    saveSession: jest.fn().mockReturnValue(of({})),
    updateSession: jest.fn().mockReturnValue(of({})),
  };

  const mockTeacherService = {
    all: jest.fn().mockReturnValue(of([mockTeacher, mockOtherTeacher])),
  };

  const mockSessionApiService = {
    detail: jest.fn().mockReturnValue(of(mockSession)),
    create: jest.fn().mockReturnValue(of(mockSession)),
    update: jest.fn().mockReturnValue(of(mockSession)),
  };

  const mockMatSnackBar = {
    open: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'sessions', component: MockComponent },
          { path: 'me', component: MockComponent },
          { path: 'login', component: MockComponent },
          { path: 'register', component: MockComponent },
          { path: 'create', component: MockComponent },
          { path: 'update/:id', component: MockComponent },
        ]),
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
      declarations: [FormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    location = TestBed.inject(Location);
    ngZone = TestBed.inject(NgZone);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should display html template', () => {
  //   console.log(fixture.nativeElement.innerHTML);
  // });

  // unit test
  describe('unit test', () => {
    // ngOnInit()
    describe('on initialisation', () => {
      it('should nagivate to /sessions if not an admin', async () => {
        mockSessionService.sessionInformation.admin = false;
        fixture.detectChanges();

        ngZone.run(() => {
          component.ngOnInit();
        });

        await fixture.whenStable();
        expect(location.path()).toBe('/sessions');
      });

      it('should call sessionApiService.detail() if on update and initiate form with datas', async () => {
        const router = TestBed.inject(Router);

        ngZone.run(async () => {
          await router.navigate(['/update/123']);
          component.ngOnInit();

          expect(component.onUpdate).toBe(true);
          expect(mockSessionApiService.detail).toHaveBeenCalledWith('123');
          expect(component.sessionForm?.value).toBe({
            name: 'ma session',
            date: '2024-12-04',
            teacher_id: 456,
            description: 'Une description',
          });
        });
      });

      it('should init form with empty value if on create mode', () => {
        const router = TestBed.inject(Router);

        ngZone.run(async () => {
          await router.navigate(['/create']);
          component.ngOnInit();

          expect(component.onUpdate).toBe(false);
          expect(component.sessionForm?.value).toBe({
            name: '',
            date: '',
            teacher_id: '',
            description: '',
          });
        });
      });
    });

    // submit()
    describe('on submit', () => {
      // create
      it('should call sessionApiService.create and exitPage with a message, then return to /sessions', async () => {
        component.onUpdate = false;
        component.sessionForm?.patchValue(mockNewSessionForm);
        fixture.detectChanges();
        ngZone.run(async () => {
          component.submit();
        });

        expect(mockSessionApiService.create).toHaveBeenCalledWith(
          mockNewSessionForm
        );
        expect(mockMatSnackBar.open).toHaveBeenCalledWith(
          'Session created !',
          'Close',
          { duration: 3000 }
        );
        await fixture.whenStable();
        expect(location.path()).toBe('/sessions');
      });

      // update
      it('should call sessionApiService.update and exitPage with a message, then return to /sessions', async () => {
        component.onUpdate = true;
        component.sessionForm?.patchValue(mockSessionForm);
        fixture.detectChanges();
        ngZone.run(async () => {
          component.submit();
        });

        expect(mockSessionApiService.update).toHaveBeenCalled();
        expect(mockMatSnackBar.open).toHaveBeenCalledWith(
          'Session updated !',
          'Close',
          { duration: 3000 }
        );
        await fixture.whenStable();
        expect(location.path()).toBe('/sessions');
      });
    });
  });

  // integration test
  describe('integration test', () => {
    describe('html display', () => {
      it('should display return button, all fields form and a save button if sessionForm available', () => {
        const buttons = screen.queryAllByRole('button');
        const backButton = buttons.find((btn) =>
          btn.querySelector('mat-icon')?.textContent?.includes('arrow_back')
        );

        expect(backButton).not.toBeNull();
        expect(
          document.querySelector('[formControlName="name"]')
        ).not.toBeNull();
        expect(
          document.querySelector('[formControlName="date"]')
        ).not.toBeNull();
        expect(
          document.querySelector('[formControlName="teacher_id"]')
        ).not.toBeNull();
        expect(
          document.querySelector('[formControlName="description"]')
        ).not.toBeNull();
        expect(screen.getByText('Save')).not.toBeNull();
      });

      it('should not display mat-card-content if sessionForm is undefined', () => {
        component.sessionForm = undefined;
        fixture.detectChanges();

        const matCardContent = document.querySelector('mat-card-content');
        expect(matCardContent).toBeNull(); // Vérifie que l'élément existe
      });

      it('should bind name to his FormControl', () => {
        const nameField = component.sessionForm?.get('name');
        const nameInput = document.querySelector('[formControlName="name"]');

        nameField?.setValue('session 3');
        fixture.detectChanges();

        expect((nameInput as HTMLInputElement).value).toEqual('session 3');
      });

      it('should bind date to his FormControl', () => {
        const dateField = component.sessionForm?.get('date');
        const dateInput = document.querySelector('[formControlName="date"]');

        dateField?.setValue('2024-12-31');
        fixture.detectChanges();

        expect((dateInput as HTMLInputElement).value).toEqual('2024-12-31');
      });

      it('should bind teacher select to his FormControl', async () => {
        const teacherSelect = fixture.debugElement.query(
          By.css('[formControlName="teacher_id"]')
        ).nativeElement;

        fireEvent.click(teacherSelect); // Open the menu
        fixture.detectChanges();
        await fixture.whenStable();

        const allOptions = document.querySelectorAll('mat-option');
        expect(allOptions.length).toBeGreaterThan(1); // Vérifie qu'il y a des options disponibles

        fireEvent.click(allOptions[1] as HTMLElement); // Click on the 2nd option
        fixture.detectChanges();
        await fixture.whenStable();

        const teacherId = component.sessionForm?.get('teacher_id')?.value;
        expect(teacherId).toBe(457);
      });

      it('should bind description to his FormControl', () => {
        const descriptionField = component.sessionForm?.get('description');
        const descriptionInput = document.querySelector(
          '[formControlName="description"]'
        );

        descriptionField?.setValue('new description');
        fixture.detectChanges();

        expect((descriptionInput as HTMLInputElement).value).toEqual(
          'new description'
        );
      });

      // create
      it('should display "Create session" title', () => {
        component.onUpdate = false;
        fixture.detectChanges();

        expect(screen.getByText('Create session')).not.toBeNull();
      });

      it('should display submit button clickable if form is valid', () => {
        component.sessionForm?.controls['name'].setValue('ma nouvelle session');
        component.sessionForm?.controls['date'].setValue('2024-12-30');
        component.sessionForm?.controls['teacher_id'].setValue('457');
        component.sessionForm?.controls['description'].setValue(
          'description de ma nouvelle session'
        );

        fixture.detectChanges();
        const saveButton = screen.getByText('Save');
        expect(saveButton).not.toBeNull();
        expect(saveButton.hasAttribute('disabled')).toBe(false);
      });

      it('should navigate to /session when back button clicked', async () => {
        const location = TestBed.inject(Location);
        const buttons = screen.queryAllByRole('button');
        const backButton = buttons.find((btn) =>
          btn.querySelector('mat-icon')?.textContent?.includes('arrow_back')
        );

        fireEvent.click(backButton as HTMLElement);
        expect(location.path()).toBe('/sessions');
      });

      it('should call submit() function when Save button clicked', () => {
        component.sessionForm?.controls['name'].setValue('ma nouvelle session');
        component.sessionForm?.controls['date'].setValue('2024-12-30');
        component.sessionForm?.controls['teacher_id'].setValue('457');
        component.sessionForm?.controls['description'].setValue(
          'description de ma nouvelle session'
        );

        fixture.detectChanges();

        const submitSpyOn = jest.spyOn(component, 'submit');
        const saveButton = screen.getByText('Save');
        expect(saveButton).not.toBeNull();

        fireEvent.click(saveButton as HTMLElement);
        expect(submitSpyOn).toHaveBeenCalledTimes(1);
      });

      // update
      it('should display "Update session" title', () => {
        component.onUpdate = true;
        fixture.detectChanges();

        expect(screen.getByText('Update session')).not.toBeNull();
      });

      it('should display save button disabled at first', () => {
        const saveButton = screen.getByText('Save');

        expect(saveButton).not.toBeNull();
        expect(saveButton.hasAttribute('disabled')).toBe(true);
      });
    });
  });
});
