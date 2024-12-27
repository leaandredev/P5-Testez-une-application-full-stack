import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Session } from '../interfaces/session.interface';

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  const mockSessions: Session[] = [
    {
      id: 1,
      name: 'Introduction to Yoga',
      description: 'Learn the basics of yoga.',
      date: new Date('2024-12-20T10:00:00'),
      teacher_id: 456,
      users: [101, 102],
      createdAt: new Date('2024-12-01T08:00:00'),
      updatedAt: new Date('2024-12-10T09:00:00'),
    },
    {
      id: 2,
      name: 'Advanced Yoga Class',
      description: 'A deeper dive into yoga techniques.',
      date: new Date('2024-12-22T14:00:00'),
      teacher_id: 457,
      users: [103, 104, 105],
      createdAt: new Date('2024-12-05T08:00:00'),
      updatedAt: new Date('2024-12-15T09:00:00'),
    },
  ];

  const mockSession: Session = {
    id: 3,
    name: 'Yoga for Beginners',
    description: 'An introductory yoga class for new practitioners.',
    date: new Date('2024-12-23T10:00:00'),
    teacher_id: 458,
    users: [],
    createdAt: new Date('2024-12-08T08:00:00'),
    updatedAt: new Date('2024-12-18T09:00:00'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Check that all HTTP request are handled
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all sessions', () => {
    service.all().subscribe((sessions) => {
      expect(sessions.length).toBe(2);
      expect(sessions).toEqual(mockSessions);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush(mockSessions);
  });

  it('should fetch session details by ID', () => {
    const sessionId = '1';
    service.detail(sessionId).subscribe((session) => {
      expect(session).toBeTruthy();
      expect(session.id).toBe(1);
      expect(session.name).toBe('Introduction to Yoga');
    });

    const req = httpMock.expectOne(`api/session/${sessionId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSessions[0]);
  });

  it('should create a new session', () => {
    service.create(mockSession).subscribe((session) => {
      expect(session).toBeTruthy();
      expect(session.id).toBe(mockSession.id);
      expect(session.name).toBe(mockSession.name);
    });

    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSession);
    req.flush(mockSession);
  });

  it('should update an existing session', () => {
    const updatedSession: Session = {
      ...mockSession,
      name: 'Updated Yoga Class',
    };

    service.update('3', updatedSession).subscribe((session) => {
      expect(session).toBeTruthy();
      expect(session.name).toBe('Updated Yoga Class');
    });

    const req = httpMock.expectOne('api/session/3');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedSession);
    req.flush(updatedSession);
  });

  it('should delete a session by ID', () => {
    service.delete('3').subscribe((response) => {
      expect(response).toBeNull(); // Simule une réponse vide pour DELETE
    });

    const req = httpMock.expectOne('api/session/3');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should allow a user to participate in a session', () => {
    service.participate('3', '123').subscribe((response) => {
      expect(response).toBeUndefined(); // POST void
    });

    const req = httpMock.expectOne('api/session/3/participate/123');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();
    req.flush(null);
  });

  it('should allow a user to unparticipate from a session', () => {
    service.unParticipate('3', '123').subscribe((response) => {
      expect(response).toBeUndefined(); // DELETE void
    });

    const req = httpMock.expectOne('api/session/3/participate/123');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
