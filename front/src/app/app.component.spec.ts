import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { BehaviorSubject } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SessionService } from './services/session.service';
import { NgZone } from '@angular/core';
import { fireEvent, screen } from '@testing-library/angular';

import '@testing-library/jest-dom';
import { Location } from '@angular/common';
import { MockComponent } from './testing/mock.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const mockIsLoggedSubject = new BehaviorSubject<boolean>(true);

  const mockSessionService = {
    sessionInformation: { admin: true, id: 1 },
    logOut: jest.fn(),
    logIn: jest.fn(),
    $isLogged: jest.fn(() => mockIsLoggedSubject.asObservable()),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'sessions', component: MockComponent },
          { path: 'me', component: MockComponent },
          { path: 'login', component: MockComponent },
          { path: 'register', component: MockComponent },
        ]),
        HttpClientModule,
        MatToolbarModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: SessionService, useValue: mockSessionService }],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  // Integration test
  describe('integration test', () => {
    describe('user is logged', () => {
      beforeEach(() => {
        mockIsLoggedSubject.next(true);
        fixture.detectChanges();
      });

      it('should display Sessions, Account and Logout link if logged', async () => {
        const sessionsLink = screen.queryByText('Sessions');
        const accountLink = screen.queryByText('Account');
        const logoutLink = screen.queryByText('Logout');

        expect(sessionsLink).toBeInTheDocument();
        expect(accountLink).toBeInTheDocument();
        expect(logoutLink).toBeInTheDocument();
      });

      it('should NOT display Login and Register link if logged', async () => {
        const loginLink = screen.queryByText('Login');
        const registerLink = screen.queryByText('Register');

        expect(loginLink).not.toBeInTheDocument();
        expect(registerLink).not.toBeInTheDocument();
      });

      it('should call logout() function when Logout link is clicked', async () => {
        const logoutSpyOn = jest.spyOn(component, 'logout');
        const logoutLink = screen.queryByText('Logout');
        expect(logoutLink).toBeInTheDocument();

        fireEvent.click(logoutLink as HTMLElement);
        expect(logoutSpyOn).toHaveBeenCalledTimes(1);
      });

      describe('navigation tests', () => {
        it('should navigate to "/sessions" when Sessions link is clicked', async () => {
          const location = TestBed.inject(Location);

          const sessionsLink = screen.queryByText('Sessions');
          fireEvent.click(sessionsLink as HTMLElement);
          fixture.detectChanges();

          expect(location.path()).toBe('/sessions');
        });

        it('should navigate to "/me" when Accounts link is clicked', async () => {
          const location = TestBed.inject(Location);

          const accountLink = screen.queryByText('Account');
          fireEvent.click(accountLink as HTMLElement);
          fixture.detectChanges();

          expect(location.path()).toBe('/me');
        });

        it('should navigate to "/" when Logout link is clicked', async () => {
          const location = TestBed.inject(Location);

          const logoutLink = screen.queryByText('Logout');
          fireEvent.click(logoutLink as HTMLElement);
          fixture.detectChanges();

          expect(location.path()).toBe('/');
        });
      });
    });

    describe('user is NOT logged', () => {
      beforeEach(() => {
        mockIsLoggedSubject.next(false);
        fixture.detectChanges();
      });

      it('should NOT display Sessions, Account and Logout link if logged', async () => {
        const sessionsLink = screen.queryByText('Sessions');
        const accountLink = screen.queryByText('Account');
        const logoutLink = screen.queryByText('Logout');

        expect(sessionsLink).not.toBeInTheDocument();
        expect(accountLink).not.toBeInTheDocument();
        expect(logoutLink).not.toBeInTheDocument();
      });

      it('should display Login and Register link if logged', async () => {
        const loginLink = screen.queryByText('Login');
        const registerLink = screen.queryByText('Register');

        expect(loginLink).toBeInTheDocument();
        expect(registerLink).toBeInTheDocument();
      });

      describe('navigation tests', () => {
        it('should navigate to "/login" when Login link is clicked', async () => {
          const location = TestBed.inject(Location);

          const loginLink = screen.queryByText('Login');
          fireEvent.click(loginLink as HTMLElement);
          fixture.detectChanges();

          expect(location.path()).toBe('/login');
        });

        it('should navigate to "/register" when Register link is clicked', async () => {
          const location = TestBed.inject(Location);

          const registerLink = screen.queryByText('Register');
          fireEvent.click(registerLink as HTMLElement);
          fixture.detectChanges();

          expect(location.path()).toBe('/register');
        });
      });
    });
  });

  // Unit test
  describe('unit test', () => {
    // $isLogged()
    it('should call sessionService.$isLogged on $isLogged() call', () => {
      component.$isLogged();
      expect(mockSessionService.$isLogged).toHaveBeenCalled();
    });

    // logout()
    describe('on logout() call', () => {
      beforeEach(async () => {
        const ngZone = TestBed.inject(NgZone);
        // ngZone.run permet de garder les appels avec navigate dans le scope du test
        ngZone.run(() => {
          component.logout();
        });
      });

      it('should call sessionService.logOut on logout() call', async () => {
        expect(mockSessionService.logOut).toHaveBeenCalled();
      });

      it('should call sessionService.logOut on logout() call', () => {
        const location = TestBed.inject(Location);
        expect(location.path()).toBe('/');
      });
    });
  });
});
