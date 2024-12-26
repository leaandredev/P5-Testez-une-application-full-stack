import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  public createDb() {
    const teachers = [
      {
        id: 456,
        lastName: 'Doe',
        firstName: 'John',
        createdAt: new Date('2024-12-01T00:00:00').toISOString(),
        updatedAt: new Date('2024-12-01T00:00:00').toISOString(),
      },
      {
        id: 457,
        lastName: 'Troy',
        firstName: 'Odysseus',
        createdAt: new Date('2024-12-08T00:00:00').toISOString(),
        updatedAt: new Date('2024-12-08T00:00:00').toISOString(),
      },
      {
        id: 458,
        lastName: 'Smith',
        firstName: 'Anna',
        createdAt: new Date('2024-12-15T00:00:00').toISOString(),
        updatedAt: new Date('2024-12-15T00:00:00').toISOString(),
      },
    ];

    const sessions = [
      {
        id: 1,
        title: 'Introduction to Angular',
        startDate: new Date('2024-12-20T10:00:00').toISOString(),
        endDate: new Date('2024-12-20T12:00:00').toISOString(),
        teacherId: 456,
      },
      {
        id: 2,
        title: 'Advanced TypeScript',
        startDate: new Date('2024-12-22T14:00:00').toISOString(),
        endDate: new Date('2024-12-22T16:00:00').toISOString(),
        teacherId: 457,
      },
    ];

    return {
      teacher: teachers,
      session: sessions,
    };
  }
}
