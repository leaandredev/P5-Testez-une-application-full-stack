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
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';

import { fireEvent, screen } from '@testing-library/angular';
import '@testing-library/jest-dom';
import { RegisterRequest } from '../../interfaces/registerRequest.interface';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let registerRequest: RegisterRequest;

  const mockAuthService = {
    register: jest.fn().mockReturnValue(of({})),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    registerRequest = component.form.value as RegisterRequest;
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
    it('should display "Register" title', () => {
      const titleElement = screen.getByText('Register');
      expect(titleElement).not.toBeNull();
    });

    it('should display email, firstName, lastName and password fields', () => {
      const emailInput = document.querySelector('[formControlName="email"]');
      const firstNameInput = document.querySelector(
        '[formControlName="firstName"]'
      );
      const lastNameInput = document.querySelector(
        '[formControlName="lastName"]'
      );
      const passwordInput = document.querySelector(
        '[formControlName="password"]'
      );

      expect(emailInput).not.toBeNull();
      expect(firstNameInput).not.toBeNull();
      expect(lastNameInput).not.toBeNull();
      expect(passwordInput).not.toBeNull();
    });

    it('should bind email to his FormControl', () => {
      const emailField = component.form.get('email');
      const emailInput = document.querySelector('[formControlName="email"]');

      emailField?.setValue('value@grt.fr');
      fixture.detectChanges();

      expect((emailInput as HTMLInputElement).value).toEqual('value@grt.fr');
    });

    it('should bind firstName to his FormControl', () => {
      const firstNameField = component.form.get('firstName');
      const firstNameInput = document.querySelector(
        '[formControlName="firstName"]'
      );

      firstNameField?.setValue('Jean-Claude');
      fixture.detectChanges();

      expect((firstNameInput as HTMLInputElement).value).toEqual('Jean-Claude');
    });

    it('should bind firstName to his FormControl', () => {
      const lastNameField = component.form.get('lastName');
      const lastNameInput = document.querySelector(
        '[formControlName="lastName"]'
      );

      lastNameField?.setValue('GARDOUT');
      fixture.detectChanges();

      expect((lastNameInput as HTMLInputElement).value).toEqual('GARDOUT');
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
      component.form.controls['firstName'].setValue('Jean-Claude');
      component.form.controls['lastName'].setValue('GARDOUT');
      component.form.controls['password'].setValue('validPassword123');

      fixture.detectChanges();
      const submitButton = screen.getByText('Submit');
      expect(submitButton).not.toBeNull();
      expect(submitButton.hasAttribute('disabled')).toBe(false);
    });

    it('should call submit() function when Submit button is clicked', async () => {
      component.form.controls['email'].setValue('test@example.com');
      component.form.controls['firstName'].setValue('Jean-Claude');
      component.form.controls['lastName'].setValue('GARDOUT');
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
    it('should have onError variable at false when component rendered', () => {
      expect(component.onError).toBe(false);
    });

    it('should have form with email and password field', () => {
      expect(component.form.get('email')).toBeTruthy();
      expect(component.form.get('firstName')).toBeTruthy();
      expect(component.form.get('lastName')).toBeTruthy();
      expect(component.form.get('password')).toBeTruthy();
    });

    it('should have form with email and password field empty', () => {
      expect(component.form.value.email).toBe('');
      expect(component.form.value.firstName).toBe('');
      expect(component.form.value.lastName).toBe('');
      expect(component.form.value.password).toBe('');
    });

    it('should have an invalid form when fields are empty', () => {
      expect(component.form.valid).not.toBeTruthy();
      expect(component.form.controls['email'].valid).not.toBeTruthy();
      expect(component.form.controls['firstName'].valid).not.toBeTruthy();
      expect(component.form.controls['lastName'].valid).not.toBeTruthy();
      expect(component.form.controls['password'].valid).not.toBeTruthy();
    });

    it('should have an invalid email if email format is incorrect', () => {
      const emailField = component.form.get('email');
      emailField?.setValue('testemailinvalid');

      fixture.detectChanges();
      expect(emailField?.valid).not.toBeTruthy();
    });

    // it('should have an invalid password if password is too long (max(20)', () => {
    //   const passwordField = component.form.get('password');
    //   passwordField?.setValue(
    //     'passwordIsVeryTooLoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong'
    //   );

    //   fixture.detectChanges();

    //   console.log(passwordField);

    //   expect(passwordField?.invalid).toBeTruthy();
    // });

    it('should have a valid form when all fields are valid', () => {
      component.form.controls['email'].setValue('test@example.com');
      component.form.controls['firstName'].setValue('Firstname');
      component.form.controls['lastName'].setValue('LASTNAME');
      component.form.controls['password'].setValue('validPassword123');
      expect(component.form.valid).toBeTruthy();
    });

    it('should call sessionService.logIn and navigate to /sessions on successful login', () => {
      mockAuthService.register.mockReturnValue(of({}));

      component.submit();

      expect(mockAuthService.register).toHaveBeenCalledWith(registerRequest);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should set onError to true on failed login', () => {
      mockAuthService.register.mockReturnValue(
        throwError(() => new Error('Login failed'))
      );

      component.submit();

      expect(mockAuthService.register).toHaveBeenCalledWith(registerRequest);
      expect(component.onError).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });
});
