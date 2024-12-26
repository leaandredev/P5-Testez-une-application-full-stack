import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import { Teacher } from '../interfaces/teacher.interface';
import { HttpClientModule } from '@angular/common/http';
import { InMemoryDataService } from '../testing/in-memory-data.service';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

describe('TeacherService', () => {
  let service: TeacherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
          delay: 500,
        }), // Simulated backend
      ],
    });
    service = TestBed.inject(TeacherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all teachers from the backend', (done) => {
    service.all().subscribe((teachers) => {
      expect(teachers.length).toBe(3);
      expect(teachers[0].lastName).toBe('Doe');
      done();
    });
  });

  it('should fetch teacher details from the backend', (done) => {
    service.detail('457').subscribe((teacher) => {
      expect(teacher.lastName).toBe('Troy');
      expect(teacher.firstName).toBe('Odysseus');
      done();
    });
  });
});
