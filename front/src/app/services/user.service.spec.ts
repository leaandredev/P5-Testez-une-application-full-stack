import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { expect } from '@jest/globals';

import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUsers: User[] = [
    {
      id: 1,
      email: 'admin@example.com',
      lastName: 'Admin',
      firstName: 'Super',
      admin: true,
      password: 'password123',
      createdAt: new Date('2024-01-01T08:00:00'),
      updatedAt: new Date('2024-01-01T08:00:00'),
    },
    {
      id: 2,
      email: 'john.doe@example.com',
      lastName: 'Doe',
      firstName: 'John',
      admin: false,
      password: 'password123',
      createdAt: new Date('2024-02-15T10:30:00'),
      updatedAt: new Date('2024-02-15T10:30:00'),
    },
    {
      id: 3,
      email: 'jane.smith@example.com',
      lastName: 'Smith',
      firstName: 'Jane',
      admin: false,
      password: 'password123',
      createdAt: new Date('2024-03-10T14:45:00'),
      updatedAt: new Date('2024-03-20T12:00:00'),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Check that all HTTP request are handled
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a user by ID', () => {
    service.getById('2').subscribe((user: User) => {
      expect(user).toBeTruthy();
      expect(user.id).toBe(2);
      expect(user.email).toBe('john.doe@example.com');
      expect(user.lastName).toBe('Doe');
      expect(user.admin).toBe(false);
    });

    const req = httpMock.expectOne('api/user/2');
    expect(req.request.method).toBe('GET');

    req.flush(mockUsers);
  });

  it('should delete a user by ID', () => {
    service.delete('3').subscribe((response) => {
      expect(response).not.toBeNull();
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('api/user/3');
    expect(req.request.method).toBe('DELETE');

    req.flush(mockUsers);
  });
});
