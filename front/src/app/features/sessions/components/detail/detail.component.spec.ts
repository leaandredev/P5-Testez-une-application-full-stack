import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';
import { of } from 'rxjs';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { fireEvent, screen } from '@testing-library/angular';
import '@testing-library/jest-dom';
import { MockComponent } from 'src/app/testing/mock.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { NgZone } from '@angular/core';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
  };

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

  const mockTeacher = {
    id: 456,
    lastName: 'Doe',
    firstName: 'John',
    createdAt: new Date('2024-12-01T00:00:00'),
    updatedAt: new Date('2024-12-01T00:00:00'),
  };

  const mockSessionApiService = {
    detail: jest.fn().mockReturnValue(of(mockSession)),
    delete: jest.fn().mockReturnValue(of({})),
    participate: jest.fn().mockReturnValue(of({})),
    unParticipate: jest.fn().mockReturnValue(of({})),
  };

  const mockTeacherService = {
    detail: jest.fn().mockReturnValue(of(mockTeacher)),
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
        ]),
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    component.sessionId = '123';
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display html template', () => {
    console.log(fixture.nativeElement.innerHTML);
  });

  // unit test
  describe('unit test', () => {
    describe('on initialisation', () => {
      it('should have variables initialized in constructor', () => {
        expect(component.isAdmin).toBe(true);
        expect(component.sessionId).toBe('123');
        expect(component.userId).toBe('1');
      });

      it('should call fetchSession on ngOnInit() call, and initialize all variables on succeded', () => {
        expect(mockSessionApiService.detail).toHaveBeenCalledWith(
          component.sessionId
        );
        expect(component.session).toBe(mockSession);
        expect(component.isParticipate).toBe(true);
        expect(mockTeacherService.detail).toHaveBeenCalledWith(
          mockSession.teacher_id.toString()
        );
        expect(component.teacher).toBe(mockTeacher);
      });
    });

    // back()
    it('should call window.history.back on back() call', () => {
      const windowHistoryBackSpy = jest.spyOn(window.history, 'back');
      component.back();
      expect(windowHistoryBackSpy).toHaveBeenCalled();
    });

    // delete()
    describe('on delete() call', () => {
      beforeEach(waitForAsync(() => {
        const ngZone = TestBed.inject(NgZone);
        ngZone.run(() => {
          component.delete();
        });
      }));

      it('should call sessionApiService.delete and navigate to /sessions', () => {
        const location = TestBed.inject(Location);
        fixture.detectChanges();

        expect(mockSessionApiService.delete).toHaveBeenCalledWith(
          component.sessionId
        );
        expect(mockMatSnackBar.open).toHaveBeenCalledWith(
          'Session deleted !',
          'Close',
          { duration: 3000 }
        );

        expect(location.path()).toBe('/sessions');
      });
    });

    // participate()
    it('expect to call sessionApiService.participate on participate() call', () => {
      component.participate();
      expect(mockSessionApiService.participate).toHaveBeenCalledWith(
        component.sessionId,
        component.userId
      );
    });

    // unParticipate()
    it('expect to call sessionApiService.participate on participate() call', () => {
      component.unParticipate();
      expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith(
        component.sessionId,
        component.userId
      );
    });
  });

  // integration test
  describe('integration test', () => {
    // display HTML
    describe('display HTML elements', () => {
      it('should display the session name', () => {
        expect(screen.getByText('Ma Session')).not.toBeNull();
      });

      it('should display the teacher’s name', () => {
        expect(screen.getByText('John DOE')).not.toBeNull();
      });

      it('should display the number of attendees', () => {
        expect(screen.getByText('3 attendees')).not.toBeNull();
      });

      it('should display the session date in long format', () => {
        expect(screen.getByText('December 4, 2024')).not.toBeNull();
      });

      it('should display the description', () => {
        expect(screen.getByText('Une description')).not.toBeNull();
      });

      it('should display the created at date', () => {
        expect(screen.getByText('December 2, 2024')).not.toBeNull();
      });

      it('should display the updated at date', () => {
        expect(screen.getByText('December 3, 2024')).not.toBeNull();
      });

      it('should display the delete button if the user is admin', () => {
        expect(screen.getByText('Delete')).not.toBeNull();
      });

      it('should not display the participate button if the user is admin', () => {
        expect(screen.queryByText('Participate')).toBeNull();
        expect(screen.queryByText('Do not participate')).toBeNull();
      });

      it('should display the participate button if the user is not admin', () => {
        component.isAdmin = false;
        component.isParticipate = false;
        fixture.detectChanges();
        expect(screen.getByText('Participate')).not.toBeNull();
      });

      it('should display the "Do not participate" button if the user is participating', () => {
        component.isAdmin = false;
        component.isParticipate = true;
        fixture.detectChanges();
        expect(screen.getByText('Do not participate')).not.toBeNull();
      });

      it('should not display the card if session is not defined', () => {
        component.session = undefined;
        fixture.detectChanges();
        expect(screen.queryByRole('article')).toBeNull();
      });
    });

    // on click
    describe('user interaction', () => {
      it('should call back function on back button click', async () => {
        const backSpyOn = jest.spyOn(component, 'back');
        const buttons = screen.queryAllByRole('button');
        const backButton = buttons.find((btn) =>
          btn.querySelector('mat-icon')?.textContent?.includes('arrow_back')
        );

        fireEvent.click(backButton as HTMLElement);
        expect(backSpyOn).toHaveBeenCalledTimes(1);
      });

      it('should call delete function on delete button click', async () => {
        const deleteSpyOn = jest.spyOn(component, 'delete');
        const buttons = screen.queryAllByRole('button');
        const deleteButton = buttons.find((btn) =>
          btn.querySelector('mat-icon')?.textContent?.includes('delete')
        );

        fireEvent.click(deleteButton as HTMLElement);
        expect(deleteSpyOn).toHaveBeenCalledTimes(1);
      });

      it('should call participate function on participate button click', async () => {
        component.isAdmin = false;
        component.isParticipate = false;
        fixture.detectChanges();

        const participateSpyOn = jest.spyOn(component, 'participate');
        const buttons = screen.queryAllByRole('button');
        const participateButton = buttons.find((btn) =>
          btn.querySelector('mat-icon')?.textContent?.includes('person_add')
        );

        fireEvent.click(participateButton as HTMLElement);
        expect(participateSpyOn).toHaveBeenCalledTimes(1);
      });

      it('should call unParticipate function on unParticipate button click', async () => {
        component.isAdmin = false;
        component.isParticipate = true;
        fixture.detectChanges();

        const unParticipateSpyOn = jest.spyOn(component, 'unParticipate');
        const buttons = screen.queryAllByRole('button');
        const unParticipateButton = buttons.find((btn) =>
          btn.querySelector('mat-icon')?.textContent?.includes('person_remove')
        );

        fireEvent.click(unParticipateButton as HTMLElement);
        expect(unParticipateSpyOn).toHaveBeenCalledTimes(1);
      });
    });
  });
});
