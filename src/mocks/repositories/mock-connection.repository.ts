import type { ConnectionRepository } from '@/domain/repositories/connection.repository';
import type { Connection } from '@/domain/models/connection';
import { getMockDb, delay } from '../mock-db';
import { NotFoundError } from '@/domain/errors/domain-error';

export class MockConnectionRepository implements ConnectionRepository {
  async getConnections(): Promise<Connection[]> {
    await delay();
    return getMockDb().connections;
  }

  async getConnectionById(id: string): Promise<Connection | null> {
    await delay(200);
    return getMockDb().connections.find((c) => c.id === id) ?? null;
  }

  async endConnection(id: string): Promise<void> {
    await delay(300);
    const db = getMockDb();
    const conn = db.connections.find((c) => c.id === id);
    if (!conn) throw new NotFoundError('Connection', id);
    conn.status = 'ended';
  }

  async archiveConnection(id: string): Promise<void> {
    await delay(300);
    const db = getMockDb();
    const conn = db.connections.find((c) => c.id === id);
    if (!conn) throw new NotFoundError('Connection', id);
    conn.status = 'archived';
  }
}
