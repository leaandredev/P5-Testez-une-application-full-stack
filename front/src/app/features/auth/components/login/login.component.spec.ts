import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { LoginRequest } from '../../interfaces/loginRequest.interface';

import { fireEvent, screen } from '@testing-library/angular';
import '@testing-library/jest-dom';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginRequest: LoginRequest;

  const mockSessionInformation = {
    token: 'token1234',
    type: 'string',
    id: 1,
    username: 'user name',
    firstName: 'Firstname',
    lastName: 'LASTNAME',
    admin: true,
  };

  const mockAuthService = {
    login: jest.fn().mockReturnValue(of(mockSessionInformation)),
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
    logIn: jest.fn(),
    logOut: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginRequest = component.form.value as LoginRequest;
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

  // integration test
  describe('integration test', () => {
    it('should display "Login" title', () => {
      const titleElement = screen.getByText('Login');
      expect(titleElement).not.toBeNull();
      expect(titleElement?.textContent).toBe('Login');
    });

    it('should display email and password fields', () => {
      const emailInput = document.querySelector('[formControlName="email"]');
      const passwordInput = document.querySelector(
        '[formControlName="password"]'
      );

      expect(emailInput).not.toBeNull();
      expect(passwordInput).not.toBeNull();
    });

    it('should bind email to his FormControl', () => {
      const emailField = component.form.get('email');
      const emailInput = document.querySelector('[formControlName="email"]');

      emailField?.setValue('value@grt.fr');
      fixture.detectChanges();

      expect((emailInput as HTMLInputElement).value).toEqual('value@grt.fr');
    });

    it('should bind password to his FormControl', () => {
      const passwordField = component.form.get('password');
      const passwordInput = document.querySelector(
        '[formControlName="password"]'
      );

      passwordField?.setValue('password123');
      fixture.detectChanges();

      expect((passwordInput as HTMLInputElement).value).toEqual('password123');
    });

    it('should display submit button disabled at first', () => {
      const submitButton = screen.getByText('Submit');

      expect(submitButton).not.toBeNull();
      expect(submitButton.hasAttribute('disabled')).toBe(true);
    });

    it('should display submit button clickable if form is valid', () => {
      component.form.controls['email'].setValue('test@example.com');
      component.form.controls['password'].setValue('validPassword123');

      fixture.detectChanges();
      const submitButton = screen.getByText('Submit');
      expect(submitButton).not.toBeNull();
      expect(submitButton.hasAttribute('disabled')).toBe(false);
    });

    it('should call submit() function when Submit button is clicked', async () => {
      component.form.controls['email'].setValue('test@example.com');
      component.form.controls['password'].setValue('validPassword123');
      fixture.detectChanges();

      const submitSpyOn = jest.spyOn(component, 'submit');
      const submitButton = screen.getByText('Submit');
      expect(submitButton).not.toBeNull();

      fireEvent.click(submitButton as HTMLElement);
      expect(submitSpyOn).toHaveBeenCalledTimes(1);
    });

    it('should display error message if an error has occured', () => {
      component.onError = true;
      fixture.detectChanges();

      const errorMessage = screen.getByText('An error occurred');
      expect(errorMessage).not.toBeNull();
    });
  });

  // unit test
  describe('unit test', () => {
    it('should have hide variable at true when component rendered', () => {
      expect(component.hide).toBe(true);
    });

    it('should have onError variable at false when component rendered', () => {
      expect(component.onError).toBe(false);
    });

    it('should have form with email and password field', () => {
      expect(component.form.get('email')).toBeTruthy();
      expect(component.form.get('password')).toBeTruthy();
    });

    it('should have form with email and password field empty', () => {
      expect(component.form.value.email).toBe('');
      expect(component.form.value.password).toBe('');
    });

    it('should have an invalid form when fields are empty', () => {
      expect(component.form.valid).not.toBeTruthy();
      expect(component.form.controls['email'].valid).not.toBeTruthy();
      expect(component.form.controls['password'].valid).not.toBeTruthy();
    });

    // it('should have an invalid password if password is too short', () => {
    //   const passwordField = component.form.get('password');
    //   passwordField?.setValue('12');

    //   fixture.detectChanges();
    //   expect(passwordField?.valid).not.toBeTruthy();
    // });

    it('should have an invalid email if email format is incorrect', () => {
      const emailField = component.form.get('email');
      emailField?.setValue('testemailinvalid');

      fixture.detectChanges();
      expect(emailField?.valid).not.toBeTruthy();
    });

    it('should have a valid form when all fields are valid', () => {
      component.form.controls['email'].setValue('test@example.com');
      component.form.controls['password'].setValue('validPassword123');
      expect(component.form.valid).toBeTruthy();
    });

    it('should call sessionService.logIn and navigate to /sessions on successful login', () => {
      mockAuthService.login.mockReturnValue(of(mockSessionInformation));

      component.submit();

      expect(mockAuthService.login).toHaveBeenCalledWith(loginRequest);
      expect(mockSessionService.logIn).toHaveBeenCalledWith(
        mockSessionInformation
      );
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    });

    it('should set onError to true on failed login', () => {
      mockAuthService.login.mockReturnValue(
        throwError(() => new Error('Login failed'))
      );

      component.submit();

      expect(mockAuthService.login).toHaveBeenCalledWith(loginRequest);
      expect(component.onError).toBe(true);
      expect(mockSessionService.logIn).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });
});
