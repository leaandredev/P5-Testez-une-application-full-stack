import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;

  const mockSessionInformation: SessionInformation = {
    id: 1,
    admin: true,
    username: '',
    token: '',
    type: '',
    firstName: '',
    lastName: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBe(undefined);
    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(false);
    });
  });

  it('should log a user with correct values', () => {
    service.logIn(mockSessionInformation);
    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toBe(mockSessionInformation);
    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(true);
    });
  });

  it('should log out a user and return to default values', () => {
    service.logOut();
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBe(undefined);
    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(false);
    });
  });

  it('should call next() when logIn is called', () => {
    const spyNext = jest.spyOn(service as any, 'next');
    service.logIn(mockSessionInformation);
    expect(spyNext).toHaveBeenCalled();
  });

  it('should call next() when logOut is called', () => {
    const spyNext = jest.spyOn(service as any, 'next');
    service.logOut();
    expect(spyNext).toHaveBeenCalled();
  });

  it('should handle login and logout correctly', () => {
    service.logIn(mockSessionInformation);
    expect(service.isLogged).toBe(true);

    service.logOut();
    expect(service.isLogged).toBe(false);

    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(false);
    });
  });
});
