import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import { Teacher } from '../interfaces/teacher.interface';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  const mockTeachers: Teacher[] = [
    {
      id: 456,
      lastName: 'Doe',
      firstName: 'John',
      createdAt: new Date('2024-12-01T00:00:00'),
      updatedAt: new Date('2024-12-01T00:00:00'),
    },
    {
      id: 457,
      lastName: 'Troy',
      firstName: 'Odysseus',
      createdAt: new Date('2024-12-08T00:00:00'),
      updatedAt: new Date('2024-12-08T00:00:00'),
    },
    {
      id: 458,
      lastName: 'Smith',
      firstName: 'Anna',
      createdAt: new Date('2024-12-15T00:00:00'),
      updatedAt: new Date('2024-12-15T00:00:00'),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Check that all HTTP request are handled
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all teachers', () => {
    service.all().subscribe((teachers) => {
      expect(teachers).toEqual(mockTeachers);
    });

    const req = httpMock.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');

    // Mock response
    req.flush(mockTeachers);
  });

  it('should fetch details of a teacher', () => {
    const mockTeacher = mockTeachers[1];

    service.detail('457').subscribe((teacher) => {
      expect(teacher).toEqual(mockTeacher);
    });

    const req = httpMock.expectOne('api/teacher/457');
    expect(req.request.method).toBe('GET');

    req.flush(mockTeacher);
  });
});
