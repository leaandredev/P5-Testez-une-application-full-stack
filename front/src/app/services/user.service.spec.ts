import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { UserService } from './user.service';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from '../testing/in-memory-data.service';
import { User } from '../interfaces/user.interface';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
          delay: 800,
        }), // Simulated backend
      ],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a user by ID', (done) => {
    service.getById('2').subscribe((user: User) => {
      expect(user).toBeTruthy();
      expect(user.id).toBe(2);
      expect(user.email).toBe('john.doe@example.com');
      expect(user.lastName).toBe('Doe');
      expect(user.admin).toBe(false);
      done();
    });
  });

  it('should delete a user by ID', (done) => {
    service.delete('3').subscribe((response) => {
      expect(response).not.toBeNull();
      expect(response).toBeTruthy();
      done();
    });
  });
});
