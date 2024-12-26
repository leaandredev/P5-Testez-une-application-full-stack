import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { ListComponent } from './list.component';
import { of } from 'rxjs';
import { SessionApiService } from '../../services/session-api.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'src/app/testing/mock.component';
import { fireEvent, screen } from '@testing-library/angular';
import { Location } from '@angular/common';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let location: Location;

  const mockSessions = [
    {
      id: 123,
      name: 'Session 1',
      description: 'Description de la session 1',
      date: new Date('2024-12-04T00:00:00'),
      teacher_id: 456,
      users: [1, 2, 3],
      createdAt: new Date('2024-12-02T00:00:00'),
      updatedAt: new Date('2024-12-03T00:00:00'),
    },
    {
      id: 124,
      name: 'Session 2',
      description: 'Description de la session 2',
      date: new Date('2024-12-05T00:00:00'),
      teacher_id: 457,
      users: [4, 5, 6],
      createdAt: new Date('2024-12-03T00:00:00'),
      updatedAt: new Date('2024-12-04T00:00:00'),
    },
    {
      id: 125,
      name: 'Session 3',
      description: 'Description de la session 3',
      date: new Date('2024-12-06T00:00:00'),
      teacher_id: 458,
      users: [7, 8, 9],
      createdAt: new Date('2024-12-04T00:00:00'),
      updatedAt: new Date('2024-12-05T00:00:00'),
    },
  ];

  const mockSessionService = {
    sessionInformation: {
      admin: true,
    },
  };

  const mockSessionApiService = {
    all: jest.fn().mockReturnValue(of(mockSessions)),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'create', component: MockComponent },
          { path: 'update/:id', component: MockComponent },
          { path: 'detail/:id', component: MockComponent },
        ]),
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
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
    it('should fetch sessions via sessionApiService', () => {
      component.sessions$.subscribe((sessions) => {
        expect(sessions).toEqual(mockSessions);
      });
    });

    it('should return session information via user getter', () => {
      expect(component.user).toEqual(mockSessionService.sessionInformation);
    });
  });

  // integration test
  describe('integration test', () => {
    it('should display Rentals available title', () => {
      const pageTitle = screen.queryByText('Rentals available');
      expect(pageTitle).not.toBeNull();
    });

    it('should display sessions information', () => {
      mockSessions.forEach((session) => {
        expect(screen.getByText(session.name)).not.toBeNull();
        expect(screen.getByText(session.description)).not.toBeNull();
      });
    });

    it('should display all Detail buttons', () => {
      const detailButtons = screen.queryAllByText('Detail');
      expect(detailButtons.length).toBe(mockSessions.length);
    });

    it('should display create and edit buttons if user is an admin', () => {
      const buttonCreate = screen.queryByText('Create');
      const editButtons = screen.getAllByText('Edit');
      expect(buttonCreate).not.toBeNull;
      expect(editButtons.length).toBe(mockSessions.length);
    });

    it('should NOT display create and edit buttons if user is NOT an admin', () => {
      mockSessionService.sessionInformation.admin = false;
      fixture.detectChanges();

      const buttonCreate = screen.queryByText('Create');
      const editButtons = screen.queryAllByText('Edit');
      expect(buttonCreate).toBeNull;
      expect(editButtons).toBeNull;
    });

    // navigation
    describe('navigation tests', () => {
      beforeEach(() => {
        mockSessionService.sessionInformation.admin = true;
        fixture.detectChanges();
      });

      it('should navigate to "/create" when Create button is clicked', async () => {
        const createButton = screen.getByText('Create');
        fireEvent.click(createButton as HTMLElement);
        fixture.detectChanges();

        expect(location.path()).toBe('/create');
      });

      it('should navigate to "/detail" when Detail button is clicked', async () => {
        const detailButtons = screen.queryAllByText('Detail');
        fireEvent.click(detailButtons[0] as HTMLElement);
        fixture.detectChanges();

        expect(location.path()).toBe('/detail/123');
      });

      it('should navigate to "/update" when Edit button is clicked', async () => {
        const detailButtons = screen.queryAllByText('Edit');
        fireEvent.click(detailButtons[1] as HTMLElement);
        fixture.detectChanges();

        expect(location.path()).toBe('/update/124');
      });
    });
  });
});
