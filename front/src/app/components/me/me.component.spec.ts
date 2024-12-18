import { HttpClientModule } from '@angular/common/http';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
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

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  const userMock = {
    id: 1,
    email: 'test@yoga.fr',
    lastName: 'LASTNAME',
    firstName: 'FirstName',
    admin: true,
    password: 'fjhzbefhbhbbhgz55655',
    createdAt: '2024/12/12',
    updatedAt: '2024/12/12',
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
    logOut: jest.fn(),
  };

  const mockUserService = {
    getById: jest.fn().mockReturnValue(of(userMock)),
    delete: jest.fn().mockReturnValue(of(null)),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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

    jest.clearAllMocks();
    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call userService.getById on initialisation', () => {
    expect(mockUserService.getById).toHaveBeenCalledTimes(1);
  });

  it('should fill user on initialisation', () => {
    expect(component.user).toBe(userMock);
  });

  it('should call window.history.back on back call', () => {
    const windowHistoryBackSpy = jest.spyOn(window.history, 'back');
    component.back();
    expect(windowHistoryBackSpy).toHaveBeenCalled();
  });

  it('should call userService.delete on delete call', waitForAsync(() => {
    component.delete();

    fixture.whenStable().then(() => {
      expect(mockUserService.delete).toHaveBeenCalledTimes(1);
    });
  }));

  it('should call sessionService.logOut after userService.delete', waitForAsync(() => {
    component.delete();

    fixture.whenStable().then(() => {
      expect(mockSessionService.logOut).toHaveBeenCalledTimes(1);
    });
  }));

  it('should navigate to "/" after user deletion', waitForAsync(() => {
    component.delete();

    fixture.whenStable().then(() => {
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  }));
});
