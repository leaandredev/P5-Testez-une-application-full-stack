import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { UserService } from 'src/app/services/user.service';

import { MeComponent } from './me.component';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { fireEvent, screen } from '@testing-library/angular';
import '@testing-library/jest-dom';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  //Mock datas
  const mockUser = {
    id: 1,
    email: 'test@yoga.fr',
    lastName: 'LASTNAME',
    firstName: 'FirstName',
    admin: true,
    password: 'fjhzbefhbhbbhgz55655',
    createdAt: '2024/12/12',
    updatedAt: '2024/12/12',
  };

  // Mock services
  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
    logOut: jest.fn(),
  };

  const mockUserService = {
    getById: jest.fn().mockReturnValue(of(mockUser)),
    delete: jest.fn().mockReturnValue(of(null)),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MeComponent);
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

  // Integration tests
  describe('integration test', () => {
    it('should display Name paragraph with right datas', async () => {
      const nameParagraph = await screen.findByText('Name: FirstName LASTNAME');
      expect(nameParagraph).toBeInTheDocument();
    });

    it('should display Email paragraph', async () => {
      const nameParagraph = await screen.findByText('Email: test@yoga.fr');
      expect(nameParagraph).toBeInTheDocument();
    });

    it('should call back function on back button click', async () => {
      const backSpyOn = jest.spyOn(component, 'back');
      const buttons = screen.queryAllByRole('button');
      const backButton = buttons.find((btn) =>
        btn.querySelector('mat-icon')?.textContent?.includes('arrow_back')
      );

      fireEvent.click(backButton as HTMLElement);
      expect(backSpyOn).toHaveBeenCalledTimes(1);
    });

    // User in an admin
    describe('user is an admin', () => {
      beforeEach(async () => {
        mockUser.admin = true;
        mockSessionService.sessionInformation.admin = true;
        fixture.detectChanges();
      });

      it('should display "You are admin" paragraph', async () => {
        const nameParagraph = await screen.findByText('You are admin');
        expect(nameParagraph).toBeInTheDocument();
      });

      it('should not display button to delete account', async () => {
        const deleteButton = await screen.queryByText('Detail');
        expect(deleteButton).not.toBeInTheDocument();
      });
    });

    // User is not an admin
    describe('user is not an admin', () => {
      beforeEach(async () => {
        mockUser.admin = false;
        mockSessionService.sessionInformation.admin = false;
        fixture.detectChanges();
      });

      it('should not display "You are admin" paragraph', async () => {
        const nameParagraph = screen.queryByText('You are admin');
        expect(nameParagraph).not.toBeInTheDocument();
      });

      it('should display button to delete account', async () => {
        const deleteButton = screen.queryByText('Detail');
        expect(deleteButton).toBeInTheDocument();
      });

      it('should call delete function on delete button click', async () => {
        const deleteSpyOn = jest.spyOn(component, 'delete');
        const deleteButton = screen.queryByText('Detail');
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton as HTMLElement);
        expect(deleteSpyOn).toHaveBeenCalledTimes(1);
      });
    });
  });

  // Unit tests
  describe('unit test', () => {
    // ngOnInit()
    describe('on initialisation', () => {
      it('should call userService.getById', () => {
        expect(mockUserService.getById).toHaveBeenCalledTimes(1);
      });

      it('should fill user', () => {
        expect(component.user).toBe(mockUser);
      });

      it('should be same user id that sessionInformation', () => {
        expect(component.user?.id).toBe(
          mockSessionService.sessionInformation.id
        );
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
        component.delete();
        fixture.whenStable();
      }));

      it('should call userService.delete', () => {
        expect(mockUserService.delete).toHaveBeenCalledTimes(1);
      });

      it('should call sessionService.logOut after userService.delete', () => {
        expect(mockSessionService.logOut).toHaveBeenCalledTimes(1);
      });

      it('should navigate to "/" after user deletion', () => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
      });
    });
  });
});
