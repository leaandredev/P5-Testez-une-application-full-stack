import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockRegisterRequest: RegisterRequest = {
    email: 'newuser@example.com',
    firstName: 'New',
    lastName: 'User',
    password: 'password123',
  };

  const mockLoginRequest: LoginRequest = {
    email: 'existinguser@example.com',
    password: 'password123',
  };

  const mockSessionInformation: SessionInformation = {
    token: 'abc123',
    id: 1,
    username: 'existingUser',
    type: '',
    firstName: '',
    lastName: '',
    admin: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a new user', () => {
    service.register(mockRegisterRequest).subscribe((response) => {
      expect(response).toBeUndefined(); // POST void
    });

    const req = httpMock.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegisterRequest);
    req.flush(null);
  });

  it('should log in an existing user and return session information', () => {
    service.login(mockLoginRequest).subscribe((sessionInfo) => {
      expect(sessionInfo).toBeTruthy();
      expect(sessionInfo.token).toBe(mockSessionInformation.token);
      expect(sessionInfo.id).toBe(mockSessionInformation.id);
      expect(sessionInfo.username).toBe(mockSessionInformation.username);
    });

    const req = httpMock.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLoginRequest);
    req.flush(mockSessionInformation);
  });
});
