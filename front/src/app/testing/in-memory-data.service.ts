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

    const users = [
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

    return {
      teacher: teachers,
      session: sessions,
      user: users,
    };
  }
}
